import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const STATUS_COLORS = { BOOKED:'#3B82F6', IN_PROGRESS:'#F59E0B', COMPLETED:'#10B981', CANCELLED:'#EF4444', NO_SHOW:'#6B7280' };

export default function AppointmentPage() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]     = useState(false);
  const [form, setForm]     = useState({ appointmentDate: new Date().toISOString().split('T')[0] });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [view, setView]     = useState('list'); // list | calendar

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/appointments', { params: { page: 0, size: 50 } });
      setData(r.data.data?.content || []);
    } catch { setData([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async e => {
    e.preventDefault();
    try {
      await api.post('/appointments', form);
      toast.success('Appointment booked!');
      setShow(false); load();
    } catch(err) { toast.error(err.response?.data?.message || 'Error saving'); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/appointments/${id}/status`, null, { params: { status } }); toast.success('Status updated'); load(); }
    catch { toast.error('Error updating status'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this appointment?')) return;
    try { await api.delete(`/appointments/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Error deleting'); }
  };

  const filtered = data.filter(d => {
    const matchSearch = !search || JSON.stringify(d).toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calendar data
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const apptDays = new Set(data.map(a => new Date(a.appointmentDate).getDate()));

  return (
    <div>
      <PageHeader title="Appointment Management" subtitle="Schedule and manage customer appointments"
        onAdd={() => { setForm({ appointmentDate: new Date().toISOString().split('T')[0] }); setShow(true); }}
        addLabel="Book Appointment"
        extra={
          <div className="d-flex gap-2">
            <div className="search-box">
              <i className="bi bi-search search-icon"/>
              <input className="form-control" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:'2.5rem'}}/>
            </div>
            <select className="form-select" style={{width:150}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              {['BOOKED','IN_PROGRESS','COMPLETED','CANCELLED','NO_SHOW'].map(s=><option key={s}>{s}</option>)}
            </select>
            <div className="btn-group">
              <button className={"btn btn-sm "+(view==='list'?'btn-primary':'btn-outline-primary')} onClick={()=>setView('list')}><i className="bi bi-list-ul"/></button>
              <button className={"btn btn-sm "+(view==='calendar'?'btn-primary':'btn-outline-primary')} onClick={()=>setView('calendar')}><i className="bi bi-calendar3"/></button>
            </div>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[['BOOKED','Booked','bi-calendar-plus','#3B82F6'],['IN_PROGRESS','In Progress','bi-clock','#F59E0B'],['COMPLETED','Completed','bi-check-circle','#10B981'],['CANCELLED','Cancelled','bi-x-circle','#EF4444']].map(([s,l,ic,c])=>(
          <div key={s} className="col-6 col-md-3">
            <div className="card p-3 d-flex flex-row align-items-center gap-3" style={{borderLeft:`4px solid ${c}`}}>
              <i className={`bi ${ic} fs-4`} style={{color:c}}/>
              <div><div className="fw-700 fs-5" style={{color:c}}>{data.filter(d=>d.status===s).length}</div><div className="text-muted small">{l}</div></div>
            </div>
          </div>
        ))}
      </div>

      {view === 'calendar' ? (
        <div className="card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-600 mb-0">{today.toLocaleString('default',{month:'long',year:'numeric'})}</h6>
          </div>
          <div className="row g-1 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="col text-center fw-600 small text-muted py-2">{d}</div>)}
          </div>
          <div className="row g-1">
            {Array(firstDay).fill(null).map((_,i)=><div key={'e'+i} className="col" style={{aspectRatio:1}}/>)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const day = i+1;
              const hasApt = apptDays.has(day);
              const isToday = day === today.getDate();
              return (
                <div key={day} className="col">
                  <div className="calendar-day text-center" style={{...(isToday?{background:'var(--primary)',color:'#fff'}:hasApt?{background:'var(--primary-light)',borderColor:'var(--primary)'}:{})}}>
                    <div className="fw-500">{day}</div>
                    {hasApt && !isToday && <div style={{width:6,height:6,borderRadius:'50%',background:'var(--primary)',margin:'2px auto 0'}}/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card table-card">
          {loading ? <div className="text-center py-5"><div className="spinner-border text-primary"/></div> :
          !filtered.length ? <div className="text-center py-5 text-muted"><i className="bi bi-calendar-x fs-2 d-block mb-2"/><p>No appointments found</p></div> : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>Appt No.</th><th>Customer</th><th>Service</th><th>Employee</th><th>Date & Time</th><th>Status</th><th style={{width:180}}>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(a=>(
                    <tr key={a.id}>
                      <td><span className="fw-600 text-primary small">{a.appointmentNo}</span></td>
                      <td><div className="d-flex align-items-center gap-2"><div className="avatar" style={{width:32,height:32,fontSize:'.75rem',background:'var(--primary)'}}>{a.customer?.fullName?.[0]||'?'}</div><div><div className="fw-500 small">{a.customer?.fullName}</div><div className="text-muted" style={{fontSize:'.7rem'}}>{a.customer?.mobile}</div></div></div></td>
                      <td><div className="fw-500 small">{a.service?.serviceName}</div><div className="text-muted" style={{fontSize:'.7rem'}}>{a.service?.durationMins} min · ₹{a.service?.price}</div></td>
                      <td className="small">{a.employee?.fullName||<span className="text-muted">—</span>}</td>
                      <td><div className="fw-500 small">{a.appointmentDate}</div><div className="text-muted" style={{fontSize:'.7rem'}}>{a.appointmentTime}</div></td>
                      <td><StatusBadge value={a.status}/></td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {a.status==='BOOKED' && <button className="btn btn-xs btn-success" style={{fontSize:'.7rem',padding:'2px 8px'}} onClick={()=>updateStatus(a.id,'IN_PROGRESS')}>Start</button>}
                          {a.status==='IN_PROGRESS' && <button className="btn btn-xs btn-primary" style={{fontSize:'.7rem',padding:'2px 8px'}} onClick={()=>updateStatus(a.id,'COMPLETED')}>Complete</button>}
                          {['BOOKED','IN_PROGRESS'].includes(a.status) && <button className="btn btn-xs btn-outline-danger" style={{fontSize:'.7rem',padding:'2px 8px'}} onClick={()=>updateStatus(a.id,'CANCELLED')}>Cancel</button>}
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(a.id)}><i className="bi bi-trash"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {show && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-600">Book New Appointment</h5>
                <button className="btn-close" onClick={()=>setShow(false)}/>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">Customer ID</label><input type="number" className="form-control" placeholder="Customer ID" value={form.customerId||''} onChange={e=>setForm({...form,customerId:e.target.value})} required/></div>
                    <div className="col-md-6"><label className="form-label">Service ID</label><input type="number" className="form-control" placeholder="Service ID" value={form.serviceId||''} onChange={e=>setForm({...form,serviceId:e.target.value})} required/></div>
                    <div className="col-md-6"><label className="form-label">Employee ID</label><input type="number" className="form-control" placeholder="Employee ID (optional)" value={form.employeeId||''} onChange={e=>setForm({...form,employeeId:e.target.value})}/></div>
                    <div className="col-md-6"><label className="form-label">Branch ID</label><input type="number" className="form-control" placeholder="Branch ID" value={form.branchId||''} onChange={e=>setForm({...form,branchId:e.target.value})} required/></div>
                    <div className="col-md-6"><label className="form-label">Date *</label><input type="date" className="form-control" value={form.appointmentDate||''} onChange={e=>setForm({...form,appointmentDate:e.target.value})} required/></div>
                    <div className="col-md-6"><label className="form-label">Time *</label><input type="time" className="form-control" value={form.appointmentTime||''} onChange={e=>setForm({...form,appointmentTime:e.target.value})} required/></div>
                    <div className="col-12"><label className="form-label">Notes</label><textarea className="form-control" rows={2} value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={()=>setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Book Appointment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
