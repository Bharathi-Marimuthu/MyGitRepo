import { useState } from 'react';
import StatusBadge from '../../components/StatusBadge';

const TIERS = [
  { type:'SILVER', color:'#6B7280', icon:'bi-award', discount:5, validity:'6 months', minSpend:'₹5,000', perks:['5% discount on all services','Priority booking','Birthday wishes'] },
  { type:'GOLD', color:'#F59E0B', icon:'bi-award-fill', discount:10, validity:'12 months', minSpend:'₹15,000', perks:['10% discount on all services','2x loyalty points','Free monthly facial','Priority booking','Birthday & Anniversary gifts'] },
  { type:'PLATINUM', color:'#8B5CF6', icon:'bi-gem', discount:20, validity:'12 months', minSpend:'₹30,000', perks:['20% discount on all services','3x loyalty points','Free weekly blowout','Free monthly facial + spa','Dedicated stylist','Complimentary beverages'] },
];

const MOCK_MEMBERS = [
  { id:1, name:'Meena Kumari', mobile:'9988776655', type:'GOLD', start:'2024-01-01', end:'2024-12-31', points:524, spend:'₹52,400' },
  { id:2, name:'Priya Sharma', mobile:'9988776656', type:'PLATINUM', start:'2024-02-15', end:'2025-02-14', points:382, spend:'₹38,200' },
  { id:3, name:'Kavitha Nair', mobile:'9988776657', type:'SILVER', start:'2024-03-01', end:'2024-08-31', points:180, spend:'₹18,000' },
];

export default function MembershipPage() {
  const [tab, setTab] = useState('members');

  return (
    <div>
      <div className="page-header">
        <div><h4>Membership Management</h4><p>Manage customer memberships and loyalty program</p></div>
        <button className="btn btn-primary"><i className="bi bi-plus-lg me-2"/>Add Membership</button>
      </div>

      <ul className="nav nav-pills mb-4 gap-1">
        {[['members','bi-people','Members'],['tiers','bi-award','Membership Tiers'],['loyalty','bi-star','Loyalty Points']].map(([id,icon,label])=>(
          <li key={id}><button className={"nav-link "+(tab===id?'active':'')} onClick={()=>setTab(id)} style={tab===id?{background:'var(--primary)'}:{color:'#6b7280'}}><i className={"bi "+icon+" me-2"}/>{label}</button></li>
        ))}
      </ul>

      {tab==='tiers' && (
        <div className="row g-4">
          {TIERS.map(t=>(
            <div key={t.type} className="col-md-4">
              <div className="card p-4 text-center h-100" style={{border:`2px solid ${t.color}30`}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:t.color+'15',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}>
                  <i className={"bi "+t.icon+" fs-2"} style={{color:t.color}}/>
                </div>
                <h5 className="fw-700" style={{color:t.color}}>{t.type}</h5>
                <div className="fs-2 fw-700 my-2" style={{color:t.color}}>{t.discount}%<span className="fs-6 fw-400 text-muted"> discount</span></div>
                <div className="row g-2 mb-3">
                  <div className="col-6"><div className="p-2 rounded-2 bg-light small"><div className="fw-600">{t.validity}</div><div className="text-muted">Validity</div></div></div>
                  <div className="col-6"><div className="p-2 rounded-2 bg-light small"><div className="fw-600">{t.minSpend}</div><div className="text-muted">Min Spend</div></div></div>
                </div>
                <div className="text-start">
                  {t.perks.map(p=>(
                    <div key={p} className="d-flex align-items-center gap-2 mb-1 small">
                      <i className="bi bi-check-circle-fill" style={{color:t.color}}/>{p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='members' && (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>#</th><th>Customer</th><th>Membership</th><th>Valid Until</th><th>Points</th><th>Total Spend</th><th>Status</th></tr></thead>
              <tbody>
                {MOCK_MEMBERS.map((m,i)=>(
                  <tr key={m.id}>
                    <td className="text-muted small">{i+1}</td>
                    <td><div className="d-flex align-items-center gap-2"><div className="avatar" style={{width:34,height:34,fontSize:'.8rem',background:'var(--primary)'}}>{m.name[0]}</div><div><div className="fw-500 small">{m.name}</div><div className="text-muted" style={{fontSize:'.7rem'}}>{m.mobile}</div></div></div></td>
                    <td><StatusBadge value={m.type}/></td>
                    <td className="small">{m.end}</td>
                    <td><span className="fw-600 text-warning"><i className="bi bi-star-fill me-1"/>{m.points}</span></td>
                    <td className="fw-600 text-primary small">{m.spend}</td>
                    <td><span className="status-badge badge-active">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='loyalty' && (
        <div>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card p-4 text-center" style={{background:'linear-gradient(135deg,#FEF3C7,#FFFBEB)'}}>
                <i className="bi bi-star-fill fs-2 text-warning mb-2"/>
                <div className="fw-700 fs-3 text-warning">₹100</div>
                <div className="text-muted small">= 1 Loyalty Point</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center" style={{background:'linear-gradient(135deg,#D1FAE5,#ECFDF5)'}}>
                <i className="bi bi-gift fs-2 text-success mb-2"/>
                <div className="fw-700 fs-3 text-success">1 Point</div>
                <div className="text-muted small">= ₹1 Redemption Value</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center" style={{background:'linear-gradient(135deg,#EDE9FF,#F3F0FF)'}}>
                <i className="bi bi-people-fill fs-2 mb-2" style={{color:'var(--primary)'}}/>
                <div className="fw-700 fs-3" style={{color:'var(--primary)'}}>1,086</div>
                <div className="text-muted small">Total Points in Circulation</div>
              </div>
            </div>
          </div>
          <div className="card table-card">
            <div className="card-header fw-600">Loyalty Points Leaderboard</div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>Rank</th><th>Customer</th><th>Points Balance</th><th>Total Earned</th><th>Total Redeemed</th><th>Membership</th></tr></thead>
                <tbody>
                  {[['Priya Sharma',524,640,116,'PLATINUM'],['Meena Kumari',382,450,68,'GOLD'],['Kavitha Nair',248,280,32,'GOLD'],['Anjali Reddy',196,210,14,'SILVER'],['Sona Pillai',140,155,15,'SILVER']].map(([n,b,e,r,m],i)=>(
                    <tr key={i}>
                      <td><div style={{width:28,height:28,borderRadius:'50%',background:['#F59E0B','#9CA3AF','#CD7F32','var(--primary)','var(--primary)'][i],color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem',fontWeight:700}}>{i+1}</div></td>
                      <td><div className="d-flex align-items-center gap-2"><div className="avatar" style={{width:32,height:32,fontSize:'.75rem',background:'var(--primary)'}}>{n[0]}</div><span className="fw-500 small">{n}</span></div></td>
                      <td><span className="fw-700 text-warning"><i className="bi bi-star-fill me-1"/>{b}</span></td>
                      <td className="small text-success">{e} earned</td>
                      <td className="small text-muted">{r} redeemed</td>
                      <td><StatusBadge value={m}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
