import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const [data, setData]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [show, setShow]             = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({});
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/products', { params: { page, size: 10 } });
      const d = r.data.data;
      const content = d?.content || (Array.isArray(d) ? d : []);
      setData(content);
      setTotalPages(d?.totalPages || 1);
    } catch { setData([]); } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm({}); setShow(true); };
  const openEdit = row => { setEditing(row); setForm(row); setShow(true); };

  const handleSave = async e => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/products/${editing.id}`, form);
      else         await api.post('/products', form);
      toast.success(editing ? 'Product updated!' : 'Product added!');
      setShow(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this Product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Error deleting'); }
  };

  const filtered = data.filter(d =>
    JSON.stringify(d).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key:'productCode',  label:'Code',    style:{ width:100 } },
    { key:'productName',  label:'Product', render:(v,r) => <><div className="fw-500">{v}</div><small className="text-muted">{r.brand}</small></> },
    { key:'sellingPrice', label:'Price',   render: v => <span className="fw-600">₹{Number(v).toLocaleString('en-IN')}</span> },
    {
      key:'quantity',
      label:'Stock',
      render:(v,r) => (
        <span className={"fw-600 " + (v <= r.reorderLevel ? 'text-danger' : 'text-success')}>
          {v}
          {v <= r.reorderLevel && <i className="bi bi-exclamation-triangle-fill ms-1" title="Low stock!" />}
        </span>
      )
    },
    { key:'status', label:'Status', render: v => <StatusBadge value={v ? 'ACTIVE' : 'INACTIVE'} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Product Management"
        subtitle="Manage inventory and stock"
        onAdd={openAdd}
        addLabel="Add Product"
        extra={
          <div className="search-box">
            <i className="bi bi-search search-icon" />
            <input
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft:'2.5rem' }}
            />
          </div>
        }
      />

      <div className="card table-card">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 p-3">
            <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span className="align-self-center small">Page {page + 1} of {totalPages}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>

      {show && (
        <div className="modal d-block" style={{ background:'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-600">{editing ? 'Edit' : 'Add'} Product</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    
                    <div className="col-md-6">
                      <label className="form-label">Product Name *</label>
                      <input className="form-control" value={form.productName || ''} onChange={e => setForm({ ...form, productName: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Brand</label>
                      <input className="form-control" value={form.brand || ''} onChange={e => setForm({ ...form, brand: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Purchase Price (₹)</label>
                      <input type="number" className="form-control" value={form.purchasePrice || ''} onChange={e => setForm({ ...form, purchasePrice: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Selling Price (₹) *</label>
                      <input type="number" className="form-control" value={form.sellingPrice || ''} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Quantity</label>
                      <input type="number" className="form-control" value={form.quantity || 0} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Reorder Level</label>
                      <input type="number" className="form-control" value={form.reorderLevel || 5} onChange={e => setForm({ ...form, reorderLevel: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'} Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
