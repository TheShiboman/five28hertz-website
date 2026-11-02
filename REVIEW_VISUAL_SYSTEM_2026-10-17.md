# five28hertz — Visual recovery and review qualification (unratified)

## Original design
Source: https://chatgpt.com/s/m_6ad2e07aa5f08191bf539450439537bd
Recovered preview image on RDC host: C:\Temp\five28-original-cinematic-reference.png.
Reference: layered luminous Core left; editorial headline right; teal, turquoise, amber field; connected portfolio paths. It is a conceptual image, not an original vector logo. The reference wrongly treats RealEyes as a sibling; current architecture retains it inside QXT World.

## Corporate asset inventory
- client/public/assets/five28hertz Corporate Logo.png — original corporate logo PNG with spiral and wordmark.
- client/public/assets/five28hertz-logo.png — additional raster logo.
- client/public/assets/pattern.svg — grid/wave pattern, not spiral.
- client/public/assets/five28hertz-spiral-cutout.png — generated imperfect raster derivative, not an original.
- client/src/components/LivingCore.tsx — SVG interpretation, not the corporate logo.
No original standalone spiral SVG verified in repository.

## Observed defects and repair
At 830px old navigation showed seven links alongside branding from 768px, causing collision. It now uses compact menu below 1280px.
At 830px the hero formerly stacked an oversized Core above the message; now 700–1023px uses side-by-side layout.
The user's unstyled Vision screenshot is a release blocker. However, public /vision/ returned correct absolute project-base CSS/JS paths and loaded styles during direct test, so a consistent root cause has not been established.
Static HTML for every preserved route must be deployed with absolute /five28hertz-website/assets/ URLs.

## Boundaries
Preserve all existing writing. No production promotion. No ratification of foundational statement or brand design. Existing corporate PNG remains header identity; the vector Core remains unratified illustration.

## Verification contract
7 routes x 3 viewport widths (390, 830, 1440), direct navigation + refresh; computed typography, stylesheets, images, console errors, overflow, header collision, preserved text. Audit accessibility separately.
