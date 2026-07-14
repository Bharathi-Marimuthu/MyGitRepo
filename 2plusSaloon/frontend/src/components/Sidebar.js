import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
const nav = [
  { section: 'Main', items: [
    { to: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
  ]},
  { section: 'Operations', items: [
    { to: '/appointments', icon: 'bi-calendar-check', label: 'Appointments' },
    { to: '/billing', icon: 'bi-receipt', label: 'Billing' },
    { to: '/customers', icon: 'bi-people-fill', label: 'Customers' },
    { to: '/membership', icon: 'bi-star-fill', label: 'Membership' },
  ]},
  { section: 'Management', items: [
    { to: '/employees', icon: 'bi-person-badge', label: 'Employees' },
    { to: '/services', icon: 'bi-scissors', label: 'Services' },
    { to: '/products', icon: 'bi-bag-fill', label: 'Products' },
    { to: '/branches', icon: 'bi-building', label: 'Branches' },
  ]},
  { section: 'Finance', items: [
    { to: '/salary', icon: 'bi-cash-coin', label: 'Salary' },
    { to: '/expenses', icon: 'bi-wallet2', label: 'Expenses' },
    { to: '/reports', icon: 'bi-bar-chart-fill', label: 'Reports' },
  ]},
];
export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"><i className="bi bi-scissors"/></div>
        <div><div className="logo-text">Elegance</div><div className="logo-sub">SALON MANAGEMENT</div></div>
      </div>
      <nav className="sidebar-nav">
        {nav.map(section => (
          <div key={section.section}>
            <p className="nav-section-title">{section.section}</p>
            {section.items.map(item => (
              <NavLink key={item.to} to={item.to} className={({isActive})=>'d-flex align-items-center gap-2 px-4 py-2 text-decoration-none'+(isActive?' active':'')}>
                <i className={"bi "+item.icon+" nav-icon"}/>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="avatar" style={{width:32,height:32,fontSize:'.75rem'}}>{user?.fullName?.[0]||'A'}</div>
          <div><div style={{color:'#fff',fontSize:'.8rem',fontWeight:600}}>{user?.fullName}</div><div style={{color:'var(--sidebar-text)',fontSize:'.7rem'}}>{user?.roles?.[0]?.replace('ROLE_','')}</div></div>
        </div>
        <button className="btn btn-sm w-100 mt-1" style={{background:'rgba(255,255,255,.1)',color:'#c7d2fe',border:'none'}} onClick={logout}>
          <i className="bi bi-box-arrow-right me-2"/>Sign Out
        </button>
      </div>
    </aside>
  );
}
