'use client';
import { useState, useEffect } from 'react';
import { useGetAvailabilityQuery, useUpdateAvailabilityMutation } from '@/store/apiSlice';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

export default function AvailabilityPage() {
  const { data: availabilityData, isLoading } = useGetAvailabilityQuery({});
  const [updateAvailability, { isLoading: isUpdating }] = useUpdateAvailabilityMutation();

  // Local state to manage the form before saving
  const [schedule, setSchedule] = useState<Record<number, { active: boolean; startTime: string; endTime: string }>>({});

  // Initialize form with backend data or defaults
  useEffect(() => {
    if (availabilityData) {
      const initialSchedule: any = {};
      DAYS_OF_WEEK.forEach((day) => {
        const existing = availabilityData.find((a: any) => a.dayOfWeek === day.id);
        initialSchedule[day.id] = existing
          ? { active: true, startTime: existing.startTime, endTime: existing.endTime }
          : { active: false, startTime: '09:00', endTime: '17:00' };
      });
      setSchedule(initialSchedule);
    }
  }, [availabilityData]);

  const handleSave = async () => {
    // Filter out only the active days to send to the backend
    const activeAvailabilities = Object.entries(schedule)
      .filter(([_, data]) => data.active)
      .map(([dayOfWeek, data]) => ({
        dayOfWeek: Number(dayOfWeek),
        startTime: data.startTime,
        endTime: data.endTime,
      }));

    await updateAvailability({ availabilities: activeAvailabilities });
    alert('Availability updated successfully!');
  };

  if (isLoading || Object.keys(schedule).length === 0) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Availability Settings</h2>
        <button 
          onClick={handleSave} 
          disabled={isUpdating}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {DAYS_OF_WEEK.map((day) => {
          const dayData = schedule[day.id];
          return (
            <div key={day.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-4 w-48">
                <input
                  type="checkbox"
                  checked={dayData?.active || false}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    [day.id]: { ...dayData, active: e.target.checked }
                  })}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="font-medium text-gray-700">{day.name}</span>
              </div>

              {dayData?.active ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={dayData.startTime}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      [day.id]: { ...dayData, startTime: e.target.value }
                    })}
                    className="border border-gray-300 rounded-md p-2 text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="time"
                    value={dayData.endTime}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      [day.id]: { ...dayData, endTime: e.target.value }
                    })}
                    className="border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              ) : (
                <div className="text-gray-400 text-sm italic">Unavailable</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}