import React from 'react'
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarPlus,
} from 'react-icons/fa'
import Card from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function ActivityCard({ activity, onClick, onAddToOutlook }) {
  const activityDateTime = new Date(`${activity.date}T${activity.time || '00:00'}`)
  const isPast = activityDateTime < new Date()
  const isCompleted = activity.status === 'completed'
  const outlookAdded = Boolean(activity.outlookAdded)

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge variant="success" className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5">
          <FaCheckCircle className="w-3 h-3" />
          <span>Selesai</span>
        </Badge>
      )
    }
    if (isPast) {
      return (
        <Badge variant="warning" className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5">
          <FaHourglassHalf className="w-3 h-3" />
          <span>Perlu Update</span>
        </Badge>
      )
    }
    return (
      <Badge variant="info" className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5">
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
      className="cursor-pointer border border-neutral-200/80 hover:border-[#1D4ED8]/40 hover:shadow-sm bg-white transition-all duration-150 px-4 py-3"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2.5">
        {/* Header: title + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate">
              {activity.title}
            </p>
            {activity.topic && (
              <p className="text-xs text-neutral-500 truncate mt-0.5">
                {activity.topic}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {getStatusBadge()}
            {onAddToOutlook && (
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition ${
                  outlookAdded
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToOutlook()
                }}
                aria-label={outlookAdded ? 'Sudah ditambahkan ke Outlook' : 'Tambahkan ke Outlook'}
              >
                <FaCalendarPlus className="w-3.5 h-3.5" />
                <span>{outlookAdded ? 'Outlook' : 'Add to Outlook'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Meta row: date / time / location / type / customer */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-neutral-600">
          <span className="inline-flex items-center gap-1.5">
            <FaCalendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>{formattedDate}</span>
          </span>

          {activity.time && (
            <span className="inline-flex items-center gap-1.5">
              <FaClock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{activity.time}</span>
            </span>
          )}

          {activity.location && (
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-neutral-400" />
              <span className="truncate max-w-[160px]">
                {activity.location}
              </span>
            </span>
          )}

          {activity.type && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D4ED8]" />
              <span className="truncate max-w-[120px]">{activity.type}</span>
            </span>
          )}

          {activity.withCustomer && activity.customer && (
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <FaBuilding className="w-3.5 h-3.5 text-neutral-400" />
              <span className="truncate max-w-[160px] font-medium text-[#E60012]">
                {activity.customer}
              </span>
            </span>
          )}
        </div>

        {/* Invitees */}
        {activity.invitees?.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11.5px] text-neutral-600">
            <FaUsers className="w-3.5 h-3.5 text-neutral-400" />
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
