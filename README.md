# Developer Capability Exercise

## Scenario

This project contains:

- A Next.js UI with a simple form
- An Express API that saves data
- A mock 3rd-party API that enriches the data

**The system currently has:**

- ⚠️ One real bug
- ⚠️ Weak validation
- ⚠️ Poor error handling
- ⚠️ No resilience to 3rd-party failures

## Tasks

### 1) Fix a Bug (Required)

**Issue:** Submitting the form sometimes shows success in the UI even when the backend fails.

**Goal:**

- Make the UI correctly reflect backend failures
- Ensure users see a helpful error message

### 2) Add a Small Feature (Required)

Add a new field: **`source`** (string, required)

- **UI:** Add an input field
- **API:** Validate it
- **DB:** Store it (in-memory storage is fine)

### 3) Integrate a 3rd-Party API (Required)

**Mock API Specification:**

```
GET https://mock-api.local/enrich?name=John
Headers:
  Authorization: Bearer test-token

Response:
{
  "score": 0.82,
  "category": "gold"
}
```

**Goal:**

- Call this API from your Express endpoint
- Attach `score` and `category` to the saved record

**Constraints:**

- The API may timeout, return 500, or return malformed JSON
- Add a timeout (e.g., 3 seconds)
- Handle failure gracefully
- **Still save the record even if enrichment fails**

### 4) Improve Error Handling (Required)

**Backend:**

- Input validation (check for empty strings, email format, etc.)
- Error responses (clear and consistent JSON format)

**Frontend:**

- Display API errors clearly
- Disable submit button while saving

### 5) Write a Short README (Required)

Create a `SOLUTION.md` file that includes:

- What you changed
- What trade-offs you made
- What you didn't do (and why)
- What you'd improve next

## Current Structure

```
/ui
  /pages
    index.tsx          # Main form page
  /lib
    api.ts             # API client (has bugs!)
  package.json
  tsconfig.json
  next.config.js

/api
  server.ts            # Express server
  /routes
    submit.ts          # Submit endpoint (needs work!)
  package.json
  tsconfig.json
```
