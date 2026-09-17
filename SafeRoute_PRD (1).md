# SafeRoute — Product Requirements Document
**Community-Powered Urban Safety Navigation Platform**
WeMakeDevs "First Commit" Hackathon — Ship It Track

---

## 1. Overview

**Product:** SafeRoute (internally "SafeSteps on AWS")
**Platform:** React Native (Expo) mobile app + AWS serverless backend
**Category:** Urban safety navigation, community incident reporting, real-time emergency response

**One-line pitch:** SafeRoute helps people move through cities more safely by combining crowdsourced incident reports, AI-generated risk analysis, safety-weighted routing, and instant emergency alerts — all on a fully serverless AWS stack.

**Problem statement:** Existing navigation apps optimize purely for speed or distance and ignore real-time safety conditions (poor lighting, harassment reports, infrastructure hazards). Victims of unsafe situations also lack a fast, low-friction way to alert nearby trusted contacts with their live location.

**Solution:** A mobile app where users report and view hazard "pins" on a live map, receive AI-generated predictive warnings before entering risk zones, get routed along the safest (not just fastest) path, and can trigger an SOS that streams live GPS and blasts SMS alerts to contacts within a 5km radius — all built on AWS managed services for hackathon-speed delivery and real scalability.

---

## 2. Goals & Success Metrics

| Goal | Metric | Target for Demo |
|---|---|---|
| Working auth + navigation shell | User can sign up, log in, move between tabs | 100% functional, JWT issued |
| Community hazard reporting | Pin created → visible on map with correct TTL decay | < 2s round trip |
| Emergency response speed | SOS press → SMS delivered to contacts in radius | < 3 seconds |
| Safety-aware routing | Safest route visibly distinct from fastest route | Safety Score 0–100 displayed |
| Predictive AI alerts | Geofence entry → Bedrock-generated warning toast | < 5s from event to toast |
| Voice incident reporting | Voice memo → transcribed, categorized, pinned | < 10s pipeline latency |
| Live deployment | Public Amplify Hosting URL, functioning end-to-end | Demo-able without local setup |

**Non-goals for hackathon scope:** payment systems, multi-language localization, native iOS/Android builds beyond Expo Go/EAS preview, offline-first sync, law-enforcement integrations beyond the analytics portal.

---

## 3. Users & Personas

- **Primary user — "Night Commuter":** walks/commutes through unfamiliar or high-risk areas after dark; wants the fastest *safe* path and a one-tap panic button.
- **Secondary user — "Community Reporter":** wants to flag hazards (broken streetlights, harassment incidents) to protect their neighborhood.
- **Tertiary user — "Trusted Contact":** receives SOS SMS alerts and live tracking link; not necessarily an app user.
- **Stakeholder — "City/Authority Analyst":** views aggregated, anonymized incident analytics via the web portal.

---

## 4. Architecture Summary

| Layer | AWS / Tech Choice |
|---|---|
| Mobile frontend | React Native (Expo), NativeWind, MapLibre GL / react-map-gl |
| Identity & app framework | AWS Amplify Gen 2, Amazon Cognito |
| Mapping & geofencing | Amazon Location Service (Maps, Routes, Geofencing) |
| Database & real-time sync | Amazon DynamoDB (Geo-index + TTL), AWS AppSync / API Gateway |
| Compute & orchestration | AWS Lambda (Node.js), Amazon EventBridge |
| AI/ML | Amazon Bedrock (Claude 3 Haiku), Amazon Transcribe |
| Real-time stream & alerts | AWS IoT Core (MQTT, 5s GPS sync), Amazon SNS |
| Security & observability | AWS KMS (AES-256), Amazon CloudWatch |

**Design language:** Dark/light violet theme, high contrast, accessible (WCAG AA target), optimized for one-handed, fast emergency interaction.

---

## 5. Rules of Engagement (Delivery Process)

1. **No big-bang releases** — exactly one feature ships at a time.
2. **Every sprint follows the same 3-step cycle:**
   - **Step A — Frontend:** Build the React Native UI with mock/stubbed data first.
   - **Step B — Backend/Cloud:** Build the corresponding Lambda function, DynamoDB table, or Amplify/SDK config.
   - **Step C — Integration & Test:** Wire frontend to real AWS backend, run an end-to-end test, confirm the sprint Goal is met before moving on.
3. No sprint N+1 work begins until sprint N is verified working.
4. UI stays dark/light violet themed, high-contrast, responsive, and accessible throughout, with emergency actions optimized for speed.

---

## 6. Sprint-by-Sprint Requirements

### Sprint 1 — Foundation, App Shell & Cognito Authentication
**Objective:** Establish the app skeleton and secure identity layer everything else depends on.

- **Step A (Frontend):**
  - Initialize Expo project with NativeWind configured for the violet theme (light/dark tokens).
  - Bottom tab navigator with 4 tabs: **Home Map, Route Planner, Community Feed, Profile**.
  - Auth screens: Sign Up, Log In, Verify (email/phone OTP), with mocked success/failure states.
- **Step B (Backend/Cloud):**
  - Configure AWS Amplify Gen 2 project (`amplify/backend.ts`, `auth` resource).
  - Amazon Cognito User Pool: email + phone sign-in, MFA optional, custom attributes (e.g., `trustedContactsCount`).
- **Step C (Integration & Test):**
  - Wire Amplify Auth SDK into sign-up/login screens.
  - Verify JWT issuance, session persistence, and protected navigation (tabs inaccessible pre-auth).
- **Acceptance criteria:** New user can register, confirm identity, log in, receive a valid Cognito JWT, and freely navigate all 4 tabs; logging out revokes access to protected screens.

---

### Sprint 2 — Community Pin System & Dynamic Heatmap
**Objective:** Let users see and contribute to a live, decaying map of community safety reports.

- **Step A (Frontend):**
  - Full-screen MapLibre map on the Home tab.
  - "Report Pin" modal: category selector (Safe / Unpleasant / Dangerous), optional note, submit button.
  - Severity/time filters: 1h / 24h / 7d toggle.
- **Step B (Backend/Cloud):**
  - DynamoDB `SafetyPins` table: partition/sort key design for geo-queries, `ttl` attribute for 72-hour auto-expiry, `severity`, `category`, `createdAt` attributes.
  - Lambda + API Gateway CRUD endpoints: `POST /pins`, `GET /pins?bbox=...`, `DELETE /pins/{id}` (owner/admin only).
- **Step C (Integration & Test):**
  - Frontend posts pin → confirm it appears in DynamoDB with correct TTL.
  - Map renders color-coded clusters (green/amber/red) refreshed on filter change.
  - Confirm expired pins stop rendering after TTL deletion.
- **Acceptance criteria:** A submitted pin is persisted, expires automatically after 72 hours, and the map reflects real-time density via color-coded clustering.

---

### Sprint 3 — Instant SOS, 5km Radius Net & SMS Dispatch
**Objective:** Deliver the core emergency-response loop: one tap to alert nearby trusted contacts.

- **Step A (Frontend):**
  - High-priority pulsing SOS button on Home screen (thumb-reachable, large hit area).
  - Trusted Emergency Contacts screen: add/remove contacts, phone number validation.
- **Step B (Backend/Cloud):**
  - AWS IoT Core (MQTT) topic or low-latency WebSocket API ingesting GPS pings every 5 seconds during an active SOS session.
  - Lambda: Haversine distance calculation against a DynamoDB `Contacts`/`Users` geo-index to find contacts within 5km.
  - Amazon SNS integration to send SMS with a live-tracking URL (short-lived signed link).
- **Step C (Integration & Test):**
  - Press SOS → confirm GPS streaming starts immediately.
  - Confirm real SMS delivery to test contacts within radius, and exclusion of contacts outside it.
  - Measure and confirm end-to-end latency (button press → SMS received) is under 3 seconds.
- **Acceptance criteria:** SOS activation streams live coordinates and triggers real SMS alerts to in-radius contacts within the 3-second target, including a working live-tracking link.

---

### Sprint 4 — Safety-Weighted Route Navigation
**Objective:** Route users along the statistically safer path, not just the fastest one.

- **Step A (Frontend):**
  - Destination search bar with autocomplete.
  - Route selection cards: **Fastest** vs **Safest**, showing ETA and Safety Score side by side.
- **Step B (Backend/Cloud):**
  - Call Amazon Location Service Routes API for candidate route geometries.
  - Lambda scoring function: evaluate pin density, severity weighting, and recency decay along each candidate route → output a 0–100 Safety Score.
- **Step C (Integration & Test):**
  - Confirm both route alternatives render correctly on MapLibre.
  - Confirm the safest route is visually highlighted as default and its score reflects live pin data (verify by injecting test "Dangerous" pins along the fastest route and confirming the score/ranking shifts).
- **Acceptance criteria:** For a given origin/destination, the app displays at least two route options with distinct Safety Scores, and the safer route is the default selection.

---

### Sprint 5 — Predictive Hazard Alerts (Geofencing + Bedrock AI)
**Objective:** Warn users proactively before they walk into a danger zone.

- **Step A (Frontend):**
  - In-app toast/banner component for real-time warnings, dismissible, accessible (screen-reader friendly, high contrast).
- **Step B (Backend/Cloud):**
  - Register dynamic geofences via Amazon Location Service around active "Dangerous" pin clusters.
  - EventBridge rule triggered on geofence-enter events (200m radius).
  - Lambda invokes Amazon Bedrock (Claude 3 Haiku) with grounded pin data to generate a concise warning (e.g., incident count, distance, recommendation).
- **Step C (Integration & Test):**
  - Simulate a user path crossing into a geofenced danger cluster.
  - Confirm EventBridge fires, Lambda calls Bedrock, and the generated warning toast appears client-side within ~5 seconds.
  - Validate the AI output stays grounded in actual pin data (no hallucinated incident counts).
- **Acceptance criteria:** Entering a 200m danger radius reliably produces an accurate, AI-generated warning toast before or immediately upon entry.

---

### Sprint 6 — AI-Enhanced Incident Reporting (Voice & Entity Extraction)
**Objective:** Let users report hazards hands-free via voice, with AI structuring the data.

- **Step A (Frontend):**
  - Voice-recording button inside the Report Incident sheet (press-and-hold or tap-to-record, with waveform/recording indicator).
- **Step B (Backend/Cloud):**
  - Audio upload to Amazon S3 → triggers Amazon Transcribe job for voice-to-text.
  - Bedrock (Claude 3 Haiku) processes the transcript to extract structured entities: street name, time, urgency, category (Lighting / Harassment / Infrastructure), plus a short summary.
  - Structured report written into the `SafetyPins` DynamoDB table.
- **Step C (Integration & Test):**
  - Record a sample voice report → confirm transcription accuracy.
  - Confirm Bedrock correctly extracts category/location/urgency fields.
  - Confirm a pin auto-appears on the map matching the extracted metadata.
  - Measure pipeline latency (target < 10s from recording stop to pin creation).
- **Acceptance criteria:** A spoken incident report results in an automatically transcribed, categorized, and geolocated pin without manual form entry.

---

### Sprint 7 — Authority Analytics Portal & Live AWS Deployment
**Objective:** Provide a stakeholder-facing analytics view and ship a live, demo-ready deployment.

- **Step A (Frontend):**
  - Web/mobile analytics dashboard: aggregated pin clusters on a map, safety trend lines over time, category breakdown charts (Lighting/Harassment/Infrastructure/etc.).
- **Step B (Backend/Cloud):**
  - DynamoDB Streams feeding into OpenSearch or Athena for analytical queries on incident hotspots and trends.
  - Full backend deployment to AWS; frontend build published via AWS Amplify Hosting.
- **Step C (Integration & Test):**
  - Confirm dashboard reflects real aggregated data from live DynamoDB streams.
  - Full smoke test of all 6 prior sprints against the live deployed environment (not local dev).
  - Publish and verify the public Amplify Hosting URL.
- **Acceptance criteria:** A publicly reachable URL demonstrates the complete, working SafeRoute AWS architecture end-to-end, suitable for hackathon judging.

---

## 7. Data Model Sketch

**`SafetyPins` (DynamoDB)**
| Attribute | Type | Notes |
|---|---|---|
| `pinId` | String (PK) | UUID |
| `geohash` | String (Sort/GSI) | For geo-range queries |
| `lat` / `lng` | Number | Coordinates |
| `category` | String | Safe / Unpleasant / Dangerous / Lighting / Harassment / Infrastructure |
| `severity` | Number | 1–5 |
| `note` / `summary` | String | User text or AI-generated summary |
| `createdAt` | String (ISO) | |
| `ttl` | Number (epoch) | 72-hour expiry |

**`Users` / `Contacts` (DynamoDB)**
| Attribute | Type | Notes |
|---|---|---|
| `userId` | String (PK) | Cognito `sub` |
| `trustedContacts` | List<Map> | name, phone, relation |
| `lastLocation` | Map | lat/lng, updated every 5s during SOS |

---

## 8. Security & Compliance Considerations

- All PII (phone numbers, live location) encrypted at rest via AWS KMS (AES-256).
- Cognito-issued JWTs required on all API Gateway/AppSync calls.
- Live-tracking SMS links should be short-lived, single-purpose, and non-guessable (signed tokens).
- CloudWatch alarms on Lambda error rates and SNS delivery failures, especially for the SOS path (Sprint 3) given its safety-critical nature.
- Voice recordings (Sprint 6) should be deleted from S3 after successful transcription unless the user opts to retain them.

---

## 9. Open Risks / Assumptions

- Amazon Location Service Routes API coverage and pricing for the target demo region should be validated early (Sprint 4 dependency).
- Bedrock (Claude 3 Haiku) latency under load may affect the < 5s predictive-alert target (Sprint 5) — consider caching/pre-computation for known clusters.
- SNS SMS delivery speed/cost varies by carrier and region; the 3-second SOS target (Sprint 3) should be load-tested, not just single-user tested.
- IoT Core MQTT vs. WebSocket API tradeoff for 5-second GPS streaming should be decided based on hackathon time budget — WebSocket API may be faster to stand up.

---

## 10. REST API Endpoint Reference

All endpoints sit behind Amazon API Gateway, authenticated via Cognito JWT (`Authorization: Bearer <token>`) unless marked **Public**. Base path: `/v1`.

### 10.1 Auth & Profile (Sprint 1)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Create a new Cognito user (email/phone) — typically proxied via Amplify Auth SDK, not a custom Lambda, but listed for completeness |
| POST | `/auth/confirm` | Confirm sign-up with OTP code |
| POST | `/auth/login` | Exchange credentials for Cognito JWT/session |
| POST | `/auth/refresh` | Refresh an expiring session token |
| GET | `/users/me` | Get current user's profile |
| PATCH | `/users/me` | Update profile (name, phone, notification prefs) |
| DELETE | `/users/me` | Delete account and associated data |

### 10.2 Safety Pins & Heatmap (Sprint 2)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/pins` | Create a new safety pin (category, severity, note, lat/lng) |
| GET | `/pins` | List pins by bounding box + time filter — e.g. `?bbox=lat1,lng1,lat2,lng2&window=24h` |
| GET | `/pins/{pinId}` | Get a single pin's detail |
| PATCH | `/pins/{pinId}` | Update a pin (owner only — e.g. correct category) |
| DELETE | `/pins/{pinId}` | Delete a pin (owner or admin only) |
| GET | `/pins/clusters` | Get pre-aggregated cluster data (count + avg severity per geohash cell) for map rendering at zoomed-out levels |

### 10.3 Emergency Contacts & SOS (Sprint 3)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/contacts` | List current user's trusted contacts |
| POST | `/contacts` | Add a trusted contact (name, phone, relation) |
| DELETE | `/contacts/{contactId}` | Remove a trusted contact |
| POST | `/sos/start` | Activate an SOS session; returns a `sessionId` and signed live-tracking URL |
| POST | `/sos/{sessionId}/ping` | Push a GPS coordinate update (also mirrored via IoT Core/WebSocket for the 5s stream — this REST fallback covers degraded connectivity) |
| POST | `/sos/{sessionId}/stop` | End the SOS session and stop alerting |
| GET | `/sos/{sessionId}/track` | **Public** (token-scoped via signed URL) — lets a trusted contact view live location without logging in |

### 10.4 Route Planning (Sprint 4)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/routes/plan` | Body: origin, destination, mode (walk/drive). Returns candidate routes from Location Service plus computed Safety Scores |
| GET | `/routes/{routeId}/score` | Recompute/fetch the current Safety Score for a previously generated route (scores can shift as new pins are added) |

### 10.5 Geofencing & Predictive Alerts (Sprint 5)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/geofences/sync` | Admin/system-triggered — recompute and register dynamic geofences around current "Dangerous" clusters |
| GET | `/geofences/active` | List currently active geofences (for debugging/analytics) |
| POST | `/alerts/generate` | Internal endpoint invoked by the EventBridge→Lambda flow to request a Bedrock-generated warning for a given geofence-entry event |
| GET | `/alerts/history` | List past predictive alerts shown to the current user |

### 10.6 Voice Incident Reporting (Sprint 6)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/incidents/voice/upload-url` | Returns a pre-signed S3 URL for the client to upload a voice recording directly |
| POST | `/incidents/voice/process` | Triggered after upload completes; kicks off Transcribe → Bedrock entity-extraction pipeline (can also be S3-event-triggered instead of client-called) |
| GET | `/incidents/voice/{jobId}/status` | Poll processing status (transcribing / extracting / done / failed) |
| GET | `/incidents/voice/{jobId}/result` | Get the final structured report (category, location, urgency, summary, linked `pinId`) |

### 10.7 Analytics Portal (Sprint 7)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/hotspots` | Aggregated incident hotspot data (from OpenSearch/Athena) for the map view |
| GET | `/analytics/trends` | Time-series safety trend data (e.g., incidents per day/week by category) |
| GET | `/analytics/categories` | Category breakdown counts for chart rendering |
| GET | `/analytics/export` | Admin-only — export aggregated (anonymized) data as CSV/JSON for authorities |

### 10.8 Conventions

- All list endpoints support `?limit=` and `?cursor=` pagination (DynamoDB-friendly).
- All timestamps are ISO 8601 UTC.
- Error responses follow a consistent shape: `{ "error": { "code": "STRING_CODE", "message": "human readable" } }`.
- Write endpoints (`POST`/`PATCH`/`DELETE`) on user-generated content enforce ownership checks in the Lambda authorizer or handler, not just at the API Gateway level.
- SOS-path endpoints (`/sos/*`) are the latency-critical path — target < 500ms Lambda execution time to stay within the overall 3-second SOS-to-SMS budget.

---

## 11. Execution Order Recap

Sprint 1 → 2 → 3 → 4 → 5 → 6 → 7, each gated by its own Step A → B → C cycle and acceptance criteria. No sprint begins before the previous one is verified end-to-end on real AWS infrastructure (not mocks).
