import { useState } from 'react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const revenueData = {
  labels: months,
  datasets: [
    { label:'Revenue', data:[42000,55000,48000,63000,57000,72000,68000,85000,79000,91000,88000,105000], backgroundColor:'rgba(108,63,197,.2)', borderColor:'#6C3FC5', fill:true, tension:.4, borderWidth:2 },
    { label:'Expense', data:[28000,32000,29000,38000,33000,41000,39000,47000,43000,52000,49000,58000], backgroundColor:'rgba(239,68,68,.15)', borderColor:'#EF4444', fill:true, tension:.4, borderWidth:2 },
  ]
};

const serviceData = {
  labels:['Haircut Men','Haircut Women','Facial','Hair Spa','Hair Coloring','Beard Trim','Bridal','Manicure','Pedicure'],
  datasets:[{ label:'Services Done', data:[145,98,76,54,42,87,12,38,41], backgroundColor:['#6C3FC5','#8B5CF6','#10B981','#F59E0B','#3B82F6','#EC4899','#EF4444','#14B8A6','#F97316'] }]
};

const empPerfData = {
  labels:['Anjali Devi','Suresh Babu','Priya Singh','Ravi Kumar','Meena Das'],
  datasets:[
    { label:'Revenue (₹)', data:[85000,72000,93000,68000,54000], backgroundColor:'rgba(108,63,197,.7)', borderRadius:6 },
    { label:'Customers',   data:[145,120,160,98,87],             backgroundColor:'rgba(16,185,129,.7)',  borderRadius:6 },
  ]
};

const customerData = {
  labels: months,
  datasets:[{ label:'New Customers', data:[12,18,14,22,19,28,24,32,27,38,34,42], backgroundColor:'rgba(59,130,246,.7)', borderRadius:4 }]
};

const paymentMethodData = {
  labels:['Cash','UPI','Credit Card','Debit Card'],
  datasets:[{ data:[35,40,15,10], backgroundColor:['#10B981','#6C3FC5','#F59E0B','#3B82F6'] }]
};

const profitData = {
  labels: months,
  datasets:[{
    label:'Profit',
    data:[14000,23000,19000,25000,24000,31000,29000,38000,36000,39000,39000,47000],
    backgroundColor:'rgba(16,185,129,.2)',
    borderColor:'#10B981',
    fill:true,
    tension:.4,
    borderWidth:2
  }]
};

const TABS = [
  { id:'overview',   label:'Overview',   icon:'bi-grid-1x2' },
  { id:'revenue',    label:'Revenue',    icon:'bi-currency-rupee' },
  { id:'customers',  label:'Customers',  icon:'bi-people' },
  { id:'employees',  label:'Employees',  icon:'bi-person-badge' },
  { id:'services',   label:'Services',   icon:'bi-scissors' },
];

const kpiList = [
  { label:'Total Revenue (YTD)',  value:'₹8,53,000', change:'+23%', up:true,  icon:'bi-currency-rupee', color:'#6C3FC5' },
  { label:'Total Expenses (YTD)', value:'₹5,10,000', change:'+15%', up:false, icon:'bi-wallet2',        color:'#EF4444' },
  { label:'Net Profit (YTD)',     value:'₹3,43,000', change:'+34%', up:true,  icon:'bi-graph-up',       color:'#10B981' },
  { label:'Total Customers',      value:'1,248',      change:'+18%', up:true,  icon:'bi-people-fill',    color:'#3B82F6' },
  { label:'Repeat Customers',     value:'73%',        change:'+5%',  up:true,  icon:'bi-arrow-repeat',   color:'#F59E0B' },
  { label:'Avg Ticket Size',      value:'₹682',       change:'+12%', up:true,  icon:'bi-receipt',        color:'#8B5CF6' },
];

const monthlyTable = [
  [42000,28000],[55000,32000],[48000,29000],[63000,38000],[57000,33000],[72000,41000],
  [68000,39000],[85000,47000],[79000,43000],[91000,52000],[88000,49000],[105000,58000],
];

const topCustomers = [
  ['Meena Kumari','48','₹52,400','GOLD',524],
  ['Priya Sharma','36','₹38,200','PLATINUM',382],
  ['Kavitha Nair','29','₹31,100','SILVER',311],
  ['Anita Reddy', '22','₹24,800','GOLD',248],
  ['Sona Pillai', '18','₹19,600','SILVER',196],
];

const empTable = [
  ['Anjali Devi','Senior Stylist',145,198,'₹85,000','₹6,800',4.9],
  ['Priya Singh','Stylist',160,214,'₹93,000','₹5,580',4.8],
  ['Suresh Babu','Stylist',120,162,'₹72,000','₹4,320',4.7],
  ['Ravi Kumar','Branch Manager',98,120,'₹68,000','₹3,400',4.6],
  ['Meena Das','Junior Stylist',87,108,'₹54,000','₹2,700',4.5],
];

const svcTable = [
  ['Haircut – Men','Hair Cut',145,'₹29,000','₹200',95],
  ['Facial – Basic','Facial',76,'₹38,000','₹500',72],
  ['Hair Spa','Hair Spa',54,'₹43,200','₹800',68],
  ['Hair Coloring','Hair Coloring',42,'₹50,400','₹1,200',65],
  ['Bridal Package','Bridal',12,'₹96,000','₹8,000',55],
];

const rankColors = ['#F59E0B','#9CA3AF','#CD7F32','#6C3FC5','#6C3FC5'];

const memberBadgeClass = { GOLD:'badge-gold', PLATINUM:'badge-platinum', SILVER:'badge-silver' };

export default function ReportsPage() {
  const [tab, setPeriod] = useState('overview');
  const [period, setFilter] = useState('monthly');

  const baseOpts = { responsive:true, plugins:{ legend:{ position:'top' } } };
  const yMoneyOpts = { ...baseOpts, scales:{ y:{ beginAtZero:true } } };
  const yCountOpts = { ...baseOpts, scales:{ y:{ beginAtZero:true } } };

  return (
    <div>
      {/* Page header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Reports & Analytics</h4>
          <p className="text-muted mb-0">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm" value={period} onChange={e => setFilter(e.target.value)} style={{ width:130 }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="btn btn-sm btn-outline-primary"><i className="bi bi-download me-1" />Export</button>
          <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-printer me-1" />Print</button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-1 flex-wrap">
        {TABS.map(t => (
          <li key={t.id} className="nav-item">
            <button
              className={"nav-link " + (tab === t.id ? 'active' : '')}
              onClick={() => setPeriod(t.id)}
              style={tab === t.id ? { background:'var(--primary)' } : { color:'#6b7280' }}
            >
              <i className={"bi " + t.icon + " me-2"} />{t.label}
            </button>
          </li>
        ))}
      </ul>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div>
          <div className="row g-3 mb-4">
            {kpiList.map(k => (
              <div key={k.label} className="col-6 col-md-4 col-xl-2">
                <div className="card p-3 h-100">
                  <div style={{ width:36, height:36, borderRadius:8, background:k.color+'15', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8 }}>
                    <i className={"bi " + k.icon} style={{ color:k.color }} />
                  </div>
                  <div className="fw-bold fs-5" style={{ color:k.color }}>{k.value}</div>
                  <div className="text-muted small mb-1">{k.label}</div>
                  <div className={"small fw-600 " + (k.up ? 'text-success' : 'text-danger')}>
                    {k.up ? '▲' : '▼'} {k.change} vs last year
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-lg-8">
              <div className="card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-600 mb-0">Revenue vs Expense Trend</h6>
                  <span className="badge" style={{ background:'var(--primary-light)', color:'var(--primary)' }}>2024</span>
                </div>
                <Line data={revenueData} options={{ ...baseOpts, scales:{ y:{ beginAtZero:true } } }} height={90} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card p-4 h-100">
                <h6 className="fw-600 mb-3">Payment Methods</h6>
                <Doughnut data={paymentMethodData} options={{ responsive:true, plugins:{ legend:{ position:'bottom' } } }} />
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-lg-6">
              <div className="card p-4">
                <h6 className="fw-600 mb-3">Net Profit Trend</h6>
                <Line data={profitData} options={{ ...baseOpts, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }} height={110} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card p-4">
                <h6 className="fw-600 mb-3">New Customer Acquisition</h6>
                <Bar data={customerData} options={{ ...baseOpts, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }} height={110} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REVENUE TAB ── */}
      {tab === 'revenue' && (
        <div className="row g-3">
          <div className="col-12">
            <div className="card p-4">
              <h6 className="fw-600 mb-3">Monthly Revenue Breakdown</h6>
              <Bar data={revenueData} options={yMoneyOpts} height={80} />
            </div>
          </div>
          <div className="col-12">
            <div className="card table-card">
              <div className="card-header fw-600">Revenue by Month</div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Profit</th><th>Growth</th></tr></thead>
                  <tbody>
                    {months.map((m, i) => {
                      const rev    = monthlyTable[i][0];
                      const exp    = monthlyTable[i][1];
                      const profit = rev - exp;
                      const growth = i > 0
                        ? (((rev - monthlyTable[i-1][0]) / monthlyTable[i-1][0]) * 100).toFixed(1)
                        : null;
                      return (
                        <tr key={m}>
                          <td className="fw-500">{m} 2024</td>
                          <td className="text-primary fw-600">₹{rev.toLocaleString('en-IN')}</td>
                          <td className="text-danger">₹{exp.toLocaleString('en-IN')}</td>
                          <td className="text-success fw-600">₹{profit.toLocaleString('en-IN')}</td>
                          <td>
                            {growth !== null && (
                              <span className={"fw-600 " + (Number(growth) > 0 ? 'text-success' : 'text-danger')}>
                                {Number(growth) > 0 ? '+' : ''}{growth}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOMERS TAB ── */}
      {tab === 'customers' && (
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="card p-4">
              <h6 className="fw-600 mb-3">Customer Acquisition Trend</h6>
              <Bar data={customerData} options={yCountOpts} height={100} />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card p-4 h-100">
              <h6 className="fw-600 mb-3">Customer Segments</h6>
              <Pie
                data={{ labels:['New','Repeat','VIP'], datasets:[{ data:[27,58,15], backgroundColor:['#3B82F6','#6C3FC5','#F59E0B'] }] }}
                options={{ responsive:true, plugins:{ legend:{ position:'bottom' } } }}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="card table-card">
              <div className="card-header fw-600">Top Customers by Spend</div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>#</th><th>Customer</th><th>Visits</th><th>Total Spend</th><th>Membership</th><th>Points</th></tr></thead>
                  <tbody>
                    {topCustomers.map(([name, visits, spend, mem, pts], i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:700 }}>
                            {i + 1}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar" style={{ width:32, height:32, fontSize:'.75rem', background:'var(--primary)' }}>{name[0]}</div>
                            <span className="fw-500 small">{name}</span>
                          </div>
                        </td>
                        <td className="fw-600">{visits}</td>
                        <td className="fw-bold text-primary">{spend}</td>
                        <td><span className={"status-badge " + (memberBadgeClass[mem] || 'badge-none')}>{mem}</span></td>
                        <td><span className="text-warning fw-600"><i className="bi bi-star-fill me-1" />{pts}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EMPLOYEES TAB ── */}
      {tab === 'employees' && (
        <div className="row g-3">
          <div className="col-12">
            <div className="card p-4">
              <h6 className="fw-600 mb-3">Employee Performance Comparison</h6>
              <Bar data={empPerfData} options={yCountOpts} height={80} />
            </div>
          </div>
          <div className="col-12">
            <div className="card table-card">
              <div className="card-header fw-600">Employee Performance Report</div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr><th>Employee</th><th>Designation</th><th>Customers</th><th>Services</th><th>Revenue</th><th>Commission</th><th>Rating</th></tr>
                  </thead>
                  <tbody>
                    {empTable.map(([name, desig, cust, svc, rev, comm, rating], i) => (
                      <tr key={i}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar" style={{ width:32, height:32, fontSize:'.75rem', background:'var(--primary)' }}>{name[0]}</div>
                            <div className="fw-500 small">{name}</div>
                          </div>
                        </td>
                        <td className="small text-muted">{desig}</td>
                        <td className="fw-600">{cust}</td>
                        <td className="fw-600">{svc}</td>
                        <td className="fw-bold text-primary">{rev}</td>
                        <td className="text-success fw-600">{comm}</td>
                        <td>
                          <span className="text-warning fw-bold">{'★'.repeat(Math.floor(rating))}</span>
                          <span className="small text-muted ms-1">{rating}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SERVICES TAB ── */}
      {tab === 'services' && (
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="card p-4">
              <h6 className="fw-600 mb-3">Service Popularity</h6>
              <Bar
                data={serviceData}
                options={{ ...baseOpts, indexAxis:'y', scales:{ x:{ beginAtZero:true } } }}
                height={160}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card p-4">
              <h6 className="fw-600 mb-3">Revenue by Category</h6>
              <Doughnut
                data={{ labels:['Haircut','Facial','Hair Spa','Coloring','Bridal','Others'], datasets:[{ data:[28,18,16,20,12,6], backgroundColor:['#6C3FC5','#10B981','#F59E0B','#3B82F6','#EC4899','#6B7280'] }] }}
                options={{ responsive:true, plugins:{ legend:{ position:'bottom' } } }}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="card table-card">
              <div className="card-header fw-600">Service Revenue Report</div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Service</th><th>Category</th><th>Booked</th><th>Revenue</th><th>Avg Price</th><th>Popularity</th></tr></thead>
                  <tbody>
                    {svcTable.map(([name, cat, booked, rev, avg, pop], i) => (
                      <tr key={i}>
                        <td className="fw-500 small">{name}</td>
                        <td><span className="badge bg-light text-dark small">{cat}</span></td>
                        <td className="fw-600">{booked}</td>
                        <td className="fw-bold text-primary">{rev}</td>
                        <td className="small">{avg}</td>
                        <td style={{ width:160 }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="flex-grow-1 bg-light rounded-pill" style={{ height:6 }}>
                              <div style={{ width:`${pop}%`, height:'100%', background:'var(--primary)', borderRadius:999 }} />
                            </div>
                            <span className="small fw-600">{pop}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
