import React from 'react'
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaHourglassHalf,
} from 'react-icons/fa'
import Card from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function ActivityCardCompact({ activity, onClick }) {
  const activityDateTime = new Date(`${activity.date}T${activity.time || '00:00'}`)
  const isPast = activityDateTime < new Date()
  const isCompleted = activity.status === 'completed'

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge
          variant="success"
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px]"
        >
          <FaCheckCircle className="w-3 h-3" />
          <span>Selesai</span>
        </Badge>
      )
    }
    if (isPast) {
      return (
        <Badge
          variant="warning"
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px]"
        >
          <FaHourglassHalf className="w-3 h-3" />
          <span>Perlu Update</span>
        </Badge>
      )
    }
    return (
      <Badge
        variant="info"
        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px]"
      >
        <FaCalendar className="w-3 h-3" />
        <span>Akan Datang</span>
      </Badge>
    )
  }

  const formattedDate = new Date(activity.date).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Card
      className="bg-white cursor-pointer border border-neutral-200/80 hover:border-[#1D4ED8]/40 hover:shadow-sm transition-all duration-150 px-3 py-2.5"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        {/* Title + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold text-neutral-900 truncate">
              {activity.title}
            </h3>
            {activity.topic && (
              <p className="text-[11.5px] text-neutral-500 truncate mt-0.5">
                {activity.topic}
              </p>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Info row (tanggal, jam, lokasi, tipe, customer) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-neutral-600">
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

          {/* Type as small chip */}
          {activity.type && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D4ED8]" />
              <span className="truncate max-w-[120px]">{activity.type}</span>
            </span>
          )}

          {/* Customer */}
          {activity.withCustomer && activity.customer && (
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <FaBuilding className="w-3.5 h-3.5 text-neutral-500" />
              <span className="truncate max-w-[140px] font-medium text-[#E60012]">
                {activity.customer}
              </span>
            </span>
          )}
        </div>

        {/* Invitees */}
        {activity.invitees?.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11.5px] text-neutral-600">
            <FaUsers className="w-3.5 h-3.5 text-neutral-500" />
            <span className="truncate">
              {activity.invitees.join(', ')}
            </span>
          </div>
        )}

        {/* Description */}
        {activity.description && (
          <p className="text-[11.5px] text-neutral-600 line-clamp-2 leading-snug">
            {activity.description}
          </p>
        )}
      </div>
    </Card>
  )
}
