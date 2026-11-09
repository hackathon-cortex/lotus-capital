import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ContactDrawerProvider } from '../src/context/ContactDrawerContext';
import { Home } from '../src/pages/public/Home';
import { AboutUs } from '../src/pages/public/AboutUs';
import { GeneralInsurance } from '../src/pages/public/GeneralInsurance';
import { HealthInsurance } from '../src/pages/public/HealthInsurance';
import { Equity } from '../src/pages/public/Equity';
import { SiteHeader } from '../src/components/nav/SiteHeader';
import { DevDataRegisterPill } from '../src/components/common/DevDataRegisterPill';
import { HOW_WE_WORK_STEPS } from '../src/components/home/HomeHowWeWork';
import { GI_STEPS_CONTENT } from '../src/components/insurance/StepScroller';
import { HEALTH_TIMELINE_STEPS } from '../src/components/insurance/HealthProcessTimeline';
import { PINNED_CONFIG } from '../src/config/pinned';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ContactDrawerProvider>{ui}</ContactDrawerProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('Refinement Round 3 Verification & Regression Suite', () => {
  it('A1: Dot navigator is completely absent on Home, About, GI, Health, Equity', () => {
    const { container: homeContainer } = renderWithProviders(<Home />);
    expect(homeContainer.querySelector('.dot-nav')).toBeNull();
    expect(homeContainer.querySelector('[data-dot-nav]')).toBeNull();
    expect(homeContainer.querySelector('[aria-label="Section navigation"]')).toBeNull();

    const { container: aboutContainer } = renderWithProviders(<AboutUs />);
    expect(aboutContainer.querySelector('.dot-nav')).toBeNull();

    const { container: giContainer } = renderWithProviders(<GeneralInsurance />);
    expect(giContainer.querySelector('.dot-nav')).toBeNull();

    const { container: healthContainer } = renderWithProviders(<HealthInsurance />);
    expect(healthContainer.querySelector('.dot-nav')).toBeNull();

    const { container: equityContainer } = renderWithProviders(<Equity />);
    expect(equityContainer.querySelector('.dot-nav')).toBeNull();
  });

  it('A2: SiteHeader includes the full-width backdrop strip element', () => {
    const { container } = renderWithProviders(<SiteHeader />);
    const backdrop = container.querySelector('.site-header-backdrop');
    expect(backdrop).not.toBeNull();
  });

  it('A4 & B1: Section tones and stacking markers are systematically present', () => {
    const { container } = renderWithProviders(<Home />);
    const hero = container.querySelector('#hero');
    const about = container.querySelector('#about');
    const mutualFunds = container.querySelector('#mutual-funds');
    const equity = container.querySelector('#equity');
    const trust = container.querySelector('#trust');

    expect(hero?.getAttribute('data-tone')).toBe('dark');
    expect(about?.getAttribute('data-tone')).toBe('light');
    expect(mutualFunds?.getAttribute('data-tone')).toBe('dark');
    expect(equity?.getAttribute('data-tone')).toBe('dark');
    expect(trust?.getAttribute('data-tone')).toBe('dark');
  });

  it('B2: Home How We Work step configuration contains 4 structured stages strictly from 01-home.md', () => {
    expect(HOW_WE_WORK_STEPS).toHaveLength(4);
    expect(HOW_WE_WORK_STEPS[0].title).toBe('We Listen');
    expect(HOW_WE_WORK_STEPS[0].desc).toBe('We listen to your goals and circumstances.');
    expect(HOW_WE_WORK_STEPS[1].title).toBe('We Explain');
    expect(HOW_WE_WORK_STEPS[1].desc).toBe('We explain the options available and their risks.');
    expect(HOW_WE_WORK_STEPS[2].title).toBe('We Help with the Process');
    expect(HOW_WE_WORK_STEPS[2].desc).toBe('We help with the application or transaction process through the relevant provider.');
    expect(HOW_WE_WORK_STEPS[3].title).toBe('We Stay in Touch');
    expect(HOW_WE_WORK_STEPS[3].desc).toBe('We stay available for follow-up and servicing.');
  });

  it('B3: Home Learn Before You Invest renders exactly 3 cards with badges and numbers', () => {
    const { container } = renderWithProviders(<Home />);
    const learnSection = container.querySelector('#learn');
    expect(learnSection).not.toBeNull();
    expect(learnSection?.getAttribute('data-tone')).toBe('light');

    const cards = learnSection?.querySelectorAll('.learn-card');
    expect(cards?.length).toBe(3);

    expect(screen.getByText('RISK AWARENESS')).toBeDefined();
    expect(screen.getByText('INVESTMENT PRINCIPLES')).toBeDefined();
    expect(screen.getByText('PORTFOLIO DISCIPLINE')).toBeDefined();
  });

  it('B4: About Our Journey contains 4 verified milestones and no "Confirmed Milestone" badge', () => {
    const { container } = renderWithProviders(<AboutUs />);
    const journey = container.querySelector('#journey');
    expect(journey).not.toBeNull();
    expect(journey?.getAttribute('data-tone')).toBe('dark');

    // "Confirmed Milestone" pill must be removed
    expect(container.textContent).not.toContain('Confirmed Milestone');
  });

  it('B5 & B6: General Insurance StepScroller contains 4 steps strictly from 04-general-insurance.md', () => {
    expect(GI_STEPS_CONTENT).toHaveLength(4);
    expect(GI_STEPS_CONTENT[0].title).toBe('Send an enquiry or call us');
    expect(GI_STEPS_CONTENT[1].title).toBe('Tell us what you want to insure');
    expect(GI_STEPS_CONTENT[2].title).toBe('We share the options from our insurer partners');
    expect(GI_STEPS_CONTENT[3].title).toBe('You review the policy documents and decide');
  });

  it('B7: Health Insurance Timeline has 6 structured steps with valid copy', () => {
    expect(HEALTH_TIMELINE_STEPS).toHaveLength(6);
    expect(HEALTH_TIMELINE_STEPS[0].title).toBe('Send an Enquiry');
    // Ensure intrusive paperwork copy was removed
    expect(HEALTH_TIMELINE_STEPS[0].actionNote).not.toContain('invasive financial paperwork');
    expect(HEALTH_TIMELINE_STEPS[5].title).toBe('Local Claim & Renewal Support');
  });

  it('C3: DevDataRegisterPill renders at 28px height with 16px bottom offset', () => {
    const { container } = renderWithProviders(<DevDataRegisterPill />);
    const aside = container.querySelector('aside[aria-label="Development Navigation"]');
    const pill = container.querySelector('a[href="/dev/data-register"]');
    expect(aside).not.toBeNull();
    expect(pill).not.toBeNull();
    expect(aside?.getAttribute('style')).toContain('bottom: 16px');
    expect(aside?.getAttribute('style')).toContain('left: 16px');
    expect(pill?.getAttribute('style')).toContain('height: 28px');
  });

  it('R1: Pinned stage configuration sets stage height and stacking below header', () => {
    expect(PINNED_CONFIG.headerZIndex).toBe(50);
    expect(PINNED_CONFIG.stageZIndex).toBeLessThanOrEqual(20);
    expect(PINNED_CONFIG.stageHeightCalc).toContain('clamp(480px');
    expect(PINNED_CONFIG.stageTopOffset).toContain('calc(var(--header-h');
    expect(PINNED_CONFIG.scrollPerStepVh).toBe(45);
    expect(PINNED_CONFIG.progressCompleteAtRatio).toBe(0.85);
  });

  it('R2: Numeral wrapping protection attribute [data-numeral] is applied across all journeys', () => {
    // 1. Home
    const { container: homeContainer } = renderWithProviders(<Home />);
    const homeNumerals = homeContainer.querySelectorAll('[data-numeral]');
    expect(homeNumerals.length).toBeGreaterThan(0);
    homeNumerals.forEach((el) => {
      expect(el.textContent?.trim().length).toBeGreaterThan(0);
      const style = el.getAttribute('style') || '';
      expect(style).toContain('white-space: nowrap');
      expect(style).toContain('writing-mode: horizontal-tb');
    });

    // 2. AboutUs
    const { container: aboutContainer } = renderWithProviders(<AboutUs />);
    const aboutNumerals = aboutContainer.querySelectorAll('[data-numeral]');
    expect(aboutNumerals.length).toBeGreaterThan(0);
    aboutNumerals.forEach((el) => {
      const style = el.getAttribute('style') || '';
      expect(style).toContain('white-space: nowrap');
    });

    // 3. General Insurance
    const { container: giContainer } = renderWithProviders(<GeneralInsurance />);
    const giNumerals = giContainer.querySelectorAll('[data-numeral]');
    expect(giNumerals.length).toBeGreaterThan(0);

    // 4. Health Insurance
    const { container: healthContainer } = renderWithProviders(<HealthInsurance />);
    const healthNumerals = healthContainer.querySelectorAll('[data-numeral]');
    expect(healthNumerals.length).toBeGreaterThan(0);

    // 5. Equity
    const { container: equityContainer } = renderWithProviders(<Equity />);
    const equityNumerals = equityContainer.querySelectorAll('[data-numeral]');
    expect(equityNumerals.length).toBeGreaterThan(0);
  });

  it('R3: Reference timeline pipeline renders continuous baseline track and phase bar without dead space', () => {
    const { container: homeContainer } = renderWithProviders(<Home />);
    const homeTrack = homeContainer.querySelector('.timeline-baseline-track');
    expect(homeTrack).not.toBeNull();
    const homePhases = homeContainer.querySelector('.timeline-phases-bar');
    expect(homePhases).not.toBeNull();

    const { container: equityContainer } = renderWithProviders(<Equity />);
    const equityTrack = equityContainer.querySelector('.timeline-baseline-track');
    expect(equityTrack).not.toBeNull();
  });
});
