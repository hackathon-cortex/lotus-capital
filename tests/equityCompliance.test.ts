import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Equity & Investments (v2) Compliance & Refinement Rules', () => {
  const equityPagePath = path.resolve(__dirname, '../src/pages/public/Equity.tsx');
  const marketBoardPath = path.resolve(__dirname, '../src/components/investments/EquityMarketBoard.tsx');
  const brokingFramePath = path.resolve(__dirname, '../src/components/investments/BrokingPartnerFrame.tsx');
  const servicesStagePath = path.resolve(__dirname, '../src/components/investments/EquityServicesStage.tsx');
  const journeyPath = path.resolve(__dirname, '../src/components/investments/EquityAccountJourney.tsx');
  const faqsPath = path.resolve(__dirname, '../content/data/faqs.json');
  const servicesPath = path.resolve(__dirname, '../content/data/services.json');

  const equityContent = fs.readFileSync(equityPagePath, 'utf8');
  const marketBoardContent = fs.readFileSync(marketBoardPath, 'utf8');
  const brokingContent = fs.readFileSync(brokingFramePath, 'utf8');
  const servicesStageContent = fs.readFileSync(servicesStagePath, 'utf8');
  const journeyContent = fs.readFileSync(journeyPath, 'utf8');
  const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

  const allEquityComponents = [
    equityContent,
    marketBoardContent,
    brokingContent,
    servicesStageContent,
    journeyContent,
  ].join('\n');

  it('never renders equity_cagr (23%) on Equity page or components', () => {
    expect(allEquityComponents.includes('equity_cagr')).toBe(false);
    expect(allEquityComponents.includes('23%')).toBe(false);
  });

  it('never describes Lotus Capital as "SEBI-registered" or "SEBI registered"', () => {
    // Lotus Capital must only be described as Authorised Person of Religare Broking Limited
    expect(allEquityComponents.toLowerCase()).not.toContain('sebi registered authorised person');
    expect(allEquityComponents.toLowerCase()).not.toContain('sebi-registered authorised person');
    expect(allEquityComponents.toLowerCase()).not.toContain('lotus capital is a sebi-registered');
    expect(allEquityComponents.toLowerCase()).not.toContain('lotus capital is sebi registered');
  });

  it('removes forbidden phrases from broking section and services', () => {
    const lowerAll = allEquityComponents.toLowerCase();
    expect(lowerAll).not.toContain('institutional broking partner');
    expect(lowerAll).not.toContain('duly appointed');
    expect(lowerAll).not.toContain('modern trading platforms');
    expect(lowerAll).not.toContain('surrounding districts');
    expect(lowerAll).not.toContain('paperless kyc');
    expect(lowerAll).not.toContain('long-term compounding');
    expect(lowerAll).not.toContain('voting rights');
  });

  it('uses "AUTHORISED PERSON" label and correct AP codes for NSE and BSE', () => {
    expect(brokingContent).toContain('AUTHORISED PERSON');
    expect(brokingContent).toContain('AP007909931');
    expect(brokingContent).toContain('AP0130040172963');
    expect(brokingContent).toContain('Partner since 2008');
  });

  it('gates Religare SEBI broker registration number behind verified: true', () => {
    // Only renders if registrations.json has verified: true
    expect(brokingContent).toContain('r.verified === true');
    // Since registrations.json does not have verified: true, no hardcoded number exists in public markup
    expect(brokingContent).not.toContain('INZ000000000');
  });

  it('has midnight indigo theme in services.json for equity', () => {
    const equityService = services.find((s: any) => s.slug === 'equity');
    expect(equityService).toBeDefined();
    expect(equityService.theme.accent).toBe('#4F5FB0');
    expect(equityService.theme.secondaryAccent).toBe('#123D67');
    expect(equityService.theme.coolSteel).toBe('#8FA3C8');
    expect(equityService.theme.silver).toBe('#D7D9DC');
  });

  it('contains exactly 8 educational FAQs for equity with working categories', () => {
    const equityFaqs = faqs.filter((f: any) => f.page === 'equity');
    expect(equityFaqs.length).toBe(8);

    const categories = Array.from(new Set(equityFaqs.map((f: any) => f.category)));
    expect(categories).toContain('Basics');
    expect(categories).toContain('Account');
    expect(categories).toContain('Costs & risk');
    expect(categories).toContain('Support');

    const questions = equityFaqs.map((f: any) => f.question.toLowerCase());
    expect(questions.some((q: string) => q.includes('capacity'))).toBe(true);
    expect(questions.some((q: string) => q.includes('demat account'))).toBe(true);
    expect(questions.some((q: string) => q.includes('trading account'))).toBe(true);
    expect(questions.some((q: string) => q.includes('documents'))).toBe(true);
    expect(questions.some((q: string) => q.includes('risks'))).toBe(true);
    expect(questions.some((q: string) => q.includes('guaranteed'))).toBe(true);
    expect(questions.some((q: string) => q.includes('costs and charges'))).toBe(true);
    expect(questions.some((q: string) => q.includes('complaint'))).toBe(true);
  });

  it('contains the single-viewport broking frame and services stage', () => {
    expect(equityContent).toContain('<BrokingPartnerFrame />');
    expect(equityContent).toContain('<EquityServicesStage');
    expect(equityContent).toContain('<EquityAccountJourney />');
  });

  it('filters services by offered flag in EquityServicesStage', () => {
    expect(servicesStageContent).toContain('s.offered');
    expect(servicesStageContent).toContain('What you can do with us');
    expect(servicesStageContent).toContain('Ask us about this →');
  });

  it('contains 5 step Journey in EquityAccountJourney', () => {
    expect(journeyContent).toContain('Enquire');
    expect(journeyContent).toContain('Discuss the service, costs and risks');
    expect(journeyContent).toContain('Complete KYC and required documents');
    expect(journeyContent).toContain('Account opened through our broking partner');
    expect(journeyContent).toContain('Begin, with the risks understood');
    expect(journeyContent).toContain('Process and document requirements are set by our broking partner and applicable regulations.');
  });
});

