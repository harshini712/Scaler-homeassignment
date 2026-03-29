'use client';
import { useState } from 'react';
import { useGetEventsQuery, useCreateEventMutation, useDeleteEventMutation } from '@/store/apiSlice';

export default function EventsPage() {
  const { data: events, isLoading } = useGetEventsQuery({});
  const [createEvent] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [form, setForm] = useState({ title: '', description: '', duration: 30, slug: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent({ ...form, duration: Number(form.duration) });
    setForm({ title: '', description: '', duration: 30, slug: '' });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Event Types</h2>
      
      {/* Create Event Form [cite: 16] */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border p-2 rounded w-full" />
          <input type="text" placeholder="URL Slug (e.g., 30-min)" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border p-2 rounded w-full" />
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 rounded w-full" />
        <input type="number" placeholder="Duration (mins)" required value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="border p-2 rounded w-full" />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">Create Event Type</button>
      </form>

      {/* List Events [cite: 18] */}
      <div className="space-y-4">
        {events?.map((event: any) => (
          <div key={event.id} className="bg-white p-6 rounded-lg border border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-500">/{event.slug} • {event.duration} mins</p>
              <a href={`/${event.slug}`} target="_blank" className="text-sm text-blue-600 hover:underline">View booking page</a>
            </div>
            <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}