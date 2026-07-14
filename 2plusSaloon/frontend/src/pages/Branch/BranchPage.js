import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

export default function BranchPage() {
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
      const r = await api.get('/branches', { params: { page, size: 10 } });
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
      if (editing) await api.put(`/branches/${editing.id}`, form);
      else         await api.post('/branches', form);
      toast.success(editing ? 'Branch updated!' : 'Branch added!');
      setShow(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this Branch?')) return;
    try { await api.delete(`/branches/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Error deleting'); }
  };

  const filtered = data.filter(d =>
    JSON.stringify(d).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key:'branchCode', label:'Code',   style:{ width:100 } },
    { key:'branchName', label:'Branch', render:(v,r) => <><div className="fw-500">{v}</div><small className="text-muted">{r.city}{r.city && r.state ? ', ' : ''}{r.state}</small></> },
    { key:'phone', label:'Phone' },
    { key:'email', label:'Email' },
    { key:'gstNumber', label:'GST No.' },
    { key:'status', label:'Status', render: v => <StatusBadge value={v ? 'ACTIVE' : 'INACTIVE'} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Branch Management"
        subtitle="Manage salon branches"
        onAdd={openAdd}
        addLabel="Add Branch"
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
                <h5 className="modal-title fw-600">{editing ? 'Edit' : 'Add'} Branch</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    
                    <div className="col-md-6">
                      <label className="form-label">Branch Name *</label>
                      <input className="form-control" value={form.branchName || ''} onChange={e => setForm({ ...form, branchName: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input className="form-control" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">GST Number</label>
                      <input className="form-control" value={form.gstNumber || ''} onChange={e => setForm({ ...form, gstNumber: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input className="form-control" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input className="form-control" value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Country</label>
                      <input className="form-control" value={form.country || 'India'} onChange={e => setForm({ ...form, country: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea className="form-control" rows={2} value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'} Branch</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
