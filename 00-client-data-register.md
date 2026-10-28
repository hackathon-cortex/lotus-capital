# Client Data Register — Statistics, Registrations & Disclaimer

**Source:** `Required_Data.docx` (client-supplied) plus earlier client material (welcome letter, About Us text).
**Status:** Client-supplied figures. Every item below needs an **as-of date** and written client confirmation before it goes live. Items are grouped by what must be confirmed.

This file is the single source of truth. Page files refer to it; do not type numbers into a page from memory.

---

## 1. Statistics register

### Tier A — display once an as-of date is confirmed

| ID | Label | Client figure | Display text | Pages |
|---|---|---|---|---|
| `clients_serviced` | Total clients serviced | 2500+ | **2,500+** clients serviced | Home, About, Services |
| `mf_folios` | Mutual fund folios | 1200+ | **1,200+** mutual fund folios | Home, Services, Mutual Funds |
| `demat_accounts` | Equity demat accounts | 800+ | **800+** demat accounts | Home, Services, Equity |
| `health_policies` | Health insurance policies | 250+ | **250+** health insurance policies | Services, Health Insurance |
| `life_policies` | Life insurance policies | 180+ | **180+** life insurance policies | Services, Life Insurance |
| `motor_policies` | Motor insurance policies | 140+ | **140+** motor insurance policies | Services, General Insurance |
| `insurance_policies_total` | Insurance policies (derived) | 250 + 180 + 140 | **570+** insurance policies (health, life and motor) | Home, Services |

`insurance_policies_total` is calculated by us from the three client figures. It excludes any other insurance lines, so label it "health, life and motor" and confirm it with the client.

### Tier B — display only after the client confirms the definition

| ID | Label | Client figure | Display text | Question to answer first |
|---|---|---|---|---|
| `aum_total` | Assets under management, all segments | 50 Crore+ | **₹50 crore+** assets across segments | Which segments and assets are included? Is "AUM" the right term? Is it market value or invested amount? |
| `fd_aum` | Fixed deposits across corporates | 50 Lakh+ | **₹50 lakh+** in fixed deposits across corporate issuers | Is this part of the ₹50 crore+ total? Which issuers? Current outstanding or total placed? |
| `real_estate_properties` | Properties brokered | 30+ (Vadodara & Ahmedabad) | **30+** properties brokered in Vadodara and Ahmedabad | Sales, rentals or both? Over what period? See RERA note in section 2. |
| `real_estate_rent` | Monthly rental credited to clients | 15 Lakh+ | **₹15 lakh+** monthly rent credited to clients | Total across how many properties and clients? Is the amount collected by Lotus Capital or paid directly? |

### Tier C — do not display until compliance approval

| ID | Label | Client figure | Conditions before display |
|---|---|---|---|
| `equity_cagr` | Historical returns through advisory, equity | Approx. 23% CAGR | Written methodology; start and end dates; actual client portfolios or model; which recommendations are included (all, not selected ones); benchmark; costs and taxes treatment; supporting records; compliance confirmation that Lotus Capital may publish advisory performance. If any item is missing, **omit the figure entirely.** |

### CMS record for every statistic

Each statistic is stored with: `id`, `label`, `value`, `display_text`, `unit`, `as_of_date`, `definition_note`, `source_document`, `approval_status` (`pending`, `approved`, `withdrawn`), `approved_by`, `approved_on`, `pages`.

A statistic with `approval_status` other than `approved`, or without an `as_of_date`, must not render on the public site.

### Display rules for all statistics
1. Show the as-of date beside or below the figures: "As of [date]".
2. Use "+" exactly as supplied. Do not round up or convert.
3. Never describe client counts as active investors unless the client confirms they are.
4. Never state or imply that any figure predicts future results.
5. Update at an agreed frequency and record who approved each update.

---

## 2. Registrations and licences register

The client listed these as "licences". They are different kinds of registration held by different parties. **Wording on the site must name the holder and the role exactly.**

| Client entry | Number | Holder | Recommended wording (after verification) | Verify before publishing |
|---|---|---|---|---|
| AMFI | `ARN-160174` | Abhilash Chudasama (individual) | "Abhilash Chudasama is an AMFI-registered Mutual Fund Distributor (ARN-160174)." | Validity date; whether the firm has its own ARN; EUIN, if applicable |
| "SEBI – NSE" | `AP007909931` | Lotus Capital | "Lotus Capital is an Authorised Person of Religare Broking Limited (NSE AP registration AP007909931)." | Exact registration type; Religare Broking Ltd's SEBI broker registration number (usually required alongside); validity |
| "SEBI – BSE" | `AP0130040172963` | Lotus Capital | "Lotus Capital is an Authorised Person of Religare Broking Limited (BSE AP registration AP0130040172963)." | As above |
| "IRDA" (correct name: IRDAI) | `RLH20126535`, `HDF01032560`, `LIC03693848`, `3248307` | To be confirmed (firm or individual) | One line per insurer, for example "[Insurer name] — agent/POSP code [code]" | Which insurer each code belongs to; whether each is held by the firm or by an individual; validity. The last code (`3248307`) has no prefix, so its insurer is unknown. |
| NPS | `POSP 4199` | Religare Broking Ltd | "NPS services are offered through Religare Broking Limited (registration 4199)." | The exact PFRDA role name; whether Lotus Capital is an authorised person or sub-agent under Religare |
| RERA Gujarat | Under process | Lotus Capital | Do **not** say "RERA registered". If shown at all: "RERA registration under process." | Registration status and date. Compliance to decide whether real-estate brokerage may be promoted before registration. |

Rules:
- Do not call Lotus Capital a "SEBI-registered investment adviser", "SEBI-registered broker" or "IRDAI-registered insurance company". None of the supplied numbers say this.
- Do not list a code without saying who holds it and what it permits.
- Do not publish an expired registration.

---

## 3. Other client-supplied facts (earlier material, to verify)

| Fact | Source | Note |
|---|---|---|
| Established 2006; AMFI mutual fund distributor since 2006 | Welcome letter | Needs evidence (certificate, first registration) |
| Business partner of Religare Broking Limited since 2008 | Welcome letter | Confirm current agreement |
| Associated with Care Health Insurance since 2012 | Welcome letter | Confirm current status |
| Insurers named: ICICI Lombard, HDFC Ergo, Bajaj Allianz (general); Bharti AXA Life, HDFC Life, ICICI Prudential, LIC (life) | Welcome letter | Confirm each relationship and logo permission |
| Real estate services in Vadodara and Ahmedabad since 2016 | Welcome letter | Subject to RERA decision above |
| Awards 2008–2021 | Welcome letter | See About Us page; certificates needed |
| Social handle `lotuscapital.investments` | Contact notes | Platform not stated |

### Differences between client documents

| Item | Earlier document | Latest document | Use |
|---|---|---|---|
| Clients | 2,000+ (welcome letter) | 2,500+ (Required Data) | **2,500+**, once an as-of date is given |

---

## 4. Footer disclaimer (every public page)

Client instruction: **"Disclaimer at the bottom of the webpage."** Place this text in the global footer so it appears on every public page:

> Mutual fund investments are subject to market risks, read all scheme related documents carefully. The Net Asset Value (NAV) of schemes can go up or down based on market forces and interest rate changes. Past performance does not guarantee future results, and dividends or payouts depend on distributable surplus availability. Investors must read the Key Information Memorandum (KIM), Scheme Information Document (SID), and Statement of Additional Information (SAI) before investing.

Implementation notes:
- Store it as one CMS value (`footer_disclaimer`) so there is one place to edit.
- Keep it readable: not smaller than body-footer text, adequate contrast, not hidden in a collapsed section.
- The full disclosures page (`/disclosures`) repeats it and adds the other disclosures. See `16-disclosures.md`.
- Compliance reviewer confirms the wording is current before launch.
