import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Job', 'Application'],
  endpoints: (builder) => ({
    // Auth endpoints
    signup: builder.mutation({
      query: (userData) => ({
        url: 'auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Job endpoints
    getJobs: builder.query({
      query: () => 'jobs',
      providesTags: ['Job'],
    }),
    createJob: builder.mutation({
      query: (job) => ({
        url: 'jobs',
        method: 'POST',
        body: job,
      }),
      invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...job }) => ({
        url: `jobs/${id}`,
        method: 'PUT',
        body: job,
      }),
      invalidatesTags: ['Job'],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),

    // Application endpoints
    applyJob: builder.mutation({
      query: (jobId) => ({
        url: `jobs/${jobId}/apply`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
    }),
    getApplications: builder.query({
      query: () => 'applications',
      providesTags: ['Application'],
    }),
    withdrawApplication: builder.mutation({
      query: (jobId) => ({
        url: `jobs/${jobId}/apply`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application'],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyJobMutation,
  useGetApplicationsQuery,
  useWithdrawApplicationMutation,
} = api;