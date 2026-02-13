# Specification

## Summary
**Goal:** Fix Coloring Studio template loading and drawing reliability (mouse + touch) and polish the app’s UI so it feels cohesive and “cool.”

**Planned changes:**
- Fix Studio drawing so strokes consistently appear on the drawing layer for both mouse and touch, without refresh/re-entry, and remain aligned across viewport sizes (no offset/scaling issues).
- Ensure hero template images and the app logo are served as static frontend assets from `/assets/generated/...`, and that Gallery previews + Studio template layer correctly reference the 12 hero template filenames used by the app.
- Add Studio guardrails/diagnostics: handle template load slow/fail states, initialize canvas sizes safely before template dimensions are known, and provide clear kid-friendly UI messaging while still allowing drawing (including on a blank background if templates fail).
- Polish Home, Gallery, and Studio UI for consistent styling (spacing, typography, buttons/controls, cards/headers) without adding new features; keep all user-facing text in English.

**User-visible outcome:** Users can pick any hero and reliably paint in Studio on desktop or mobile even if templates are slow or missing, Gallery/Studio templates no longer show broken images, and the overall app looks more polished and consistent.
