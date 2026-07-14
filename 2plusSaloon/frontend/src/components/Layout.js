import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
const titles = {
  '/dashboard':'Dashboard','/branches':'Branch Management','/employees':'Employee Management',
  '/customers':'Customer Management','/appointments':'Appointment Management',
  '/services':'Service Management','/products':'Product Management',
  '/billing':'Billing & Invoices','/membership':'Membership',
  '/salary':'Salary Management','/expenses':'Expense Management','/reports':'Reports & Analytics',
};
export default function Layout({ children }) {
  const loc = useLocation();
  const title = titles[loc.pathname] || 'Salon Management';
  return (
    <div className="d-flex">
      <Sidebar/>
      <div className="main-wrapper w-100">
        <header className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-sm btn-light"><i className="bi bi-bell"/></button>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
