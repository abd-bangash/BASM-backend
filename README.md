To run the project.

```
cd BAS
```

Install all dependencies

```
npm install
```

Create `.env` file and add the following contents to it.

```
DATABASE_URL="mongodb://localhost:27017/cyberdrill"
```

To start the project:

```
npm run start:dev
```

# API Routes

This document provides a detailed overview of all the API routes available in the cyberdrill application.

## App Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | / | Returns a welcome message. | None |

## Auth Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| POST | /auth/login | Authenticates a user and sends a 2FA code. | `{ "email": "string", "password": "string" }` |
| POST | /auth/logout | Logs out the current user. | None |
| POST | /auth/refresh | Refreshes the authentication tokens. | None |
| POST | /auth/create-client | Creates a new client. | `ClientDto` |
| POST | /auth/create-superuser | Creates a new superuser. | `SuperUserDto` |
| GET | /auth/verify | Verifies the authentication status. | None |
| GET | /auth/test | Returns a test message from the auth service. | None |
| POST | /auth/2fa-email | Verifies the 2FA code sent via email. | `{ "email": "string", "code": "string" }` |
| PATCH | /auth/update-password | Updates the user's password. | `{ "username": "string", "oldPassword": "string", "newPassword": "string", "confirmPassword": "string" }` |
| POST | /auth/2fa | Generates a 2FA QR code for the user. | `{ "username": "string", "service": "string" }` |
| POST | /auth/verify/recaptcha | Verifies a Google reCAPTCHA response. | `{ "response": "string" }` |

## Breach Monitoring Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /enzoic/breach-monitoring | Adds breach monitoring for a domain. | Query: `domain` (string) |
| GET | /enzoic/webhook-test | Tests the webhook functionality. | None |
| POST | /enzoic/add-domain-alert-subscriptions | Adds domain alert subscriptions. | Query: `domains` (string[]) |
| DELETE | /enzoic/delete-domain-alert-subscriptions | Deletes domain alert subscriptions. | Body: `{ "domains": "string[]" }` |
| GET | /enzoic/check-domain-subscription | Checks if a domain is subscribed for alerts. | Query: `domain` (string) |
| GET | /enzoic/domain-alert-subscriptions | Gets a list of domain alert subscriptions. | Query: `pageSize` (number), `pagingToken` (string) |
| POST | /enzoic/register-webhook | Registers a new webhook. | Body: `{ "url": "string" }` |

## Cleartext Credentials Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /cleartext-credentials/credentials-by-domain | Gets cleartext credentials for a given domain. | Query: `domain` (string), `pageSize` (string), `pagingToken` (string), `includeExposureDetails` (string) |
| GET | /cleartext-credentials/credentials-by-email | Gets cleartext credentials for a given email. | Query: `username` (string), `includeExposureDetails` (string) |

## Default Questions Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /questions/fetch-default-questions | Fetches all default questions. | None |

## Clients Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /clients | Fetches all clients. | None |
| POST | /clients/create-client | Creates a new client. | `ClientDto` |
| GET | /clients/client-by-username/:username | Gets a client's name and ID by username. | Param: `username` (string) |
| GET | /clients/organizations | Gets all client organizations. | None |
| GET | /clients/id/:id | Gets a single client by ID. | Param: `id` (string) |
| GET | /clients/monitored-domains/:username | Gets the monitored domains for a client. | Param: `username` (string) |
| PUT | /clients/update/:id | Updates a client's information. | Param: `id` (string), Body: `ClientDto` |
| DELETE | /clients/remove/:id | Removes a client. | Param: `id` (string) |

## Dashboard Logics Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /dashboardlogics/stats | Gets dashboard statistics. | None |
| GET | /dashboardlogics/search-count | Gets the search count. | Query: `source` (string) |
| POST | /dashboardlogics/add-search | Adds a new search entry. | Body: `{ "keyword": "string", "resultLength": "number", "source": "string" }` |

## Exposure Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /threatcure-exposures/by-email-exposures | Gets exposures by email. | Query: `usernames` (string), `includeExposureDetails` (number) |
| POST | /threatcure-exposures/check-password-exposure | Checks if a password has been exposed. | Body: `{ "password": "string" }` |
| GET | /threatcure-exposures/exposures/domain | Gets exposures by domain. | Query: `domain` (string), `includeExposureDetails` (number), `pageSize` (number), `pagingToken` (string) |
| GET | /threatcure-exposures/exposures/details | Gets exposure details by exposure ID. | Query: `exposureId` (string) |
| GET | /threatcure-exposures/exposures-for-chart/:domain/:pageSize | Gets exposure data for charts. | Param: `domain` (string), `pageSize` (number) |

## Feedback Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| POST | /feedback | Submits feedback. | Body: `{ "feedbackText": "string", "attendanceId": "string", "questionId": "number" }` |

## OTX Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /otx/pulses | Gets subscribed pulses from OTX. | None |
| GET | /otx/pulses/:pulseId/indicators | Gets indicators for a specific pulse. | Param: `pulseId` (string) |
| GET | /otx/ip/:ip | Gets the reputation of an IP address. | Param: `ip` (string) |
| GET | /otx/domain/:domain | Gets the reputation of a domain. | Param: `domain` (string) |
| GET | /otx/url/:url | Gets the reputation of a URL. | Param: `url` (string) |
| GET | /otx/file/:fileHash | Gets the reputation of a file hash. | Param: `fileHash` (string) |

## Passwords Breach Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /password-breach | Returns a welcome message. | None |
| POST | /password-breach/hash | Checks if a password has been breached. | Body: `{ "password": "string" }` |

## SuperUser Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| - | /users | No routes defined in this controller. See `auth.controller.ts` for super-user creation. | - |

## Tabletop Sessions Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| - | /tabletop-sessions | No routes defined in this controller. | - |

## QR Code Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| POST | /qrcode/generate | Generates a QR code for a campaign. | Body: `{ "campaignId": "string", "data": "string" }` |
| GET | /qrcode | Gets a QR code by campaign ID. | Query: `campaign-id` (string) |
| DELETE | /qrcode/delete/:id | Deletes a QR code by campaign ID. | Param: `id` (string) |

## Tabletop Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| GET | /tabletop | Returns a welcome message. | None |
| POST | /tabletop/campaign/create | Creates a new tabletop campaign. | `CreateTabletopCampaignDto` |
| GET | /tabletop/campaigns | Gets all tabletop campaigns. | None |
| GET | /tabletop/campaigns/:id | Gets a tabletop campaign by ID. | Param: `id` (string) |
| GET | /tabletop/campaigns/client/:id | Gets tabletop campaigns by client ID. | Param: `id` (string) |
| GET | /tabletop/campaigns/completed/client/:id | Gets completed tabletop campaigns by client ID. | Param: `id` (string) |
| GET | /tabletop/campaigns/completed/client/name/:name | Gets completed tabletop campaigns by client name. | Param: `name` (string) |
| GET | /tabletop/campaigns/name/:name | Gets tabletop campaigns by client name. | Param: `name` (string) |
| GET | /tabletop/campaigns/username/:username | Gets tabletop campaigns by username. | Param: `username` (string) |
| GET | /tabletop/questions/:id | Gets questions for a tabletop campaign. | Param: `id` (string) |
| GET | /tabletop/questions/name/:name | Gets questions for a tabletop campaign by name. | Param: `name` (string) |
| PATCH | /tabletop/:id/isRunning | Updates the running state of a campaign. | Param: `id` (string), Body: `{ "isRunning": "boolean" }` |
| GET | /tabletop/campaign-state | Gets the running state of a campaign. | Query: `id` (string) |
| POST | /tabletop/add-question-number | Adds a question number to a campaign. | `QuestionNumberDto` |
| PATCH | /tabletop/update-question-number/:id | Updates the question number of a campaign. | Param: `id` (string) |
| GET | /tabletop/get-question-number/:id | Gets the current question number of a campaign. | Param: `id` (string) |
| DELETE | /tabletop/delete-question-number/:id | Deletes the question number of a campaign. | Param: `id` (string) |
| PATCH | /tabletop/update-completion-status/:id | Updates the completion status of a campaign. | Param: `id` (string) |
| GET | /tabletop/campaign-completion-status/:id | Gets the completion status of a campaign. | Param: `id` (string) |

## Tabletop Attendance Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| POST | /tabletop-attendance | Creates a new attendance record. | `tt_attendance_Dto` |
| GET | /tabletop-attendance/:id | Gets an attendance record by ID. | Param: `id` (string) |
| GET | /tabletop-attendance | Gets all attendance records. | None |

## Tabletop Results Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| POST | /results/tabletop | Submits tabletop results. | Body: `{ "results": "TabletopResultsDto[]" }` |
| GET | /results/analysis/:campaignId | Gets analysis for a campaign. | Param: `campaignId` (string) |
| GET | /results/average/:campaignId | Gets average performance for a campaign. | Param: `campaignId` (string) |
| GET | /results/category-wise/:campaignId | Gets category-wise performance for a campaign. | Param: `campaignId` (string) |
| GET | /results/distribution/:campaignId | Gets performance distribution for a campaign. | Param: `campaignId` (string) |
| GET | /results/comparison/:campaignId | Gets overall performance comparison for a campaign. | Param: `campaignId` (string) |
| GET | /results/tabletop/radar-chart-data | Gets radar chart data for all campaigns. | None |
| GET | /results/tabletop/bar-chart-data | Gets bar chart data for all campaigns. | None |
| GET | /results/tabletop/doughnut-chart-data/:campaignId | Gets doughnut chart data for a campaign. | Param: `campaignId` (string) |
| GET | /results/tabletop/grade/:campaignId | Gets the grade for a campaign. | Param: `campaignId` (string) |

## Users Controller

| Method | Path | Description | Payload |
| --- | --- | --- | --- |
| POST | /client-users/create | Creates a new client user. | `CreateUserDto` |