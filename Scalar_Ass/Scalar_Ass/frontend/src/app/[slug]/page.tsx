'use client';
import { useState, useEffect, use } from 'react';
import { useLazyGetPublicSlotsQuery, useCreateBookingMutation } from '@/store/apiSlice';

// 1. Update the type to expect a Promise
export default function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  // 2. Unwrap the params using React.use()
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [success, setSuccess] = useState(false);

  const [fetchSlots, { data: slotData, isFetching }] = useLazyGetPublicSlotsQuery();
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  useEffect(() => {
    if (date) {
      fetchSlots({ slug, date });
      setSelectedSlot(null);
    }
  }, [date, fetchSlots, slug]); // Use the unwrapped slug here

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !date) return;
    
    try {
      await createBooking({ 
        slug, // Use the unwrapped slug here
        bookerName: form.name, 
        bookerEmail: form.email, 
        date, 
        startTime: selectedSlot 
      }).unwrap(); 
      setSuccess(true);
    } catch (err) {
      alert('Failed to book. Slot might be taken.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">A calendar invitation has been sent to your email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-3xl flex flex-col md:flex-row shadow-sm">
        
        {/* Left Side: Event Info & Calendar */}
        <div className="p-8 md:w-1/2 border-r border-gray-100">
          {/* Use the unwrapped slug here */}
          <h1 className="text-2xl font-bold mb-6 capitalize">{slug.replace('-', ' ')}</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select a Date</label>
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]} 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Slots */}
          {date && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
              {isFetching ? <p>Loading slots...</p> : (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {slotData?.slots?.length ? (
                    slotData.slots.map((slot: string) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 text-sm font-medium rounded-md border text-center transition-colors ${selectedSlot === slot ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:border-black'}`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 col-span-2">No slots available on this date.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Booking Form */}
        <div className="p-8 md:w-1/2 bg-gray-50/50">
          {selectedSlot ? (
            <form onSubmit={handleBook} className="space-y-4 h-full flex flex-col justify-center">
              <h3 className="font-semibold text-lg mb-4">Confirm your details</h3>
              <p className="text-sm text-gray-600 mb-4">Booking for {date} at {selectedSlot}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <button disabled={isBooking} type="submit" className="w-full bg-black text-white p-3 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400">
                {isBooking ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Select a date and time to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}