---
name: portfolio-workflow
description: Build, change, review, or debug Tran Kim Dat's Next.js portfolio using its established product narrative, content sources, visual system, accessibility rules, and verification gates. Use for portfolio UI, case studies, content, interactions, metadata, contact/CV/GitHub features, or portfolio-focused refactors; skip unrelated repositories and generic questions that do not require changes to this portfolio.
---

# Portfolio Workflow

Use this skill to turn a short portfolio request into a repository-aware implementation. The user's explicit request takes precedence over this workflow.

## Establish context

1. Read the repository-root `AGENTS.md`. Treat it as the durable product brief and source map.
2. Inspect `git status --short` and preserve unrelated work.
3. Read only the canonical files relevant to the request, following the map in `AGENTS.md`; verify facts in code rather than copying the summary blindly.
4. If the task changes Next.js code, read the relevant installed guide in `node_modules/next/dist/docs/` before editing. If dependencies are absent, do not guess a current API.
5. Resolve a vague request with the existing product narrative and visual system. Ask a question only when a missing choice would materially change the product or require new authority.

## Route the work

Choose the smallest matching mode. A task can use more than one mode when its scope genuinely crosses boundaries.

### Visual execution

Use `gpt-taste` as the visual execution specialist for a new page, substantial section, redesign, or high-impact interaction. Apply its useful composition, typography, spacing, media, and motion judgment through the portfolio's existing system.

Portfolio constraints override generic `gpt-taste` defaults:

- preserve the existing dark editorial identity, palette, Outfit/Geist typography, content hierarchy, and evidence-led narrative unless the user requests a redesign;
- keep Framer Motion and Embla by default; do not add GSAP, a font, stock imagery, or an icon package solely because another skill prefers it;
- do not randomize or replace an established layout merely to create variance;
- existing small uppercase mono labels are intentional and are not removed mechanically;
- prefer local project evidence and images over remote placeholder assets;
- produce planning detail internally unless the user asks to see a design plan.

For small, localized UI fixes, execute directly in the current system without forcing a page-wide redesign.

### UX reviewer

Use `ui-ux-pro-max` as an independent reviewer whenever the task changes layout, styling, responsive behavior, navigation, motion, a form, or another user interaction. Query only the relevant domain or stack; use a full design-system search only for a genuinely new page or explicit redesign.

Review the implementation, not just the intention, in this priority order:

1. accessibility and keyboard/focus behavior;
2. touch targets, feedback, and drag/scroll behavior;
3. responsive layout and horizontal overflow;
4. content hierarchy, readability, typography, and contrast;
5. motion semantics and reduced-motion behavior;
6. performance, image sizing, and layout stability;
7. consistency with the portfolio system.

Treat reviewer output as evidence-based recommendations. Fix issues within the user's scope. Do not persist a replacement design system or use destructive/force flags without explicit authorization.

### Content and case studies

Edit canonical data first: `lib/site.ts`, `lib/projects.ts`, `lib/experience.ts`, or `lib/capabilities.ts`. Keep public copy in English unless the user requests another language. Preserve the distinction between product context, ownership, challenge, approach, architecture, and verified outcomes. Never invent a metric or professional fact.

For a project change, trace every consumer: homepage carousel, professional timeline, static case-study page, metadata/OG image, sitemap, project navigation, media, counts, and material README documentation.

### Server features and integration

For contact, CV, GitHub statistics, metadata, or deployment behavior, preserve server/client boundaries and graceful degradation. Keep secrets server-only, validate untrusted inputs, bound external calls, and test missing configuration plus upstream failure. Use the smallest relevant platform-specific skill only when the request genuinely needs it.

### Diagnosis or review only

When the user asks for diagnosis, audit, or review without asking for a fix, inspect and report evidence with file locations; do not edit implementation files. The `ui-ux-pro-max` reviewer may be used read-only for interface audits.

## Implement

- Prefer existing components, tokens, dependencies, and content types.
- Maintain static generation and server isolation where currently intended.
- Keep interactive client components narrowly scoped and clean up listeners, animation frames, timeouts, and abort controllers.
- Preserve mobile-first behavior, keyboard parity, focus states, reduced motion, and print visibility.
- Avoid duplicate constants and one-off styling that belongs in a canonical source or token.
- Do not broaden the task into a rewrite, dependency migration, deployment, or external mutation without the user's request.

## Verify

Run the narrowest meaningful checks while iterating, then the full repository gate for implementation changes:

```bash
corepack yarn typecheck
corepack yarn lint
corepack yarn build
```

For visible work, verify the affected flow in a real browser at mobile, tablet, and desktop widths. Inspect console errors, keyboard navigation, focus, touch/drag behavior, overflow, reduced motion, states, media, and links. Use `ui-ux-pro-max` for the final UX review, then address in-scope findings and rerun affected checks.

For content-only Markdown changes, validate links/paths and internal consistency; do not run the application build merely to create noise.

## Deliver

Report the outcome first, name the key files changed, summarize verification actually performed, and disclose any unverified path or remaining risk. Mention specialist-skill influence only when it materially changed the result. Do not claim a check passed unless it ran successfully.
