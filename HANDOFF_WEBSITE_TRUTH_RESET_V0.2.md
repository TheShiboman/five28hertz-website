# Executor Handoff — Website Truth Reset v0.2

Branch: `website-truth-reset-v0.2`
Draft PR: #2
Base: `main` @ `0b5bd58cb3b34d9b30bb9dd21a15214daaa70642`

## Mission
Validate and harden the Founder-approved Website Truth Reset implementation without changing its approved public meaning. Do not deploy or merge.

## Required execution

1. Checkout `website-truth-reset-v0.2` and confirm HEAD matches the PR.
2. Run dependency install using the repository's existing lockfile and supported package-manager workflow.
3. Run the available typecheck/build/test/lint scripts. Record exact commands and outputs.
4. Fix only implementation defects necessary to make the approved specification compile and render correctly. Do not rewrite approved copy or add new public claims.
5. Perform a reachability/dependency census of the legacy routes/components removed from `App.tsx` reachability. Determine what can safely remain dormant versus what should be deleted in a later cleanup commit. Do not delete data/backend code merely because a page is unreachable.
6. Render and inspect desktop + mobile widths. Verify:
   - six-surface sequence remains Orientation → Living Architecture → Expressions → Evidence → Lineage → Quiet Contact;
   - no legacy CTA/login/newsletter/funnel is reachable from the new shell;
   - no horizontal overflow, broken typography, overlapping fixed header, or illegible contrast;
   - expression artifacts read as discovery surfaces rather than CTA cards;
   - subtle motion respects reduced-motion behavior if already supported; otherwise flag it.
7. Verify outbound destinations `https://qxtworld.com` and `https://528hz.studio` resolve as intended. Do not substitute alternate URLs without Founder approval.
8. Keep Quiet Contact non-functional until the exact release email destination is explicitly verified; do not invent one.
9. Audit accessibility basics: landmark structure, heading order, keyboard navigation, focus visibility, link labels, contrast, and mobile navigation behavior.
10. Report whether deployment wiring in `firebase.json` / `.firebaserc` and repository history is sufficient to identify the exact release command, but **do not deploy**.
11. Commit any build-fix changes to the same branch and update PR #2 with a concise validation comment.

## Non-negotiable boundaries

- No production deployment.
- No merge to `main`.
- No public-copy changes except exact typo/compile escaping fixes; semantic copy changes require Founder review.
- No reintroduction of Join / Invest / Submit / Sign Up / Get Started / newsletter / Login-Register parent funnels.
- Do not expose DreamWeaver OS internal mechanics.
- Do not promote ExchangeSphere or RealEyes into primary standalone artifacts.
- Do not add numerical scale claims or future-event claims.

## Required return packet

Return:
- STATE: PASS / PASS-WITH-FIXES / BLOCKED
- exact HEAD SHA
- exact commands run + results
- files changed after handoff
- build/typecheck/lint/test results
- desktop/mobile render findings
- accessibility findings
- outbound-link verification
- legacy-route dependency census
- deployment-command confidence + evidence
- remaining blockers
- explicit statement: `NOT MERGED / NOT DEPLOYED`
