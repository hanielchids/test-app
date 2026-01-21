# Solution Documentation

**Candidate Name:** Haniel Chidavose 
**Date:** 21/01/2026

## Summary of Changes
I've addressed all the required tasks:
 - [x] Fixing the form submission bug by making sure the UI correctly reflects backend failures and that users see a helpful error message
 - [x] Added a source field
 - [x] Integrated the `mock-api`
 - [x] Improved error handling
 - [x] Wrote this doc

## Bug Fixes

### 1. Form Success on Backend Failure

**Problem:**
The `submitForm` function in `ui/lib/api.ts`was not checking `response.ok` before it could parse JSON, which was causing the frontend to treat error responses as successful.`handleSubmit` in `ui/pages/index.tsx` also didn't have any error handling so it was doing the same regardless of what the API response was.

**Solution:**
- I added `response.ok` check in `api.ts` before parsing JSON
- I set a Throw Error with message from the response body for non 200 range responses
- I wrapped the `submitForm` call in try/catch block in `index.tsx`
- I added the error state to display error messages to users
- I only set the success status when the API call actually succeeds

**Files Changed:**

- `ui/lib/api.ts`
- `ui/pages/index.tsx`

## Features Added

### 1. Source Field

**Implementation:**
I added a required `source` field to the form submission flow

**Files Changed:**

- `ui/pages/index.tsx` - I added the source input field and form state
- `ui/lib/api.ts` - I updated the type signature to include source
- `api/routes/submit.ts` - I added source validation and inclusion in records

### 2. 3rd Party API Integration

**Implementation:**
I implemented the enrichment API call to `GET https://mock-api.local/enrich?name={name}` with the `Authorization: Bearer test-token` header according to the requirements. I then used the native `fetch` with `AbortController` for a 3 second timeout. This call is non blocking so records are saved regardless.

**Error Handling Strategy:**
- I wrapped the enrichment call in try/catch to handle network errors, timeouts, and parsing errors
- I then used the `AbortController` with a 3 second timeout to prevent hanging requests
- This then returns `{ score: null, category: null }` on any failure (timeout, network error, 500 response, malformed JSON)
- The record is always saved with enrichment data (null values if enrichment failed)
- The enrichment failures do not prevent form submission

**Files Changed:**

- `api/routes/submit.ts`

## Error Handling Improvements

### Backend

- I added email format validation using regex and empty string validation
- I made sure it validates all the required fields
- I made sure that the error response format was consistent across the board
- For error handling I wrapped the entire handler in a try/catch block handle to unexpected errors
- I added an in memory storage array to persist records with the enrichment data

### Frontend

- I added an `error` state to track and display error messages
- I then wrapped the API call in a try/catch block to handle errors
- I used a styled box to display the messages
- I made sure to disable the submit button during the loading state according to the requirements and made it show that it's submitting during loading
- It also clears the error state on a new submission attempt

## Trade-offs & Decisions

### What I Prioritized

- **Degradation**: I made sure that enrichment failures don't block form submission
- **UX**: I prioritised clear error messages, loading states and then disabled the button during submission
- **Data integrity**: I made sure that records always save even if enrichment fails.
- **Timeout handling**: To avoid hanging requests I implemented the 3 second timeout.
- **Validation**: Self explanatory, but I added validation on both the frontend and backend

### What I Didn't Do (And Why)

- **Database storage**: I used an in memory array as specified in requirements. In production, I would've used a database
- **Retry logic**: I didn't use any automatic retries for the enrichment API. It Would add exponential backoff in production.
- **Caching**: I did not use any caching for the enrichment results. Caching by name would've reduced API calls.
- **Email validation library**: I used basic regex instead of a comprehensive library for email validation.
- **UI updates**: I did not change the UI into a stunning design in line with what Nextjs can do with libraries such as shadcn/tailwind/chakra ui

### Assumptions Made

- Mock API endpoint `https://mock-api.local/enrich` is accessible
- The enrichment API returns JSON with optional `score` and `category` fields
- The 3 second timeout is appropriate for enrichment API response time
- In memory storage is acceptable
- Basic email regex validation is sufficient for exercise scope

## Questions for the Team

In a real scenario, I would ask:

1. What is the expected response time for the enrichment API? Should we adjust the timeout?
2. Should we implement retry logic for enrichment failures? What retry strategy?
3. Do we need to persist the enrichment data to a database, or is in memory storage sufficient?
4. Should we cache enrichment results to reduce API calls for duplicate names?
5. Should we validate the source field against a predefined list of allowed values?

## Testing Approach

- I tested the form submission with valid data
- I tested the form submission with missing fields
- I tested the form submission with invalid email formats
- I tested the form submission with empty strings
- I tested error handling when the enrichment API times out
- I tested error handling when the enrichment API returned 500
- I tested error handling when the enrichment API returned a malformed JSON
- I tested and checked that records are saved even when the enrichment fails
- I tested the UI loading states and the how the button disables
- I tested how the error messages display in the UI

## Architecture Decisions

- **Native fetch with AbortController**: I chose the native `fetch` over axios to avoid additional dependencies because `AbortController` already provides clean timeout handling.
- **Degradation**: Enrichment is non blocking so form submission succeeds even if enrichment fails which ensures that users can always submit forms
- **In memory storage**: Simple array storage as specified
- **Error response format**: Consistent `{ error: string }` format for all errors to simplify frontend error handling
- **Validation**: Validation on both frontend and backend

---

## Candidate Notes

N/A
