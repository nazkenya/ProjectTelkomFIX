import { useNavigate, useParams } from 'react-router-dom'
import GuidancePrinciple from '../../components/customerCSG/GuidancePrinciple'
import Button from '../../components/ui/Button'
import customers from '../../data/mockCustomers'

export default function GuidanceDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const base = customers.find((c) => c.id === id) || customers[0]

	return (
		<div className="space-y-4 p-4 md:p-6 animate-fade-in">
			<div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-5">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<div>
						<p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#2C5CC5]">Customer Guidance</p>
						<h1 className="text-xl font-semibold text-slate-900">7 Guidance Principle – {base?.name || 'Customer'}</h1>
						<p className="text-sm text-neutral-600">Kelola aktivitas, issue, dan kapabilitas per kategori value chain.</p>
					</div>
					<Button variant="secondary" onClick={() => navigate(`/CSG/${id}`)}>
						Kembali ke CSG Detail
					</Button>
				</div>
			</div>

			<div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-5 space-y-4">
				<div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-700">
					<p className="mb-1 font-medium text-neutral-800">Cara pakai:</p>
					<ul className="list-disc list-inside space-y-0.5">
						<li>Isi aktivitas bebas per kategori (primary & support).</li>
						<li>Tambahkan sub-aktivitas untuk langkah detail atau owner spesifik.</li>
						<li>Catat issue/opportunity serta kapabilitas/rencana perbaikan.</li>
					</ul>
				</div>

				<GuidancePrinciple
					variant="table"
					showEdit
					title="ICT Landscape"
					headingLabel="ICT Landscape"
				/>
			</div>
		</div>
	)
}
