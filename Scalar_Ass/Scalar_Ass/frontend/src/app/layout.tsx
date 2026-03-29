import './globals.css';
import StoreProvider from './StoreProvider';

export const metadata = {
  title: 'Cal.com Clone',
  description: 'Scheduling Platform created for SDE Intern Assignment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}