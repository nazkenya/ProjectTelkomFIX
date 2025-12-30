// src/components/activities/ActivityCardDashboard.jsx
import React from 'react'
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaBuilding,
} from 'react-icons/fa'
import Card from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function ActivityCardDashboard({ activity, onClick }) {
  const activityDateTime = new Date(`${activity.date}T${activity.time || '00:00'}`)
  const isPast = activityDateTime < new Date()
  const isCompleted = activity.status === 'completed'

  const statusConfig = (() => {
    if (isCompleted) {
      return {
        label: 'Selesai',
        bgClass: 'bg-emerald-50 border-emerald-200',
        textClass: 'text-emerald-700',
      }
    }
    if (isPast) {
      return {
        label: 'Perlu Update',
        bgClass: 'bg-amber-50 border-amber-200',
        textClass: 'text-amber-700',
      }
    }
    return {
      label: 'Akan Datang',
      bgClass: 'bg-blue-100 border-blue-200',
      textClass: 'text-blue-700',
    }
  })()

  const formattedDate = new Date(activity.date).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Card
      className="cursor-pointer border border-neutral-200/80 hover:border-[#2C5CC5]/40 hover:shadow-sm transition-all duration-150 px-3 py-2.5"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Main info */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Title + optional topic */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate">
              {activity.title}
            </p>
            {activity.topic && (
              <p className="text-[11.5px] text-neutral-500 truncate mt-0.5">
                {activity.topic}
              </p>
            )}
          </div>

          {/* Customer */}
          {activity.customer && (
            <div className="flex items-center gap-1.5 text-[12px] text-neutral-700">
              <FaBuilding className="w-3.5 h-3.5 text-neutral-500" />
              <span className="truncate">{activity.customer}</span>
            </div>
          )}

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-neutral-700">
            {/* Date */}
            <span className="inline-flex items-center gap-1.5">
              <FaCalendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>{formattedDate}</span>
            </span>

            {/* Time */}
            {activity.time && (
              <span className="inline-flex items-center gap-1.5">
                <FaClock className="w-3.5 h-3.5 text-neutral-500" />
                <span>{activity.time}</span>
              </span>
            )}

            {/* Location (icon merah) */}
            {activity.location && (
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-red-600" />
                <span className="truncate max-w-[140px]">
                  {activity.location}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <Badge
            className={[
              'px-2 py-0.5 text-[10px] font-medium rounded-full border',
              statusConfig.bgClass,
            ].join(' ')}
          >
            <span className={statusConfig.textClass}>
              {statusConfig.label}
            </span>
          </Badge>
        </div>
      </div>
    </Card>
  )
}
