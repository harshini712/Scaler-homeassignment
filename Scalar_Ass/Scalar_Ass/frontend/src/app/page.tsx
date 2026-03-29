import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect users immediately to the events dashboard
  redirect('/dashboard/events');
}