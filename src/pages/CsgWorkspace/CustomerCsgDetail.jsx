import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProfileHeader from '../../components/customer/ProfileHeader'
import RightSidebar from '../../components/customer/RightSidebar'
import CSGVisitingInfo from '../../components/customerCSG/CSGvisitingInfo'
import CustomerInfo from '../../components/customerCSG/CustomerInfo'
import GuidancePrinciple from '../../components/customerCSG/GuidancePrinciple'
import { Tabs } from '../../components/ui/Tabs'
import detailsById from '../../data/mockCustomerDetails'
import customers from '../../data/mockCustomers'


export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const base = customers.find((c) => c.id === id) || customers[0]
  const details = detailsById[id] || detailsById.default
  const [tab, setTab] = React.useState('guidance')

  return (
    <div className="space-y-6 animate-fade-in">
      <ProfileHeader
        name={base.name}
        code={base.code}
        tag={base.tag}
        nipnas={details.nipnas}
        onBack={() => navigate('/CSG')}
      />

  <div className="flex flex-col lg:flex-row gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-4">
          <CustomerInfo details={details} />
          <div className="bg-white rounded-xl shadow-card">
            <Tabs
              tabs={[
                { key: 'guidance', label: '7 Guidance principle' },
                { key: 'visiting', label: 'Aktivitas' },
              ]}
              activeKey={tab}
              onChange={setTab}
              color="blue"
            />
            <div className="p-4">
              {tab === 'guidance' && (
                <GuidancePrinciple
                  variant="summary"
                  showEdit={false}
                  progressCurrent={9}
                  progressTotal={12}
                  onUpdateClick={() => navigate(`/CSG/${id}/7-guidance`)}
                />
              )}
              {tab === 'visiting' && <CSGVisitingInfo customerId={id} customerName={base.name} />}
            </div>
          </div>
        </div>

        {/* Right sidebar (fixed drawer) */}
        <RightSidebar contacts={details.contacts} />
      </div>
    </div>
  )
}
