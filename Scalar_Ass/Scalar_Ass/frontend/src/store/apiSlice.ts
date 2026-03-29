import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Events', 'Availability', 'Bookings'],
  endpoints: (builder) => ({
    // Event Types
    getEvents: builder.query({
      query: () => '/events',
      providesTags: ['Events'],
    }),
    createEvent: builder.mutation({
      query: (body: any) => ({ url: '/events', method: 'POST', body }),
      invalidatesTags: ['Events'],
    }),
    deleteEvent: builder.mutation({
      query: (id: string) => ({ url: `/events/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Events'],
    }),

    // Availability
    getAvailability: builder.query({
      query: () => '/availability',
      providesTags: ['Availability'],
    }),
    updateAvailability: builder.mutation({
      query: (body: any) => ({ url: '/availability', method: 'PUT', body }),
      invalidatesTags: ['Availability'],
    }),
    getPublicSlots: builder.query({
      // Added explicit types for slug and date here
      query: ({ slug, date }: { slug: string; date: string }) => `/availability/slots?slug=${slug}&date=${date}`,
    }),

    // Bookings
    getBookings: builder.query({
      query: () => '/bookings',
      providesTags: ['Bookings'],
    }),
    createBooking: builder.mutation({
      query: (body: any) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: ['Bookings'],
    }),
    cancelBooking: builder.mutation({
      query: (id: string) => ({ url: `/bookings/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetAvailabilityQuery,
  useUpdateAvailabilityMutation,
  useLazyGetPublicSlotsQuery,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
} = apiSlice;