import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar visually similar to Cal.com [cite: 41] */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">Cal Clone</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Event Types</Link>
          <Link href="/dashboard/availability" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Availability</Link>
          <Link href="/dashboard/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Bookings</Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}