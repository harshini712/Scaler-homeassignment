# Cal.com Clone - Scheduling Platform

A full-stack scheduling and booking web application built to closely replicate the core functionality and user experience of Cal.com. 

## 🚀 Tech Stack

* **Frontend:** Next.js (App Router), Tailwind CSS, Redux Toolkit (RTK Query) for state management.
* **Backend:** Node.js, Express.js.
* **Database:** PostgreSQL managed via Prisma ORM.

## ✨ Core Features Implemented

* **Event Types Management:** Create, update, delete, and list event types with custom durations and unique URL slugs.
* **Availability Settings:** Define weekly schedules with specific start and end times for each day.
* **Public Booking Page:** A dynamic calendar interface that calculates available slots on the fly, preventing double-booking overlaps.
* **Bookings Dashboard:** View past and upcoming appointments with the ability to cancel future bookings.

## 🛠️ Local Setup Instructions

### Prerequisites
* Node.js (v18+)
* PostgreSQL running locally or via a cloud provider (e.g., Supabase, Neon)

### 1. Database Setup (Backend)

1. Navigate to the backend directory:
   ```bash
   cd backend