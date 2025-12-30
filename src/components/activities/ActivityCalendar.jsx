import React, { useState, useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function ActivityCalendar({ activities, onActivityClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  const activitiesByDate = useMemo(() => {
    const map = {}
    activities.forEach((activity) => {
      const dateKey = activity.date
      if (!map[dateKey]) {
        map[dateKey] = []
      }
      map[dateKey].push(activity)
    })
    return map
  }, [activities])

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateKey = date.toLocaleDateString('sv-SE')
    const dayActivities = activitiesByDate[dateKey] || []
    const isToday =
      new Date().toDateString() === date.toDateString()

    days.push(
      <div
        key={day}
        className={`min-h-[100px] p-2 border border-neutral-200 rounded-lg transition-all ${
          isToday ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-neutral-50'
        }`}
      >
        <div
          className={`text-sm font-semibold mb-1 ${
            isToday ? 'text-blue-600' : 'text-neutral-700'
          }`}
        >
          {day}
        </div>
        <div className="space-y-1">
          {dayActivities.slice(0, 2).map((activity) => {
            const activityDateTime = new Date(`${activity.date}T${activity.time}`)
            const isPast = activityDateTime < new Date()
            const isCompleted = activity.status === 'completed'
            return (
              <div
                key={activity.id}
                onClick={() => onActivityClick(activity)}
                className={`text-xs p-1.5 rounded cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : isPast
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                <div className="font-medium truncate">{activity.time}</div>
                <div className="truncate">{activity.title}</div>
              </div>
            )
          })}
          {dayActivities.length > 2 && (
            <div className="text-xs text-neutral-500 text-center">
              +{dayActivities.length - 2} lainnya
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-800">{monthName}</h3>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={prevMonth} size="sm">
            <FaChevronLeft />
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCurrentDate(new Date())}
            size="sm"
          >
            Hari Ini
          </Button>
          <Button variant="secondary" onClick={nextMonth} size="sm">
            <FaChevronRight />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-neutral-600 p-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">{days}</div>
    </Card>
  )
}
