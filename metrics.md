# Metrics

## North Star metric

**Number of audits that surface >$500/month in potential savings.**  
This directly feeds the consultation pipeline and is the strongest leading indicator of future credit purchases, because only high‑savings cases convert to booked consultations.

## 3 input metrics that drive the North Star

1. **Audits completed per week** - top‑of‑funnel volume.
2. **% of audits with >$500 savings** - engine effectiveness and user profile fit.
3. **Lead capture rate** - how many users leave an email after seeing their results.

## What I'd instrument first

- Custom events in the audit flow: `audit_completed`, `lead_captured`, `share_clicked`.
- Track the `totalMonthlySavings` for each audit to segment users.
- Monitor API latency for the audit endpoint and AI summary.

## What number triggers a pivot decision

If, after 30 days, the percentage of audits with >$500 savings falls below 15%, I'd pivot:

- Add more tools and more aggressive credit‑based recommendations.
- Re‑examine the target audience - maybe the tool attracts enterprises with custom pricing, not startups.
- If the volume is high but the savings are negligible, the tool becomes a content/SEO asset rather than a direct lead‑gen engine, and the consultation ask would be removed.
