import { useEffect, useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../../api/axios';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const KPI = ({ label, value, icon, cls, trend, trendUp }) => (
  <div className={"card kpi-card " + cls}>
    <div className="kpi-icon"><i className={"bi " + icon} /></div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{label}</div>
    {trend && (
      <div className={"kpi-trend fw-500 " + (trendUp ? "text-success" : "text-danger")}>
        <i className={"bi bi-arrow-" + (trendUp ? "up" : "down") + "-short"} /> {trend}
      </div>
    )}
  </div>
);

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const revData = {
  labels: months,
  datasets: [{
    label: 'Revenue',
    data: [42000,55000,48000,63000,57000,72000,68000,85000,79000,91000,88000,105000],
    backgroundColor: 'rgba(108,63,197,.15)',
    borderColor: '#6C3FC5',
    borderWidth: 2,
    fill: true,
    tension: 0.4
  }]
};

const empData = {
  labels: ['Anjali','Suresh','Priya','Ravi','Meena'],
  datasets: [{
    label: 'Revenue Generated',
    data: [45000,38000,52000,41000,33000],
    backgroundColor: ['#6C3FC5','#10B981','#F59E0B','#3B82F6','#EF4444'],
    borderRadius: 6
  }]
};

const svcData = {
  labels: ['Haircut','Facial','Hair Spa','Coloring','Bridal'],
  datasets: [{
    data: [35,20,18,15,12],
    backgroundColor: ['#6C3FC5','#10B981','#F59E0B','#3B82F6','#EF4444']
  }]
};

const recentApts = [
  { name:'Meena Kumari', service:'Facial – Basic', time:'10:00 AM', status:'Completed', color:'#10B981' },
  { name:'Arjun Reddy',  service:'Haircut – Men',  time:'11:30 AM', status:'In Progress', color:'#F59E0B' },
  { name:'Kavitha Nair', service:'Hair Spa',        time:'2:00 PM',  status:'Booked',      color:'#3B82F6' },
  { name:'Rajesh Kumar', service:'Beard Trim',      time:'3:30 PM',  status:'Booked',      color:'#3B82F6' },
];

export default function Dashboard() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    api.get('/dashboard/summary').then(r => setSummary(r.data.data || {})).catch(() => {});
  }, []);

  const chartOpts = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h4 className="fw-bold mb-1">Good morning! 👋</h4>
          <p className="text-muted mb-0">Here's what's happening at your salon today.</p>
        </div>
        <div className="text-end">
          <div className="fw-600 small text-muted">{today}</div>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <KPI label="Total Revenue" value="₹1,05,000" icon="bi-currency-rupee" cls="kpi-purple" trend="+12% this month" trendUp={true} />
        </div>
        <div className="col-6 col-xl-3">
          <KPI label="Customers Today" value="28" icon="bi-people-fill" cls="kpi-green" trend="+3 walk-ins" trendUp={true} />
        </div>
        <div className="col-6 col-xl-3">
          <KPI label="Appointments" value="14" icon="bi-calendar-check" cls="kpi-amber" trend="6 pending" trendUp={false} />
        </div>
        <div className="col-6 col-xl-3">
          <KPI label="Net Profit" value="₹38,500" icon="bi-graph-up-arrow" cls="kpi-blue" trend="+8% vs last month" trendUp={true} />
        </div>
      </div>

      {/* Sub KPIs */}
      <div className="row g-3 mb-4">
        {[
          { label:'Walk-ins',  value:12, icon:'bi-person-walking',    color:'#6C3FC5' },
          { label:'Completed', value:18, icon:'bi-check-circle-fill', color:'#10B981' },
          { label:'Pending',   value:6,  icon:'bi-clock-fill',        color:'#F59E0B' },
          { label:'Cancelled', value:2,  icon:'bi-x-circle-fill',     color:'#EF4444' },
        ].map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="card p-3 d-flex flex-row align-items-center gap-3">
              <div style={{ width:44, height:44, background: s.color+'20', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className={"bi " + s.icon} style={{ color: s.color, fontSize:'1.2rem' }} />
              </div>
              <div>
                <div className="fs-4 fw-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-600 mb-0">Monthly Revenue Trend</h6>
              <span className="badge" style={{ background:'var(--primary-light)', color:'var(--primary)' }}>2024</span>
            </div>
            <Line data={revData} options={{ ...chartOpts, plugins:{ legend:{ display:false } } }} height={100} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card p-3">
            <h6 className="fw-600 mb-3">Service Popularity</h6>
            <Doughnut data={svcData} options={{ responsive:true, plugins:{ legend:{ position:'bottom' } } }} />
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="row g-3">
        <div className="col-lg-7">
          <div className="card p-3">
            <h6 className="fw-600 mb-3">Top Employee Performance</h6>
            <Bar data={empData} options={chartOpts} height={120} />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-600">Recent Appointments</span>
              <a href="/appointments" className="small text-primary">View all</a>
            </div>
            <div className="list-group list-group-flush">
              {recentApts.map((a, i) => (
                <div key={i} className="list-group-item d-flex align-items-center gap-3 py-3">
                  <div className="avatar" style={{ background: a.color, flexShrink:0 }}>{a.name[0]}</div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-600 small text-truncate">{a.name}</div>
                    <div className="text-muted" style={{ fontSize:'.75rem' }}>{a.service} · {a.time}</div>
                  </div>
                  <span className="badge rounded-pill" style={{ background: a.color+'20', color: a.color, fontSize:'.7rem' }}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
