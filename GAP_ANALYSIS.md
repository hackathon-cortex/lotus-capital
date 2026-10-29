# Lotus Capital — Comprehensive Gap Analysis & Verification Register

**Document Version:** 1.0  
**Date:** October 2026  
**Purpose:** Exhaustive audit of missing assets, unverified financial figures, client decisions, and documentation discrepancies before production release.  
**Companion Documents:** `00-client-data-register.md`, `19-content-approval-checklist.md`, `REFERENCE_ANALYSIS.md`, `DESIGN_SYSTEM.md`

---

## 1. Missing Assets Matrix

| Asset Category | Required Asset | Target Route / Component | Current Status in Workspace | Action Required |
|---|---|---|---|---|
| **Photography** | Homepage Hero Landscape Photograph (Natural light, authentic Godhra family or advisor with clients, min 2400×1350 WebP/AVIF with 4:5 portrait crop) | `/` (Hero Section) | **Missing** (Styled dark navy gradient canvas used as fallback) | Client to provide authentic, professional photography. Avoid generic stock photos. |
| **Photography** | Leadership Portrait: Kajal Abhilash Chudasama (High-resolution professional headshot) | `/about-us` (Leadership Split) | **Missing** (Placeholder frame) | Client to provide professional portrait matching tone of proprietor portrait. |
| **Photography** | Leadership Portrait: Abhilash Dineshchandra Chudasama | `/about-us`, `/` (About Preview) | **Staged (`Owner.png`)** | Client written approval of staged portrait required. |
| **Brand Assets** | High-resolution Vector SVG Logo variants (Light reversed for navy, Dark full-color for white, Standalone Lotus mark for favicon) | Global Header, Footer, Admin, Favicon | **Staged (`lotus_capital_logo_traced.svg`)** | Verify vector fidelity and generate production favicon packages. |
| **Partner Logos** | Verified Insurer Logos (Care Health, ICICI Lombard, HDFC Ergo, Bajaj Allianz, Bharti AXA Life, HDFC Life, ICICI Prudential, LIC) | `/services/*`, `/about-us`, `/` (Partner Strip) | **Missing** (Text-based partner badges used) | Provide official vector SVG logos with written trademark usage authorization. |
| **Partner Logos** | Broking Partner Logo: Religare Broking Limited | `/investments/equity`, Footer | **Missing** (Text label used) | Provide official logo and verify Authorised Person co-branding guidelines. |
| **Certificates** | Scanned registration certificates (AMFI, NSE/BSE AP, IRDAI, NPS) | Internal Compliance Archive & Admin Portal | **Missing** | Maintain internal compliance repository for audit defense. |

---

## 2. Unverified Financial Figures & Statistics Register

All statistics are strictly governed by `00-client-data-register.md`. No figure may be rendered publicly without an explicit `as_of_date` and `approvalStatus = 'approved'`.

### 2.1 Tier A Figures (Displayable once an As-of Date is confirmed)
| Metric ID | Client Figure | Label | Target Pages | Blocking Question / Action |
|---|---|---|---|---|
| `clients_serviced` | 2,500+ | Total clients serviced | Home, About, Services | Confirm exact date (e.g. "As of September 30, 2026"). |
| `mf_folios` | 1,200+ | Mutual fund folios | Home, Services, Mutual Funds | Confirm as-of date from AMFI / RTA statements (CAMS / KFintech). |
| `demat_accounts` | 800+ | Equity demat accounts | Home, Services, Equity | Confirm as-of date from Religare Broking AP portal. |
| `health_policies` | 250+ | Health insurance policies | Services, Health Insurance | Confirm as-of date and active policy status. |
| `life_policies` | 180+ | Life insurance policies | Services, Life Insurance | Confirm as-of date and active policy status. |
| `motor_policies` | 140+ | Motor insurance policies | Services, General Insurance | Confirm as-of date. |
| `insurance_policies_total` | 570+ | Total insurance policies (derived: 250+180+140) | Home, Services | Confirm derived total and wording: "health, life and motor policies". |

### 2.2 Tier B Figures (Displayable only after client clarifies definition)
| Metric ID | Client Figure | Display Text | Critical Clarification Required |
|---|---|---|---|
| `aum_total` | 50 Crore+ | ₹50 crore+ assets across segments | **Definition Ambiguity:** Which segments are included (Mutual Funds, Equity, FDs, Real Estate)? Is this market value or cumulative invested amount? Is "AUM" permissible under AMFI distributor guidelines (which distinguish distributor AUM from RIA AUM)? |
| `fd_aum` | 50 Lakh+ | ₹50 lakh+ in corporate fixed deposits | Is this figure already included in the ₹50 crore+ total? Which corporate issuers? Current outstanding or cumulative placed? |
| `real_estate_properties` | 30+ | 30+ properties brokered in Vadodara & Ahmedabad | Sales, rentals, or both? Over what time period? Subject to RERA verification below. |
| `real_estate_rent` | 15 Lakh+ | ₹15 lakh+ monthly rent credited to clients | Total across how many properties and clients? Collected by Lotus Capital or paid directly by tenants to owners? |

### 2.3 Tier C Figures (Strictly Withheld from Public View)
| Metric ID | Client Figure | Strict Regulatory Condition | Enforcement in Codebase |
|---|---|---|---|
| `equity_cagr` | Approx. 23% CAGR | **SEBI Compliance Prohibition:** Requires written audited methodology, start and end dates, full client portfolio composite (not cherry-picked winners), benchmark comparison, net of fees and taxes, and compliance confirmation that an Authorised Person may publish advisory performance. | **Hard-coded exclusion.** Status set to `withheld`. Will never render in UI even if developer toggle is enabled. |

---

## 3. Regulatory Registrations & Licencing Gaps

The site must never use misleading generalities like "SEBI-registered" or "RERA-registered". Every registration must state the exact legal holder and licensed capacity.

| Registration Area | Number / Code | Holder Named | Recommended Compliant Wording | Verification Gap |
|---|---|---|---|---|
| **AMFI (Mutual Funds)** | `ARN-160174` | Abhilash Chudasama (Individual) | *"Abhilash Chudasama is an AMFI-registered Mutual Fund Distributor (ARN-160174)."* | Confirm ARN validity expiry date and whether firm possesses a corporate ARN or individual EUIN. |
| **NSE (Equity)** | `AP007909931` | Lotus Capital | *"Lotus Capital is an Authorised Person of Religare Broking Limited (NSE AP registration AP007909931)."* | Confirm Religare Broking Limited's primary SEBI broker registration number to display alongside. |
| **BSE (Equity)** | `AP0130040172963` | Lotus Capital | *"Lotus Capital is an Authorised Person of Religare Broking Limited (BSE AP registration AP0130040172963)."* | Same as above. |
| **IRDAI (Health)** | `RLH20126535` | Lotus Capital / Abhilash Chudasama | *"Care Health Insurance — Agent/POSP code RLH20126535"* | Confirmed by client: RLH code belongs to Care Health Insurance. |
| **IRDAI (Life/General)** | `HDF01032560` | Lotus Capital / Abhilash Chudasama | *"HDFC — Agent/POSP code HDF01032560"* | Confirmed by client: HDF code belongs to HDFC. |
| **IRDAI (Life)** | `LIC03693848` | Lotus Capital / Abhilash Chudasama | *"Life Insurance Corporation of India (LIC) — Agent code LIC03693848"* | Confirmed by client: LIC code belongs to LIC. |
| **Code 3248307** | *Removed* | N/A | *Removed per client instruction* | Permanently removed from website and registrations register. |
| **NPS (PFRDA)** | `POSP 4199` | Religare Broking Ltd | *"NPS services are offered through Religare Broking Limited (registration 4199)."* | Confirm exact PFRDA role terminology and sub-broker relationship. |
| **RERA Gujarat** | Under Process | Lotus Capital | *"RERA registration under process."* | **Compliance Decision:** Determine whether real estate brokerage may be promoted publicly prior to active RERA licence issuance. Default: hide via feature flag `SHOW_REAL_ESTATE=false`. |

---

## 4. Documentation Conflicts & Resolution

| Conflict # | Item | Document A | Document B | Resolution / Decision |
|---|---|---|---|---|
| **Conflict 1** | Total Clients Serviced | Earlier Welcome Letter: `2,000+` | Latest `Required_Data.docx`: `2,500+` | Adopt **2,500+** as the latest official figure in `statistics.json`, subject to client confirming the as-of date. |
| **Conflict 2** | Reference 6 vs Reference 7 Visuals | PDF Page 8 states Reference 6 is "Reference image to be added", and Page 9 shows the green financial dashboard under Reference 7. | `Design.md` Section 2 states the dashboard image was reassigned to guide the Mutual Funds illustration board, while admin uses our proposed layout. | Adopt the `Design.md` resolution: The dashboard aesthetic (large figure, action cards, growth chart, goal bars) inspires the **Mutual Funds illustration board**, while the **Admin Portal** uses our proposed high-density layout. |
| **Conflict 3** | Backend Stack Specification | `Design.md` & `Structure.md` note FastAPI + PostgreSQL; `ARCHITECTURE_RECOMMENDATION.md` initially evaluated Supabase. | User directive: *"Use FastAPI with Postgres, not Supabase."* | Adopt **FastAPI + PostgreSQL** across all specifications, schemas, and implementation plans. |
| **Conflict 4** | Real Estate Advisory Visibility | `09-other-solutions.md` includes Real Estate Advisory section. | `00-client-data-register.md` notes RERA registration is "under process". | Controlled via feature flag `SHOW_REAL_ESTATE=false`. Real estate section remains completely hidden on `/investments/other-solutions` until RERA certificate is active. |

---

## 5. Client Decisions & Approvals Status

1. **Official Entity Name:** Confirmed as *Lotus Capital* (Proprietorship: Abhilash Dineshchandra Chudasama).
2. **Official Communications Channels (Item 3):** **CONFIRMED.** Phone: `+91 93288 52555`, WhatsApp Business: `+91 93288 52555` (Floating button enabled), Email: `lotuscapitalinfo@gmail.com`, Address: `Shri Chudasama Bhuvan, M.G. Road, Near Police Chowki No. 1, Godhra 389001, Gujarat`.
3. **Tier A Statistics (Item 1):** **CONFIRMED BY CLIENT.** (`2,500+` clients, `1,200+` folios, `800+` demat accounts, `570+` insurance policies). Pending exact date stamp confirmation (e.g. `September 30, 2026` or `October 2026`).
4. **IRDAI Insurer Codes (Item 2):** **CONFIRMED BY CLIENT.**
   - `RLH20126535`: Care Health Insurance
   - `HDF01032560`: HDFC
   - `LIC03693848`: Life Insurance Corporation of India (LIC)
   - `3248307`: **Removed** completely per client instruction.
5. **Real Estate Promotion / RERA (Item 4):** **AWAITING CLIENT RESPONSE.** Query submitted to client. Protected by default with `SHOW_REAL_ESTATE=false` (hidden on public site).

