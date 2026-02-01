import React from 'react'
import CustomersPage from '../pages/CustomersPage'
import CustomerDetail from '../pages/CustomerDetail'
import Dashboard from '../pages/Dashboard'
import NotAuthorized from '../pages/NotAuthorized'
import Login from '../pages/Login'
import EcrmWorkspace from '../pages/EcrmWorkspace'
import ValidationPage from '../pages/ValidationPage'
import AccountProfile from '../pages/AccountProfile'
import SalesPlanDetail from '../pages/SalesPlanDetail'
import { ROLES } from '../auth/roles'
import AccountManagers from '../pages/AccountManagers'
import ContactManagement from '../pages/ContactManagement'
import ContactDetail from '../pages/ContactDetail'
import ActivitiesPage from '../pages/ActivitiesPage'
import ManagerPerformanceDashboard from '../pages/ManagerPerformanceDashboard'
import ExecutivePerformanceDashboard from '../pages/ExecutivePerformanceDashboard'
import ManagerSalesPlans from '../pages/ManagerSalesPlans'
import SalesPlans from '../pages/SalesPlans'
import ManagerDashboard from '@pages/ManagerDashboard'
import ExecutiveRegionPerformance from '@pages/ExecutiveRegionPerformance'
import AccountManagerDashboard from '../pages/AccountManagerDashboard'
import AmProfile from '../pages/accountProfile/AmProfile'
import AMDetail from '../pages/accountProfile/AMDetail'
import Register from '../pages/Register'
import AMUpdate from '../pages/accountProfile/AMUpdate'
import AMForm from '../pages/accountProfile/AMForm'
import AdminApproval from "../pages/AdminApproval";
import ManagerApproval from "../pages/ManagerApproval";

// Define routes and which roles can access them.
// Add your new role to the arrays below as needed.
export const routes = [
  { path: '/login', element: <Login />, public: true },
  { path: '/register', element: <Register />, public: true },
  { path: '/403', element: <NotAuthorized />, public: true },

  // Protected routes
  { path: '/', element: <AccountManagerDashboard />, roles: [ROLES.sales] },
  // Fallback homepage for other roles
  { path: '/customers', element: <CustomersPage />, roles: [ROLES.admin, ROLES.sales, ROLES.manager] },
  { path: '/customers/:id', element: <CustomerDetail />, roles: [ROLES.admin, ROLES.sales, ROLES.manager] },
  { path: '/customers/:id/sales-plan/:planId', element: <SalesPlanDetail />, roles: [ROLES.admin, ROLES.sales, ROLES.manager] },
  { path: '/customers/:id/account-profile', element: <AccountProfile />, roles: [ROLES.admin, ROLES.sales, ROLES.manager] },
  { path: '/contacts', element: <ContactManagement />, roles: [ROLES.sales] },
  { path: '/contacts/:id', element: <ContactDetail />, roles: [ROLES.sales] },
  { path: '/aktivitas', element: <ActivitiesPage />, roles: [ROLES.admin, ROLES.sales] },
  // ECRM workspace is admin-only
  { path: '/ecrm-workspace', element: <EcrmWorkspace />, roles: [ROLES.admin] },
  { path: '/ecrm-workspace/validation', element: <ValidationPage />, roles: [ROLES.admin] },
  // Manager/Admin specific tracking dashboard
  { path: '/manager', element: <ManagerPerformanceDashboard />, roles: [ROLES.manager, ROLES.admin] },
  { path: '/manager/performance', element: <ManagerPerformanceDashboard />, roles: [ROLES.manager, ROLES.admin] },
  { path: '/manager/account-managers', element: <AccountManagers />, roles: [ROLES.manager, ROLES.admin] },
  { path: '/manager/sales-plans', element: <ManagerSalesPlans />, roles: [ROLES.manager, ROLES.admin] },
  { path: '/sales-plans', element: <SalesPlans />, roles: [ROLES.sales] },
  { path: '/executive', element: <ExecutivePerformanceDashboard />, roles: [ROLES.admin] },
  { path: '/executive/region', element: <ExecutiveRegionPerformance />, roles: [ROLES.admin] },
  { path: '/profile/am', element: <AmProfile />, roles: [ROLES.admin, ROLES.sales, ROLES.manager] },
  { path: '/profile/am/detail', element: <AMDetail />, roles: [ROLES.admin, ROLES.sales, ROLES.manager] },
  { path: '/profile/am/update', element: <AMUpdate />, roles: [ROLES.admin, ROLES.sales, ROLES.manager] },
  { path: '/profile/am/insert', element: <AMForm />, roles: [ROLES.admin, ROLES.manager] },

  // --- APPROVAL SYSTEM ---
  { path: '/admin/approval', element: <AdminApproval />, roles: [ROLES.admin] },
  { path: '/manager/approval', element: <ManagerApproval />, roles: [ROLES.manager, ROLES.admin] },
]
