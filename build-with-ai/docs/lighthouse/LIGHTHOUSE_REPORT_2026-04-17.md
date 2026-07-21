# Lighthouse Audit Report — buildwithai.digital

Date: 2026-04-17
Target: https://buildwithai.digital
Method: Lighthouse 12.8.2 against the live production site using headless Chromium

## Executive Summary

The site is strong in accessibility and SEO, but the current homepage experience is being held back by JavaScript weight and a very slow Largest Contentful Paint.

### Category Scores

- Performance: 55
- Accessibility: 100
- Best Practices: 75
- SEO: 100

### Core Web Vitals / Key Metrics

- First Contentful Paint: 1.16s
- Largest Contentful Paint: 12.82s
- Total Blocking Time: 748ms
- Cumulative Layout Shift: 0.081
- Speed Index: 1.52s
- Time to Interactive: 16.18s

## What Is Working Well

1. Accessibility is excellent at 100.
2. SEO is excellent at 100.
3. Initial server response time is strong at about 30ms.
4. HTTPS is correctly configured.
5. DOM size is healthy and not excessive.

## Primary Risks Holding Performance Back

### 1. Largest Contentful Paint is critically slow

- Measured LCP: 12.8s
- This is the single biggest issue affecting perceived speed.

Impact:
- Users may think the page is slow or unfinished.
- Investor and customer first impressions degrade on slower devices and networks.

### 2. Too much unused JavaScript

Estimated savings: about 448 KiB

Largest offenders included several large Next.js chunks, including one chunk with more than 250 KiB of waste.

Impact:
- Longer parse and execution time
- Slower interaction readiness
- Higher mobile performance drag

### 3. Main-thread work is too heavy

- Main-thread work: 3.3s
- JavaScript execution time: 1.4s
- Total blocking time: 748ms

Impact:
- Delays interactivity
- Makes the homepage feel less responsive even if the server is fast

### 4. Console and CSP issues are present

Observed issues:
- 403 network resource error
- CSP frame restriction involving auth.openfort.io

Impact:
- Can break embedded auth or wallet flows
- Lowers the Best Practices score

### 5. Back/forward cache is blocked

Failure reasons included WebXR usage and no-store caching behavior.

Impact:
- Return navigations are slower than they could be
- Lower user experience on repeated visits

## Recommended Priority Order

### High Priority

1. Reduce homepage JavaScript bundle size
   - Defer non-critical wallet and Web3 modules below the fold
   - Split heavy client bundles further
   - Audit the largest Next.js chunks and lazy-load anything not needed for the first screen

2. Improve LCP on the homepage hero
   - Prioritize the primary hero content and fonts
   - Delay non-essential interactive widgets until after first paint
   - Ensure the largest hero element renders with minimal JS dependency

3. Fix console and CSP issues
   - Review the auth.openfort.io frame policy and blocked resource path
   - Remove 403-loading resources from the initial path

### Medium Priority

4. Trim unused CSS
   - Lighthouse estimated about 10 KiB of avoidable CSS waste

5. Reduce legacy JavaScript sent to modern browsers
   - Estimated savings around 14 KiB

6. Improve back/forward cache eligibility where feasible

## Bottom-Line Assessment

- The site is credible and technically solid from a trust and search standpoint.
- The main weakness is performance efficiency on the first load.
- This is fixable and does not require a narrative or brand change.
- The most leverage will come from reducing homepage JS weight and isolating wallet/auth features from the critical render path.

## Optimization Progress Through Pass Two

The optimization work preserved the site narrative while moving non-critical wallet and auth runtime off the initial render path.

### Changes applied

1. Reduced homepage first-load JavaScript.
2. Deferred wallet tooling until explicit user intent.
3. Deferred live domain search until requested.
4. Removed global web3 and auth providers from the root render path.
5. Localized OpenFort and web3 runtime only to the components and pages that actually need it.

### Baseline vs Pass One vs Pass Two

| Metric | Baseline | Pass One | Pass Two |
|---|---:|---:|---:|
| Performance | 55 | 89 | 98 |
| Accessibility | 100 | 95 | 100 |
| Best Practices | 75 | 96 | 100 |
| SEO | 100 | 100 | 100 |
| First Contentful Paint | 1.16s | 1.09s | 0.97s |
| Largest Contentful Paint | 12.82s | 3.63s | 2.10s |
| Total Blocking Time | 748ms | 132ms | 132ms |
| Cumulative Layout Shift | 0.081 | 0.000 | 0.000 |
| Time to Interactive | 16.18s | 11.60s | 9.44s |

### Outcome

This confirms that the main bottleneck was the homepage’s eager client-side runtime, especially globally mounted wallet and auth infrastructure. After the second pass, the live site is now operating in the high-performance range while keeping the existing public narrative intact.

## Generated Artifacts

- Raw HTML report: docs/lighthouse/buildwithai-audit.report.html
- Raw JSON report: docs/lighthouse/buildwithai-audit.report.json
- Pass one JSON report: docs/lighthouse/buildwithai-audit-after-fix
- Pass two JSON report: docs/lighthouse/buildwithai-audit-pass2
