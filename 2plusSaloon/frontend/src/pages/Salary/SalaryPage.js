import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

export default function SalaryPage() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]     = useState(false);
  const [form, setForm]     = useState({ salaryMonth: new Date().toISOString().slice(0,7) });
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await api.get('/salary',{params:{page:0,size:50}}); setData(r.data.data?.content||[]); }
    catch { setData([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async e => {
    e.preventDefault();
    const salary = { ...form,
      finalSalary: (Number(form.basicSalary||0)+Number(form.incentive||0)+Number(form.commission||0)-Number(form.deduction||0)).toFixed(2)
    };
    try { await api.post('/salary', salary); toast.success('Salary record saved!'); setShow(false); load(); }
    catch(err) { toast.error(err.response?.data?.message||'Error saving'); }
  };

  const basic  = form.basicSalary||0;
  const inc    = form.incentive||0;
  const comm   = form.commission||0;
  const ded    = form.deduction||0;
  const final  = (Number(basic)+Number(inc)+Number(comm)-Number(ded));

  const filtered = data.filter(d=>JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));
  const totalPayroll = data.filter(d=>d.paymentStatus==='PAID').reduce((s,d)=>s+Number(d.finalSalary||0),0);

  return (
    <div>
      <PageHeader title="Salary Management" subtitle="Process and track employee salaries"
        onAdd={()=>{ setForm({salaryMonth:new Date().toISOString().slice(0,7)}); setShow(true); }}
        addLabel="Process Salary"
        extra={<div className="search-box"><i className="bi bi-search search-icon"/><input className="form-control" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:'2.5rem'}}/></div>}
      />

      {/* Summary */}
      <div className="row g-3 mb-4">
        {[
          { label:'Total Payroll (Paid)', value:`₹${totalPayroll.toLocaleString('en-IN')}`, icon:'bi-cash-stack', color:'#10B981' },
          { label:'Pending Salaries', value:data.filter(d=>d.paymentStatus==='PENDING').length, icon:'bi-clock', color:'#F59E0B' },
          { label:'Total Records', value:data.length, icon:'bi-file-text', color:'#6C3FC5' },
        ].map(s=>(
          <div key={s.label} className="col-md-4">
            <div className="card p-3 d-flex flex-row align-items-center gap-3" style={{borderLeft:`4px solid ${s.color}`}}>
              <i className={"bi "+s.icon+" fs-3"} style={{color:s.color}}/>
              <div><div className="fw-700 fs-4" style={{color:s.color}}>{s.value}</div><div className="text-muted small">{s.label}</div></div>
            </div>
          </div>
        ))}
      </div>

      <div className="card table-card">
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary"/></div> :
        !filtered.length ? <div className="text-center py-5 text-muted"><i className="bi bi-cash-coin fs-2 d-block mb-2"/><p>No salary records found</p></div> : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>Employee</th><th>Month</th><th>Basic</th><th>Incentive</th><th>Commission</th><th>Deduction</th><th>Final Salary</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(s=>(
                  <tr key={s.id}>
                    <td><div className="fw-500 small">{s.employee?.fullName}</div><div className="text-muted" style={{fontSize:'.7rem'}}>{s.employee?.designation}</div></td>
                    <td className="small fw-500">{s.salaryMonth}</td>
                    <td className="small">₹{Number(s.basicSalary||0).toLocaleString('en-IN')}</td>
                    <td className="small text-success">+₹{Number(s.incentive||0).toLocaleString('en-IN')}</td>
                    <td className="small text-info">+₹{Number(s.commission||0).toLocaleString('en-IN')}</td>
                    <td className="small text-danger">-₹{Number(s.deduction||0).toLocaleString('en-IN')}</td>
                    <td><span className="fw-700 text-primary">₹{Number(s.finalSalary||0).toLocaleString('en-IN')}</span></td>
                    <td><StatusBadge value={s.paymentStatus}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {show && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-600">Process Salary</h5>
                <button className="btn-close" onClick={()=>setShow(false)}/>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">Employee ID *</label><input type="number" className="form-control" value={form.employeeId||''} onChange={e=>setForm({...form,employeeId:e.target.value})} required/></div>
                    <div className="col-md-6"><label className="form-label">Salary Month *</label><input type="month" className="form-control" value={form.salaryMonth||''} onChange={e=>setForm({...form,salaryMonth:e.target.value})} required/></div>
                    <div className="col-md-6"><label className="form-label">Basic Salary (₹)</label><input type="number" className="form-control" value={form.basicSalary||''} onChange={e=>setForm({...form,basicSalary:e.target.value})}/></div>
                    <div className="col-md-6"><label className="form-label">Incentive (₹)</label><input type="number" className="form-control" value={form.incentive||''} onChange={e=>setForm({...form,incentive:e.target.value})}/></div>
                    <div className="col-md-6"><label className="form-label">Commission (₹)</label><input type="number" className="form-control" value={form.commission||''} onChange={e=>setForm({...form,commission:e.target.value})}/></div>
                    <div className="col-md-6"><label className="form-label">Deduction (₹)</label><input type="number" className="form-control" value={form.deduction||''} onChange={e=>setForm({...form,deduction:e.target.value})}/></div>
                    <div className="col-12">
                      <div className="p-3 rounded-3" style={{background:'var(--primary-light)'}}>
                        <div className="d-flex justify-content-between fw-700 fs-5">
                          <span>Calculated Final Salary</span>
                          <span className="text-primary">₹{final.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-muted small mt-1">Basic ({basic}) + Incentive ({inc}) + Commission ({comm}) - Deduction ({ded})</div>
                      </div>
                    </div>
                    <div className="col-md-6"><label className="form-label">Payment Status</label><select className="form-select" value={form.paymentStatus||'PENDING'} onChange={e=>setForm({...form,paymentStatus:e.target.value})}><option>PENDING</option><option>PAID</option></select></div>
                    <div className="col-md-6"><label className="form-label">Payment Date</label><input type="date" className="form-control" value={form.paymentDate||''} onChange={e=>setForm({...form,paymentDate:e.target.value})}/></div>
                    <div className="col-12"><label className="form-label">Remarks</label><textarea className="form-control" rows={2} value={form.remarks||''} onChange={e=>setForm({...form,remarks:e.target.value})}/></div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={()=>setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Salary Record</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
