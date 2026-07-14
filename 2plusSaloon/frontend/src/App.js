import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import Layout from './components/Layout';

import Login       from './pages/Login/Login';
import Dashboard   from './pages/Dashboard/Dashboard';
import BranchPage  from './pages/Branch/BranchPage';
import EmployeePage from './pages/Employee/EmployeePage';
import CustomerPage from './pages/Customer/CustomerPage';
import AppointmentPage from './pages/Appointment/AppointmentPage';
import ServicePage  from './pages/Service/ServicePage';
import ProductPage  from './pages/Product/ProductPage';
import BillingPage  from './pages/Billing/BillingPage';
import ExpensePage  from './pages/Expense/ExpensePage';
import SalaryPage   from './pages/Salary/SalaryPage';
import ReportsPage  from './pages/Reports/ReportsPage';
import MembershipPage from './pages/Membership/MembershipPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
      <Route path="/dashboard"   element={<PrivateRoute><Layout><Dashboard/></Layout></PrivateRoute>}/>
      <Route path="/branches"    element={<PrivateRoute><Layout><BranchPage/></Layout></PrivateRoute>}/>
      <Route path="/employees"   element={<PrivateRoute><Layout><EmployeePage/></Layout></PrivateRoute>}/>
      <Route path="/customers"   element={<PrivateRoute><Layout><CustomerPage/></Layout></PrivateRoute>}/>
      <Route path="/appointments" element={<PrivateRoute><Layout><AppointmentPage/></Layout></PrivateRoute>}/>
      <Route path="/services"    element={<PrivateRoute><Layout><ServicePage/></Layout></PrivateRoute>}/>
      <Route path="/products"    element={<PrivateRoute><Layout><ProductPage/></Layout></PrivateRoute>}/>
      <Route path="/billing"     element={<PrivateRoute><Layout><BillingPage/></Layout></PrivateRoute>}/>
      <Route path="/expenses"    element={<PrivateRoute><Layout><ExpensePage/></Layout></PrivateRoute>}/>
      <Route path="/salary"      element={<PrivateRoute><Layout><SalaryPage/></Layout></PrivateRoute>}/>
      <Route path="/reports"     element={<PrivateRoute><Layout><ReportsPage/></Layout></PrivateRoute>}/>
      <Route path="/membership"  element={<PrivateRoute><Layout><MembershipPage/></Layout></PrivateRoute>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style:{ borderRadius:10, fontFamily:"Inter,sans-serif", fontSize:".875rem" }}}/>
        <AppRoutes/>
      </BrowserRouter>
    </AuthProvider>
  );
}
