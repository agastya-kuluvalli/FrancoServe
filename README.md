# FrancoServe
`npm install && npm run dev` · `npm run build`
**Built:** homepage, directory (search/category/format/radius filters in URL), `/map` with clustering, synced list, location search (Nominatim; keep to low volume), opt-in geolocation (session-only), detail pages, `firestore.rules`.
**Data:** `src/data.ts` holds clearly labeled [Demo] records (city-center coordinates). Replace `useOpps` with Firestore reads of `opportunities`.
**Maps:** set `VITE_TILE_URL` to a production tile provider (see `.env.example`).
**Not built yet:** Firebase Auth, dashboard, hours tracking, registrations (capacity needs a Cloud Function), admin area, About page.

## Python backend
```
cd backend && pip install -r requirements.txt && uvicorn main:app --reload   # terminal 1
npm run dev                                                                  # terminal 2
```
Data lives in SQLite (`backend/francoserve.db`, created on first run with [Demo] records).
