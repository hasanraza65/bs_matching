# CLAUDE.md — Ponctuel / Bloom Buddies (babysitting platform)

## Repos (both cloned locally)
- **Frontend** `~/ponctual-module` — React 19 + Vite + Tailwind v4 + TS. GitHub `Enqavon-Technologie/ponctual-module`. Branch: **`feature/persistent-login`** (HEAD `8805b19`, pushed).
- **Backend** `~/ponctual_tourist_laravel` — Laravel 10/11, PHP 8.3, Sanctum (SQLite locally). GitHub `Enqavon-Technologie/ponctual_tourist_laravel`. Branch: **`feature/matching-phase4`** (HEAD `f8a4033`, pushed).
- FE→BE via `VITE_API_BASE_URL`. Prod BE = `https://ponctuel.bloom-buddies.fr/backend/public/api`. **Prod DB differs from repo** (manual columns); nothing from these branches is deployed to prod yet.

## Architecture
- **Auth**: Sanctum bearer in `localStorage.auth_token` + `auth_role`. `checkAuth` (App.tsx) optimistically restores from `auth_role`, never auto-logs-out on 401. Admin = `ponctuel@bloom-buddies.fr`. Local login is OTP/email-based (no SMTP locally) → log in by injecting a token in console: `localStorage.setItem('auth_token','<tok>');localStorage.setItem('auth_role','parent'|'admin');location.href='/'`.
- **Booking flow** (`src/App.tsx`): 3 steps → price quote → `acceptPriceQuote` → **parent dashboard** (full reload to `/`; register sets `auth_role='parent'` so reload routes correctly). Logged-in "new request" pre-fills name/address/children from account. Routes parsed in App.tsx: `/price/:id`, `/contract/:id`, `/match/:id`, `/cmg/:id`. Standalone routes mounted in `main.tsx`: `/interview/:channel`, `/babysitter-contract/:choiceId`.
- **Admin** (`src/components/AdminDashboard.tsx`, ~4k lines): sidebar = Pending Requests · Requests in Matching · Pending Signature & Payment · **Pending Babysitter Signature** · **Completed Requests** · **All Parents**. (Invoices/Contracts/Attestations sidebar items commented out — now shown inside the parent's detail page; "All Users"→"All Parents".) Header logo says "Punctual Babysitting".
- **Parent dashboard** (`src/components/ProfilePage.tsx`): request card computes a `stage` mirroring admin: `awaiting → proposed → final-choice → contract → completed`, each with a banner. No "Modifier" button (delete only while `awaiting`). Tabs: Mes Demandes · CMG · Factures · Attestations. Header has a consolidated **account menu** (dashboard / new request / logout); EN/FR toggle visible on mobile.

## Full request lifecycle (core feature — WORKS end-to-end locally)
1. Parent books → quote → accept → dashboard (`request awaiting`).
2. Admin **proposes** 3-5 candidates (ext dir `bloom-buddies.fr/api/all-bs-for-api`) → parent emailed `/match/:id`.
3. Parent **selects** candidates + schedules **Agora video interviews** (`parent_babysitter_choices.status`: proposed→selected→rejected).
4. Admin **final choice** (`final_choice=1`) → creates `contract` → request → **Pending Signature & Payment**.
5. Parent **signs+pays** first month at `/contract/:choiceId` (card via Stripe, OR bank/CESU + proof upload). Contract `status=1`.
6. On payment, BE auto-generates **one invoice per month** (month 1 Paid, rest Pending, due end-of-month) AND **auto-generates the babysitter contract + emails them** a signing link → request → **Pending Babysitter Signature**.
7. Babysitter opens `/babysitter-contract/:choiceId` (no account), enters DOB/SSN, signs (CDD template in `BabysitterContractView.tsx`, PDF via `utils/babysitterContractPdf.ts`). Sets `contracts.babysitter_signed_at` → request → **Completed Requests** (with total hours + revenue, downloadable parent & babysitter PDFs).
8. **Subsequent monthly invoices**: parent pays each from Factures tab via `InvoicePaymentModal` — now supports **Card / Virement / CESU** (proof upload) just like the contract popup.

Key BE: `ParentBabysitterChoiceController`, `ParentRequestController` (`pendingBabysitterSignatureRequests`, `completedContractRequests`), `BabysitterContractController` (show/sign), `PaymentController` (`submitPaymentProof` contract, `submitInvoiceProof` per-invoice, `confirmInvoicePayment`), `AgoraTokenController`. Migrations add: `zoom_meeting_link`/`babysitter_*` cols on contracts, `payment_proof` on invoices.

## Agora video interviews (WORKS — token bug fixed this session)
Deterministic channel `interview_{choiceId}`; standalone FE room `/interview/:channel` (`InterviewRoom.tsx`, `agora-rtc-sdk-ng`, name-gated lobby, equal-size grid, token-auth). BE token server `AgoraTokenController@token` (`GET /api/agora/token`, public) using vendored `app/Agora/RtcTokenBuilder2.php`. **Two bugs fixed**: 007 token must be `gzcompress`'d; HMAC key/message were swapped in `getSign()`. Verified byte-identical to Agora's official lib; live join authenticates. Creds in BE `.env`: `AGORA_APP_ID=8d99e215697c43b2ad3ac0debafbeb1a`, `AGORA_APP_CERTIFICATE=789f5c6904c647818c6da85046fd18c1` (+`config/services.php`). DB column kept named `zoom_meeting_link` (holds Agora URL) to avoid risky prod rename.

## Broken / gaps
- **No admin UI to view/verify uploaded payment proofs** (contract first-month + monthly invoices). Proofs are stored (`invoices.payment_proof`, public disk) and attached, but admin can't yet view/approve them. ← likely next task.
- **No recurring auto-charge**: months 2+ are Pending invoices paid manually (card or proof); no Stripe subscription, no due-date reminder emails.
- **Nothing deployed to prod** — needs `php artisan migrate` + `php artisan storage:link` + Agora env + `config:clear` on prod; restore FE `.env` `VITE_API_BASE_URL` to prod URL before FE deploy.
- Camera-based video render only verifiable in a real browser w/ webcam (not headless preview).

## Local dev run
- BE: `cd ~/ponctual_tourist_laravel && php artisan serve --port=8000` (run in background so it persists). Seeder: `php artisan db:seed --class=LocalTestSeeder`.
- FE: Vite dev (preview tool, dynamic port). `.env` `VITE_API_BASE_URL=http://localhost:8000/api` (local-only, **git-ignored from commits — always `git restore --staged .env`**).
- Demo data created this session: **Jane Doe** req#1 (completed flow); **Demo MultiMonth** `demo.multimonth@example.com`/`password` (user 17, 4-month booking, month-1 invoice paid + 3 pending — for testing the Factures/invoice-payment flow). Mint a token: `php artisan tinker --execute='echo App\Models\User::find(17)->createToken("x")->plainTextToken;'`

## Git
All work committed + pushed (FE `8805b19`, BE `f8a4033`). Commit messages end with `Co-Authored-By: Claude Opus 4.8`. **Always exclude `.env`** when committing FE.

## Immediate next steps
1. **Admin proof viewer/verifier**: surface `invoices.payment_proof` (and contract first-month proof) in the admin invoice/pending views; let admin mark verified → `Paid`.
2. (Optional) recurring billing: Stripe subscription OR due-date reminder emails for monthly invoices.
3. Deploy to prod (see Broken/gaps) + restore prod FE `.env`.
4. Old security follow-up: purge RCE backdoor from FE git history (`git filter-repo`) + rotate admin password/tokens.
