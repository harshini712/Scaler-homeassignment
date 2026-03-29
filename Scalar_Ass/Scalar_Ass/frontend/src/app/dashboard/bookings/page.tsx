'use client';
import { useGetBookingsQuery, useCancelBookingMutation } from '@/store/apiSlice';
import { format, parseISO } from 'date-fns';

export default function BookingsPage() {
  const { data, isLoading } = useGetBookingsQuery({});
  const [cancelBooking] = useCancelBookingMutation();

  if (isLoading) return <div>Loading bookings...</div>;

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(id);
    }
  };

  const renderBookingCard = (booking: any, isUpcoming: boolean) => (
    <div key={booking.id} className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg">{booking.eventType.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {booking.status}
          </span>
        </div>
        <p className="text-gray-900 font-medium">
          {format(parseISO(booking.startTime), 'EEEE, MMMM d, yyyy')} • {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
        </p>
        <p className="text-sm text-gray-500 mt-1">Booked by: {booking.bookerName} ({booking.bookerEmail})</p>
      </div>
      
      {isUpcoming && booking.status === 'CONFIRMED' && (
        <button 
          onClick={() => handleCancel(booking.id)}
          className="text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Bookings</h2>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Upcoming</h3>
          {data?.upcoming?.length > 0 ? (
            data.upcoming.map((booking: any) => renderBookingCard(booking, true))
          ) : (
            <p className="text-gray-500 text-sm bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 text-center">No upcoming bookings.</p>
          )}
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Past</h3>
          {data?.past?.length > 0 ? (
            data.past.map((booking: any) => renderBookingCard(booking, false))
          ) : (
            <p className="text-gray-500 text-sm">No past bookings.</p>
          )}
        </section>
      </div>
    </div>
  );
}