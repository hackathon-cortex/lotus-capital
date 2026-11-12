# Contact Drawer — Replaced standalone `/contact-us` page

> **Implementation Note**: The standalone `/contact-us` route has been retired and replaced by a global, accessible `ContactDrawer` mounted in the layout and opened from all CTAs, header buttons, footer links, and the client-side redirect `/contact-us` -> `/?contact=open`. This file serves as the authoritative content source for the `ContactDrawer`.

## Purpose
Make it easy to contact Lotus Capital and route each enquiry to the right service directly within the user's browsing flow via an accessible slide-over drawer.

## Headline
**Tell us what you would like to explore.**

## Intro
Share a few details and the Lotus Capital team will follow up to clarify the service you need and explain the next steps.

## Contact details (client-supplied, verify before publishing)
| Item | Detail |
|---|---|
| Phone | +91 93288 52555 |
| Email | lotuscapitalinfo@gmail.com |
| Address | Shri Chudasama Bhuvan, M.G. Road, Near Police Chowki No. 1, Godhra 389001, Panchmahals, Gujarat |
| Social handle | `lotuscapital.investments` (platform to confirm) |
| WhatsApp | Enable the button only after the client confirms the official number |

Add business hours when supplied. Consider a domain email (for example info@lotuscapital.org) for credibility.

## Map
Embedded map and directions to the office.

## Enquiry form
| Field | Required |
|---|---|
| Full name | Yes |
| Mobile number (10-digit Indian number) | Yes |
| Email | No |
| Service | Yes (preselected from `?service=`) |
| Message | No |
| Preferred contact method (phone, WhatsApp, email) | No |
| Privacy notice acceptance | Yes |

Record the source page and approved UTM parameters. Do not ask for PAN, Aadhaar, demat credentials, passwords, OTPs or detailed financial records.

## Parameters
`?service=<slug>` preselects the service. `utm_source`, `utm_medium`, `utm_campaign` are stored with the lead.

## Confirmation
After a successful API response, go to `/enquiry/thank-you?ref=<enquiry_id>`. The reference ID is random and carries no personal data.

## Footer
Global footer disclaimer.

## SEO
- **Title:** Contact Us | Lotus Capital, Godhra
- **Description:** Contact Lotus Capital in Godhra, Gujarat for insurance, mutual funds and equity services.
