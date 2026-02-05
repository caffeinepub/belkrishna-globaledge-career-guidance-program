# Specification

## Summary
**Goal:** Deliver the BELKRISHNA GlobalEdge Career Guidance Program web app with Internet Identity login, student profiles, a full 150-question assessment workflow, automated scoring, and editable/persisted career guidance reports with history.

**Planned changes:**
- Add Internet Identity sign-in and student profile create/fetch/update persisted in the Motoko backend keyed by principal.
- Build the full 150-question assessment experience (start, navigation, progress, autosave responses, review, submit) and resume in-progress sessions after refresh by loading from backend.
- Implement backend scoring for completed assessments, with persisted score outputs retrievable later (stable storage).
- Generate a report after scoring, and provide a frontend report viewer/editor with persisted edits plus versioning metadata (last updated time, updated by).
- Add backend storage/APIs for sessions, responses, scores, and reports; support listing history and fetching by ID with access control (owner or admin) and stable storage across upgrades.
- Create the end-to-end frontend workflow/screens: landing/dashboard, onboarding/profile, assessments list, active assessment, results/scores, report viewer/editor, and history.
- Apply a consistent visual theme (colors, typography, spacing, responsive styling) across all screens and states.
- Add required static image assets under `frontend/public/assets/generated` and render them in the UI without backend calls.

**User-visible outcome:** A student can sign in with Internet Identity, complete and resume a 150-question assessment, submit to receive persisted scores and a generated report, edit and save report fields, and browse/reopen past sessions and reports in a themed, responsive UI.
