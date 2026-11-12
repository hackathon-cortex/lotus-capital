import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Mutual Funds (v2) Compliance & Refinement Rules', () => {
  const mfPagePath = path.resolve(__dirname, '../src/pages/public/MutualFunds.tsx');
  const mfHeroPath = path.resolve(__dirname, '../src/components/investments/MfHeroSchemeCard.tsx');
  const sipBoardPath = path.resolve(__dirname, '../src/components/investments/SipIllustrationBoard.tsx');
  const comparePath = path.resolve(__dirname, '../src/components/investments/MfCompareSection.tsx');
  const explorerPath = path.resolve(__dirname, '../src/components/investments/FundCategoryExplorer.tsx');
  const waysPath = path.resolve(__dirname, '../src/components/investments/WaysToInvestGrid.tsx');
  const registrationsPath = path.resolve(__dirname, '../../content/data/registrations.json');
  const faqsPath = path.resolve(__dirname, '../../content/data/faqs.json');
  const servicesPath = path.resolve(__dirname, '../../content/data/services.json');

  const mfContent = fs.readFileSync(mfPagePath, 'utf8');
  const sipContent = fs.readFileSync(sipBoardPath, 'utf8');
  const heroContent = fs.readFileSync(mfHeroPath, 'utf8');
  const compareContent = fs.readFileSync(comparePath, 'utf8');
  const explorerContent = fs.readFileSync(explorerPath, 'utf8');
  const waysContent = fs.readFileSync(waysPath, 'utf8');
  const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
  const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

  const allMfComponents = [
    mfContent,
    sipContent,
    heroContent,
    compareContent,
    explorerContent,
    waysContent,
  ].join('\n');

  it('contains ONLY ONE SIP illustration calculator', () => {
    // Confirm old duplicate SipCalculator is NOT imported
    expect(mfContent.includes("from '../../components/calculators/SipCalculator'")).toBe(false);
    expect(mfContent.includes('<SipCalculator')).toBe(false);

    // Confirm SipIllustrationBoard is used once with id="sip-calculator"
    const sipMatches = mfContent.match(/<SipIllustrationBoard/g) || [];
    expect(sipMatches.length).toBe(1);
    expect(mfContent).toContain('id="sip-calculator"');
    expect(sipContent).toContain('data-testid={id}');
  });

  it('stores EUIN and validityDate with verified: false in registrations.json', () => {
    const amfi = registrations.find((r: any) => r.id === 'amfi_mfd');
    expect(amfi).toBeDefined();
    expect(amfi.number).toBe('ARN-160174');
    expect(amfi.euin).toBe('E303534');
    expect(amfi.validityDate).toBe('03-Oct-2027');
    expect(amfi.verified).toBe(false);
  });

  it('does NOT render unverified EUIN or validityDate on public Mutual Funds page', () => {
    // The public page must gate EUIN rendering behind verified: true
    expect(mfContent).toContain('(amfiReg as any)?.verified === true');
    // Ensure hardcoded EUIN / validity date strings do not appear in the page markup
    expect(mfContent).not.toContain('EUIN: E303534');
    expect(mfContent).not.toContain('03-Oct-2027');
  });

  it('has royal blue theme in services.json for mutual-funds without green gains', () => {
    const mfService = services.find((s: any) => s.slug === 'mutual-funds');
    expect(mfService).toBeDefined();
    expect(mfService.theme.accent).toBe('#2F6FB0');
    expect(mfService.theme.secondaryAccent).toBe('#123D67');
    expect(mfService.theme.silverBlue).toBe('#5B8DB8');

    // No green colors in theme
    expect(mfService.theme.accent).not.toBe('#059669');
    expect(mfService.theme.highlight).not.toBe('#10B981');
  });

  it('contains NO green return/gain colouring across mutual funds components', () => {
    const forbiddenGreenHexes = ['#38a169', '#10b981', '#059669', '#22c55e', '#16a34a'];
    const lowerAll = allMfComponents.toLowerCase();

    forbiddenGreenHexes.forEach((hex) => {
      expect(
        lowerAll.includes(hex),
        `Found forbidden green return color ${hex} in Mutual Funds components.`
      ).toBe(false);
    });
  });

  it('never renders equity_cagr (23%) on Mutual Funds page', () => {
    expect(allMfComponents.includes('equity_cagr')).toBe(false);
    expect(allMfComponents.includes('23%')).toBe(false);
  });

  it('contains exactly 8 educational FAQs for mutual-funds without return numbers', () => {
    const mfFaqs = faqs.filter((f: any) => f.page === 'mutual-funds');
    expect(mfFaqs.length).toBe(8);

    const questions = mfFaqs.map((f: any) => f.question.toLowerCase());
    expect(questions.some((q: string) => q.includes('nav'))).toBe(true);
    expect(questions.some((q: string) => q.includes('direct and regular') || q.includes('direct vs regular'))).toBe(true);
    expect(questions.some((q: string) => q.includes('expense ratio'))).toBe(true);
    expect(questions.some((q: string) => q.includes('risks'))).toBe(true);
    expect(questions.some((q: string) => q.includes('sip') && q.includes('lump-sum'))).toBe(true);
    expect(questions.some((q: string) => q.includes('taxation'))).toBe(true);
    expect(questions.some((q: string) => q.includes('redemption'))).toBe(true);
    expect(questions.some((q: string) => q.includes('start') || q.includes('begin'))).toBe(true);
  });

  it('contains the mandatory mutual fund risk disclosure', () => {
    expect(mfContent).toContain('Mandatory Mutual Fund Disclosure');
    expect(mfContent).toContain('disclaimersData.mutual_fund_risk');
  });

  it('removes unsupported promotional promises', () => {
    const bannedPhrases = [
      'annual reviews in godhra',
      'operational service in godhra',
      'sips remove emotional market timing',
      'best suited for investment horizons of 5+ years',
      'suited for short to medium-term horizons',
    ];
    const lowerAll = allMfComponents.toLowerCase();

    bannedPhrases.forEach((phrase) => {
      expect(
        lowerAll.includes(phrase),
        `Found banned promotional phrase "${phrase}" in Mutual Funds components.`
      ).toBe(false);
    });
  });
});

