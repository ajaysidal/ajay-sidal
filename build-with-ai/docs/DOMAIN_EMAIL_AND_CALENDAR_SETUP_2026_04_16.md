# Domain Email and Calendar Setup — BuildWithAI.digital

## What is now implemented in the app
- role-based domain identities are assigned in the Command Center
- investor and sales outreach can be sent or drafted through the outreach API
- calendar invites can be generated as ICS files for founder walkthroughs
- all activity is queued for future MARZ automation workflows

## Assigned communication identities
- ajay@buildwithai.digital
- investors@buildwithai.digital
- hello@buildwithai.digital
- calendar@buildwithai.digital
- ops@buildwithai.digital

## Credentials still required for live external activation
- OPENPROVIDER_USERNAME
- OPENPROVIDER_PASSWORD
- RESEND_API_KEY or SMTP credentials
- GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for calendar-linked auth

## Recommended open-source-friendly stack
- Nodemailer for outbound mail transport fallback
- ICS calendar invites for universal meeting compatibility
- Cal.com as the future self-hosted booking layer
- BullMQ plus Redis for async MARZ automation execution

## Current live status
- OpenProvider API access is working for the buildwithai.digital DNS zone
- MX and DKIM-related DNS records are already present in the live zone
- outbound outreach is now live through the app using the local sendmail transport, with safe draft fallback still available if needed
- ICS calendar invites and Google Calendar links are generating successfully for founder walkthroughs

## Recommended next external activation order
1. verify the buildwithai.digital sending domain with the outbound mail provider
2. add or confirm SPF and DMARC policy records for deliverability hardening
3. activate the calendar and booking link workflow
4. connect human-approved MARZ follow-up automation
5. promote the communications stack to production review
