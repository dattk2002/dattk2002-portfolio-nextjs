# CV and portfolio synchronization

> Execution: inline, using executing-plans. The user approved the content audit in chat, with FPT Software retained as a separate internship. No branches, commits, pushes, deployments, database writes, or external document edits are authorized.

**Goal:** Deliver the approved two-page General PDF and align portfolio identity, education, experience, and project ownership with it.

**Architecture:** Keep canonical content in `lib/site.ts`, `lib/projects.ts`, `lib/experience.ts`, and `lib/capabilities.ts`. Serve the bundled PDF directly from `/api/cv`, retaining attachment/inline behavior. Reuse existing case-study, carousel, and timeline presentation.

**Stack:** Existing Next.js App Router, React/TypeScript, Node test runner, Tailwind design tokens, local WebP media. No dependency changes.

**Spec:** User-approved comparison in this conversation and `/home/bia/Documents/Dat's CV & Cover Letter/CV/General/CV-Tran-Kim-Dat-Software-Engineer.pdf`.

## Constraints and review focus

- Preserve the dirty working tree and unrelated GitHub statistics changes.
- General title: Software Engineer; nearly 3 years; FPT University Oct 2020–Sep 2024; graduation status only in public Education (GPA hidden at the owner’s request).
- Keep FPT Software Dec 2022–Apr 2023, with LMS Feb–Apr 2023, independently from DAN SOLUTIONS internship Dec 2023–Mar 2024.
- DAN SOLUTIONS employment is continuous Dec 2023–May 2026, with engineer role Mar 2024–May 2026. Freelance starts Jun 2026.
- Do not infer individual project dates, sole authorship, new metrics, or new repository URLs. Await clarification about NgoaiNguNgay and Fastcare; retain unresolved historical dates if no answer arrives and record the caveat.
- Both CV variants must contain exactly the approved PDF bytes, never a stale Google Docs export. Missing/invalid files return a generic uncached 503.
- Ensure file tracing includes the bundled PDF in server deployments.
- New case studies must have real, public, non-sensitive product captures with dimensions and alt text.
- Verify longer project text, timeline role labels, focus, reduced motion, links, overflow, and console errors at mobile/tablet/desktop widths.

## Task 1: Bundled CV delivery

- [x] Rewrite route tests first: verify exact approved bytes for download and preview without network; cover missing, invalid, and oversized files.
- [x] Run focused tests; expect failures against the old remote-first route.
- [x] Replace bundled PDF; read/validate it directly in the Node route; include its path in output tracing; preserve filename and inline/attachment semantics.
- [x] Run focused tests and the full existing test suite; expect all passing.

## Task 2: Canonical content and experience

- [x] Update identity, summary, education, EF SET year, metadata, and supporting delivery narrative.
- [x] Correct the six existing client/freelance project records to the new contribution scope; avoid unattributed product-wide metrics.
- [x] Add HuntingAlice and Mystical Orb records and optimized public captures. Use date-neutral wording where individual dates are unknown.
- [x] Group freelance projects and continuous DAN SOLUTIONS employment; display role periods while preserving FPT Software internship and personal projects.
- [x] Apply confirmed date corrections if the user supplies them. Update README, AGENTS.md, and authorized professional profile.
- [x] Run typecheck, lint, and build; expect exit 0. Check generated project routes, OG images, sitemap and counts.

## Task 3: Browser verification and review

- [x] Start the local app; verify CV download and preview bytes, headers and UI activation.
- [x] Verify homepage/timeline, both new case studies, longer existing case studies, responsive sizing, keyboard focus and reduced motion.
- [x] Review final task diff separately with ui-ux-pro-max; fix objective findings and rerun affected checks.
- [x] Report verified results and any unresolved date caveat. Leave all changes uncommitted.

## Verification and decisions

- Baseline: all 30 tests passed before implementation. The seven new CV-route expectations failed against the old remote-first implementation, then passed after the change; final full suite: 30/30.
- Typecheck, ESLint, and production build exited 0. Build generated 13 case-study routes and 13 project social images; CV output trace contains the approved PDF. Existing warnings about the parent-directory lockfile, Node experimental module mocks, and PostgreSQL SSL-mode aliases are unrelated to this change.
- Browser: 36 successful flow checks across 375/768/1440 px; no console/page errors or failed HTTP responses. Verified exact PDF hash in both API variants and a UI-triggered download, preview popup, carousel/detail-scroller keyboard input, timeline roles and both internships, all nine affected case studies, images, sitemap, OG images, and default-motion mobile navigation/focus restoration. Screenshots inspected for the homepage, carousel, new case studies, and DAN SOLUTIONS role history. Evidence: `/tmp/portfolio-cv-audit/browser-results.json`.
- Test-harness corrections: headless shell lacks a normal PDF document lifecycle, so browser verification used full Chromium and navigation commit for preview. Keyboard scrolling is compositor-driven, so the harness waits for the actual bottom position rather than sampling immediately after End. No application fixes were needed for these harness assumptions.
- User clarified NgoaiNguNgay May–Sep 2024 during implementation; applied and recorded in the professional profile.
- Fastcare's displayed Dec 2023–Mar 2024 scopes the internship contribution, following its placement in the new CV and the prior authorized profile. It does not assert a product lifetime or that no work occurred later. VNCaps May–Aug 2024 also comes from the recorded CV profile.
- HuntingAlice and Mystical Orb display contribution year 2026 only, without inventing start/end months. Public sign-in/homepage screenshots are optimized WebP; no authenticated prospect data is published.
- Independent read-only code/content/UX review found no actionable findings and no Important/Critical issues. No branches, commits, pushes, deployments, external document edits, or database writes were performed.

## Follow-up: associate role labels with their projects

- User clarified that Fastcare was the only DAN SOLUTIONS internship project. Replaced detached role metadata and the flat employer project list with canonical `Experience.groups`, each owning its role and projects. The engineer group contains Panda/Tamda/Caocao/VNCaps; a subsequent internship group contains only Fastcare. Both remain within one continuous employer milestone.
- Timeline renders role metadata beside the corresponding project group on tablet/desktop and before that group on mobile. Named semantic groups expose the same relationship to assistive technology. Existing project IDs, accordion controls, links, and derived counts are preserved.
- Regression browser check first failed against the detached-role layout, then passed at 375/768/1440 px, including exclusive internship ownership, ordering, keyboard expansion, unchanged 8 milestones/14 projects, no overflow, and no console/page errors. Screenshots visually reviewed. Evidence: `/tmp/portfolio-cv-audit/role-groups-green.log` and `role-groups-*.png`.
- Typecheck, lint, production build, full 30-test suite, and diff whitespace check passed. AGENTS.md and the authorized professional profile record the explicit ownership correction. Changes remain uncommitted and undeployed.
