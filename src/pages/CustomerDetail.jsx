import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import detailsById from '../data/mockCustomerDetails'
import customers from '../data/mockCustomers'
import ProfileHeader from '../components/customer/ProfileHeader'
import CustomerInfoCard from '../components/customer/CustomerInfoCard'
import RightSidebar from '../components/customer/RightSidebar'
import { Tabs } from '../components/ui/Tabs'
import AISummaryCard from '../components/customer/AISummaryCard'
import RelationshipPlan from '../components/accountPlan/RelationshipPlan'
import SalesPlan from '../components/accountPlan/SalesPlan'
import CustomerVisitingSection from '../components/customer/CustomerVisitingSection'
// import OpportunityDetails from '../components/customer/OpportunityDetails'
// import TasksList from '../components/customer/TasksList'

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const base = customers.find((c) => c.id === id) || customers[0]
  const details = detailsById[id] || detailsById.default
  const [tab, setTab] = React.useState('sales')

  return (
    <div className="space-y-6 animate-fade-in">
      <ProfileHeader
        name={base.name}
        code={base.code}
        tag={base.tag}
        nipnas={details.nipnas}
        onBack={() => navigate('/customers')}
      />

  <div className="flex flex-col lg:flex-row gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-4">
          <CustomerInfoCard details={details} />
          <AISummaryCard customerName={base.name} />
          <div className="bg-white rounded-xl shadow-card">
            <Tabs
              tabs={[
                { key: 'sales', label: 'Sales Plan' },
                { key: 'visiting', label: 'Aktivitas' },
                { key: 'relationship', label: 'Manajemen Hubungan' },
              ]}
              activeKey={tab}
              onChange={setTab}
              color="blue"
            />
            <div className="p-4">
              {tab === 'sales' && (
                <SalesPlan customerId={id || details.nipnas || base.code} customerName={base.name} />
              )}
              {tab === 'visiting' && <CustomerVisitingSection customerId={id} customerName={base.name} />}
              {tab === 'relationship' && (
                <RelationshipPlan customerId={details.nipnas || base.code || id} contacts={details.contacts || []} />
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar (fixed drawer) */}
        <RightSidebar contacts={details.contacts} />
      </div>
    </div>
  )
}
