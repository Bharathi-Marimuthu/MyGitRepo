import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import toast from 'react-hot-toast';

const CATEGORIES = ['RENT','ELECTRICITY','SALARY','MAINTENANCE','INTERNET','MARKETING','MISCELLANEOUS'];
const CAT_ICONS = { RENT:'bi-house',ELECTRICITY:'bi-lightning',SALARY:'bi-person-badge',MAINTENANCE:'bi-tools',INTERNET:'bi-wifi',MARKETING:'bi-megaphone',MISCELLANEOUS:'bi-three-dots' };
const CAT_COLORS = { RENT:'#6C3FC5',ELECTRICITY:'#F59E0B',SALARY:'#10B981',MAINTENANCE:'#3B82F6',INTERNET:'#8B5CF6',MARKETING:'#EF4444',MISCELLANEOUS:'#6B7280' };

export default function ExpensePage() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]     = useState(false);
  const [form, setForm]     = useState({ expenseDate: new Date().toISOString().split('T')[0], category:'RENT', branchId:1 });
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await api.get('/expenses',{params:{page:0,size:50}}); setData(r.data.data?.content||[]); }
    catch { setData([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async e => {
    e.preventDefault();
    try { await api.post('/expenses', form); toast.success('Expense added!'); setShow(false); load(); }
    catch(err) { toast.error(err.response?.data?.message||'Error saving'); }
  };

  const handleDelete = async id => {
    if(!window.confirm('Delete this expense?')) return;
    try { await api.delete(`/expenses/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Error deleting'); }
  };

  const filtered = data.filter(d => {
    const ms = !search||JSON.stringify(d).toLowerCase().includes(search.toLowerCase());
    const mc = !filterCat||d.category===filterCat;
    return ms&&mc;
  });

  const totalByCategory = CATEGORIES.reduce((acc,c)=>({ ...acc, [c]: data.filter(d=>d.category===c).reduce((s,d)=>s+Number(d.amount),0) }),{});
  const grandTotal = data.reduce((s,d)=>s+Number(d.amount),0);

  return (
    <div>
      <PageHeader title="Expense Management" subtitle="Track and manage salon expenses"
        onAdd={()=>{ setForm({expenseDate:new Date().toISOString().split('T')[0],category:'RENT',branchId:1}); setShow(true); }}
        addLabel="Add Expense"
        extra={
          <div className="d-flex gap-2">
            <div className="search-box"><i className="bi bi-search search-icon"/><input className="form-control" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:'2.5rem'}}/></div>
            <select className="form-select" style={{width:160}} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        }
      />

      {/* Category Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card p-3 text-center" style={{borderLeft:'4px solid var(--primary)'}}>
            <div className="text-muted small mb-1">Total Expenses</div>
            <div className="fw-700 fs-4 text-primary">₹{grandTotal.toLocaleString('en-IN')}</div>
            <div className="text-muted small">{data.length} records</div>
          </div>
        </div>
        {CATEGORIES.slice(0,3).map(c=>(
          <div key={c} className="col-md-3">
            <div className="card p-3" style={{borderLeft:`4px solid ${CAT_COLORS[c]}`}}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small mb-1">{c}</div>
                  <div className="fw-700 fs-5" style={{color:CAT_COLORS[c]}}>₹{totalByCategory[c].toLocaleString('en-IN')}</div>
                </div>
                <i className={"bi "+CAT_ICONS[c]+" fs-4"} style={{color:CAT_COLORS[c]}}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card table-card">
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary"/></div> :
        !filtered.length ? <div className="text-center py-5 text-muted"><i className="bi bi-wallet2 fs-2 d-block mb-2"/><p>No expenses found</p></div> : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th><th>Branch</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(e=>(
                  <tr key={e.id}>
                    <td className="small fw-500">{e.expenseDate}</td>
                    <td>
                      <span className="d-flex align-items-center gap-2">
                        <span style={{width:28,height:28,borderRadius:6,background:CAT_COLORS[e.category]+'20',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
                          <i className={"bi "+CAT_ICONS[e.category]} style={{color:CAT_COLORS[e.category],fontSize:'.8rem'}}/>
                        </span>
                        <span className="small fw-500">{e.category}</span>
                      </span>
                    </td>
                    <td><span className="fw-700 text-danger">₹{Number(e.amount).toLocaleString('en-IN')}</span></td>
                    <td className="small text-muted">{e.description||'—'}</td>
                    <td className="small">{e.branch?.branchName||'—'}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(e.id)}><i className="bi bi-trash"/></button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="fw-700">
                  <td colSpan={2} className="text-end">Total:</td>
                  <td className="text-danger">₹{filtered.reduce((s,e)=>s+Number(e.amount),0).toLocaleString('en-IN')}</td>
                  <td colSpan={3}/>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {show && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-600">Add Expense</h5>
                <button className="btn-close" onClick={()=>setShow(false)}/>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12"><label className="form-label">Date *</label><input type="date" className="form-control" value={form.expenseDate||''} onChange={e=>setForm({...form,expenseDate:e.target.value})} required/></div>
                    <div className="col-12"><label className="form-label">Category *</label>
                      <div className="row g-2">
                        {CATEGORIES.map(c=>(
                          <div key={c} className="col-6">
                            <div className={"p-2 rounded-2 border text-center small cursor-pointer "+(form.category===c?'border-primary':'bg-light')}
                              style={{cursor:'pointer',background:form.category===c?CAT_COLORS[c]+'15':'',borderColor:form.category===c?CAT_COLORS[c]:''}}
                              onClick={()=>setForm({...form,category:c})}>
                              <i className={"bi "+CAT_ICONS[c]+" d-block mb-1"} style={{color:CAT_COLORS[c]}}/>{c}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-12"><label className="form-label">Amount (₹) *</label><input type="number" className="form-control" value={form.amount||''} onChange={e=>setForm({...form,amount:e.target.value})} required placeholder="0.00"/></div>
                    <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What was this expense for?"/></div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={()=>setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Expense</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
