import PageLayout from '@/components/PageLayout';
import { getAppInfo } from '@/libs/booking';
import BookingPage from '@/pages/BookingPage';
import React from 'react';
import 'react-calendar/dist/Calendar.css';


export default async function Home() {
  const appInfo = await getAppInfo();

  return (
    <main className="relative content w-full md:max-w-md min-h-screen bg-blue-100">
      <PageLayout appInfo={appInfo}>
        {(appInfo) => {
          return (
            <BookingPage appInfo={appInfo} />
          )
        }}
      </PageLayout>
    </main>
  )
}
