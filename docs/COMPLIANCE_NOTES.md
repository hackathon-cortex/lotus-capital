# Lotus Capital Regulatory Compliance & DPDP Act Notes

**Jurisdiction:** Republic of India  
**Applicable Regulators & Legislation:**  
1. **DPDP Act (Digital Personal Data Protection Act, 2023)**
2. **SEBI (Securities and Exchange Board of India)** Regulations for Mutual Fund Distributors & Investment Advisers
3. **IRDAI (Insurance Regulatory and Development Authority of India)** Regulations for Corporate Agents & Point of Sales Persons

---

## 1. Digital Personal Data Protection Act (DPDP) 2023 Compliance

### 1.1 Lawful Purpose & Explicit Consent
- **Opt-in Checkbox:** Every enquiry form interaction requires an active, un-checked consent checkbox confirming the user's explicit request to be contacted by Lotus Capital.
- **Form Consent Text:** *"I authorise Lotus Capital to contact me via phone, WhatsApp, or email regarding this enquiry. I understand I can withdraw consent at any time."*
- **Audit Trails:** Submissions log timestamp, consent boolean, user agent, and a SHA-256 hashed IP address. Raw IP addresses are discarded at the gateway level to minimize unnecessary data processing.

### 1.2 Purpose Limitation & Data Minimisation
- Only data strictly necessary for advising on financial products is collected: Full Name, 10-digit Indian Mobile Number, optional Email, selected Service, and Service Sub-category Chips.
- **Strict Prohibition:** Under no circumstances are PAN numbers, Aadhaar numbers, net worth figures, demat account numbers, passwords, or OTPs collected or stored in enquiry forms or backend databases.
- **Hospital Variant Fields:** For healthcare facilities requesting assistance with ROHINI registration and cashless empanelment, three non-sensitive institutional fields are collected: `organisation_name`, `city`, and optional `existing_rohini_id` (13 digits).

### 1.3 Data Erasure & Cascade Anonymization (`anonymize_entity`)
- When a lead is deleted in the admin interface (e.g., following a withdrawal of consent or data subject deletion request):
  1. The enquiry record is hard-deleted from active storage.
  2. Any references in system audit logs are pseudonymized via `anonymize_entity()`.
  3. Customer names, phones, and emails in historical audit traces are replaced with cryptographically random hashes or redacted tokens (`[ANONYMIZED_USER]`).

### 1.4 PII Masking in Structured Logs
- The backend application logs in structured JSON format.
- Automatic logging filters mask phone numbers (e.g., `9876543210` -> `XXXXXX3210`) and email addresses (e.g., `user@domain.com` -> `u***@domain.com`) prior to output.

---

## 2. SEBI Compliance & Investment Governance

### 2.1 Statutory Mutual Fund Disclaimers
- All mutual funds materials, pages (`/services/mutual-funds`), and calculation tools feature the mandatory statutory warning:
  > *"Mutual fund investments are subject to market risks, read all scheme related documents carefully."*
- Past performance is explicitly stated as not indicative of future returns.

### 2.2 Tier C Statistics Gating Policy
- **Gating Rule:** Tier C forward-looking or un-benchmarked performance claims (specifically `equity_cagr`) must **NEVER** render on public pages or customer-facing marketing decks.
- **Implementation:** Both frontend components (`StatBlock.tsx`) and backend schema filters strictly gate out `equity_cagr` from being returned or rendered. Only verified operational metrics (Tier A/B, e.g., active clients, years of service) are surfaced.

---

## 3. IRDAI Compliance & Insurance Governance

### 3.1 Insurance Solicitation Notice
- All general insurance (`/services/general-insurance`), health insurance (`/services/health-insurance`), and life insurance materials feature the mandatory IRDAI solicitation statement:
  > *"Insurance is the subject matter of solicitation."*
- Travel insurance copy is presented neutrally without invented claims, figures, turnaround guarantees, or specific insurer endorsements.

### 3.2 ROHINI & Cashless Empanelment Governance (B2B Disclosures)
- **Official Status:** ROHINI is maintained by the Insurance Information Bureau of India (IIB), promoted by IRDAI.
- **Disclaimers on `/services/rohini-cashless-empanelment`:**
  - Lotus Capital is an independent financial consulting firm and does not represent IIB, IRDAI, or any specific insurer/TPA.
  - Empanelment into cashless networks is solely at the independent discretion of each insurer and Third Party Administrator (TPA).
  - Lotus Capital does not guarantee ID allocation, empanelment approval, or regulatory turnaround times.
  - Regulatory registration fees (if any) are paid directly to IIB.

