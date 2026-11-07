# Lotus Capital — Client Data & Compliance Register

## Business Identity
- **Entity Name**: Lotus Capital
- **Operating Location**: Godhra, Gujarat, India
- **Core Industry**: Financial Services & Advisory Distribution
- **Offered Services**:
  - Mutual Funds (AMFI Registered Distributor workflow)
  - Health Insurance
  - Life Insurance
  - Retirement Planning
  - Tax Planning & Advisory Support
  - Wealth & Portfolio Guidance

## Regulatory & Compliance Principles
1. **Regulatory Disclaimers**:
   - Mutual fund investments are subject to market risks; read all scheme related documents carefully.
   - No guaranteed or assured returns shall ever be represented or marketed.
   - Distributor disclosures must remain transparent and strictly follow SEBI and AMFI guidelines.
2. **Data Minimization & Privacy Protection**:
   - Public enquiry forms strictly collect: Name, 10-digit Indian Mobile Number, Optional Email, Preferred Contact Method, Service Slugs, and Optional Enquiry Message with mandatory consent.
   - **STRICT PROHIBITION**: Never collect PAN, Aadhaar numbers, net-banking passwords, UPI PINs, OTPs, or sensitive financial bank credentials.
3. **Statistical Claim Tiers**:
   - **Tier A (Public Approved Statistics)**: Fully verified metrics. Visible to the public ONLY when `approval_status == 'approved'` and a valid `as_of_date` is defined.
   - **Tier B (Pending / Client-Confirmed Statistics)**: Under compliance review. Requires explicit client confirmation and documented methodology before publication.
   - **Tier C (Restricted / Withheld Metrics)**: Proprietary or sensitive claims (e.g., Equity CAGR claims). **STRICT COMPLIANCE REQUIREMENT**: Never expose Tier C publicly or in public API responses under any circumstances.
