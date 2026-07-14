import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

export default function ServicePage() {
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
      const r = await api.get('/services', { params: { page, size: 10 } });
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
      if (editing) await api.put(`/services/${editing.id}`, form);
      else         await api.post('/services', form);
      toast.success(editing ? 'Service updated!' : 'Service added!');
      setShow(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this Service?')) return;
    try { await api.delete(`/services/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Error deleting'); }
  };

  const filtered = data.filter(d =>
    JSON.stringify(d).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key:'serviceCode',  label:'Code',     style:{ width:100 } },
    { key:'serviceName',  label:'Service',  render:(v,r) => <><div className="fw-500">{v}</div><small className="text-muted">{r.category}</small></> },
    { key:'durationMins', label:'Duration', render: v => v ? v + ' min' : '—' },
    { key:'price',        label:'Price',    render: v => <span className="fw-600">₹{Number(v).toLocaleString('en-IN')}</span> },
    { key:'gstPercentage', label:'GST',     render: v => v + '%' },
    { key:'status', label:'Status',         render: v => <StatusBadge value={v ? 'ACTIVE' : 'INACTIVE'} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Service Management"
        subtitle="Manage salon services and pricing"
        onAdd={openAdd}
        addLabel="Add Service"
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
                <h5 className="modal-title fw-600">{editing ? 'Edit' : 'Add'} Service</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    
                    <div className="col-md-6">
                      <label className="form-label">Service Name *</label>
                      <input className="form-control" value={form.serviceName || ''} onChange={e => setForm({ ...form, serviceName: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })}>
                        <option value="">Select Category</option>
                        <option>Hair Cut</option><option>Beard Trim</option><option>Hair Coloring</option>
                        <option>Hair Spa</option><option>Facial</option><option>Pedicure</option>
                        <option>Manicure</option><option>Bridal Package</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Price (₹) *</label>
                      <input type="number" className="form-control" value={form.price || ''} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Duration (mins)</label>
                      <input type="number" className="form-control" value={form.durationMins || ''} onChange={e => setForm({ ...form, durationMins: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">GST %</label>
                      <input type="number" className="form-control" value={form.gstPercentage || 18} onChange={e => setForm({ ...form, gstPercentage: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'} Service</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
