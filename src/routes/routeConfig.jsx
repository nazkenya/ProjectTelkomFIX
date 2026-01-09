import ExecutiveRegionPerformance from '@pages/ExecutiveRegionPerformance'
import { ROLES } from '../auth/roles'
import AccountManagerDashboard from '../pages/AccountManagerDashboard'
import AccountManagers from '../pages/AccountManagers'
import AccountProfile from '../pages/AccountProfile'
import AMDetail from '../pages/accountProfile/AMDetail'
import AmProfile from '../pages/accountProfile/AmProfile'; // Pastikan path ini benar
import AMUpdate from '../pages/accountProfile/AMUpdate'
import ActivitiesPage from '../pages/ActivitiesPage'
import ContactDetail from '../pages/ContactDetail'
import ContactManagement from '../pages/ContactManagement'
import GuidanceDetailPage from '../pages/CsgWorkspace/7-guidance'
import CustomerCsgDetail from '../pages/CsgWorkspace/CustomerCsgDetail'
import CustomerView from '../pages/CsgWorkspace/CustomerView'
import CustomerDetail from '../pages/CustomerDetail'
import CustomersPage from '../pages/CustomersPage'
import EcrmWorkspace from '../pages/EcrmWorkspace'
import ExecutivePerformanceDashboard from '../pages/ExecutivePerformanceDashboard'
import Login from '../pages/Login'
import ManagerPerformanceDashboard from '../pages/ManagerPerformanceDashboard'
import ManagerSalesPlans from '../pages/ManagerSalesPlans'
import NotAuthorized from '../pages/NotAuthorized'
import Register from '../pages/Register'
import SalesPlanDetail from '../pages/SalesPlanDetail'
import SalesPlans from '../pages/SalesPlans'
import ValidationPage from '../pages/ValidationPage'

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
  // Manager specific tracking dashboard
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
  // CSG pages
  { path: '/CSG', element: <CustomerView />, roles: [ROLES.sales] },
  { path: '/CSG/:id', element: <CustomerCsgDetail />, roles: [ROLES.sales] },
  { path: '/CSG/:id/7-guidance', element: <GuidanceDetailPage />, roles: [ROLES.sales] },
]
