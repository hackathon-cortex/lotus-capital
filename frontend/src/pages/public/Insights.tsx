import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import rawInsightsData from '@content/data/insights.json';
import seoData from '@content/data/seo.json';
import { InsightsHero } from '../../components/insights/InsightsHero';
import { FeaturedGuideCard, InsightArticleSummary } from '../../components/insights/FeaturedGuideCard';
import { InsightsLibraryBento } from '../../components/insights/InsightsLibraryBento';
import { LearningPathsSection } from '../../components/insights/LearningPathsSection';
import { JargonBusterSection } from '../../components/insights/JargonBusterSection';
import { EnquiryPanel } from '../../components/enquiry/EnquiryPanel';
import { DotNavigator } from '../../components/common/DotNavigator';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';

const INSIGHTS_SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'featured', label: 'Featured' },
  { id: 'library', label: 'Library' },
  { id: 'paths', label: 'Paths' },
  { id: 'jargon', label: 'Jargon' },
  { id: 'enquiry', label: 'Enquiry' },
];

const CATEGORIES = [
  'All',
  'Mutual Fund Basics',
  'Insurance Basics',
  'Equity & Market Risk',
  'Financial Planning',
];

export const Insights: React.FC = () => {
  const seo = seoData['/insights'] || {
    title: 'Financial Insights & Educational Guides | Lotus Capital Godhra',
    description:
      'Clear, unbiased educational guides on mutual funds, health insurance, equity risks, and financial planning.',
  };

  const allArticles: InsightArticleSummary[] = rawInsightsData as InsightArticleSummary[];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      if (cat === 'All') {
        counts[cat] = allArticles.length;
      } else {
        counts[cat] = allArticles.filter((a) => a.category === cat).length;
      }
    });
    return counts;
  }, [allArticles]);

  // Featured article (first with featured: true, or first article)
  const featuredArticle = useMemo(() => {
    return allArticles.find((a) => a.featured) || allArticles[0];
  }, [allArticles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return allArticles.filter((art) => {
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;

      const titleMatch = art.title.toLowerCase().includes(query);
      const summaryMatch = art.summary.toLowerCase().includes(query);
      const categoryMatch = art.category.toLowerCase().includes(query);
      const tagsMatch = art.tags?.some((t) => t.toLowerCase().includes(query)) ?? false;

      return titleMatch || summaryMatch || categoryMatch || tagsMatch;
    });
  }, [allArticles, searchQuery, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Red Reading Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Right Side Dot Navigator */}
      <DotNavigator sections={INSIGHTS_SECTIONS} />

      <div
        className="insights-canvas-bg"
        style={{
          backgroundColor: '#EEF1F4',
          minHeight: '100vh',
          backgroundImage: `
            radial-gradient(#CBD5E1 1px, transparent 1px),
            linear-gradient(to bottom, #EEF1F4 0%, #E6EAF0 100%)
          `,
          backgroundSize: '24px 24px, 100% 100%',
        }}
      >
        {/* 1. Hero with Search and Category Pills */}
        <InsightsHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          categories={CATEGORIES}
          categoryCounts={categoryCounts}
          totalCount={allArticles.length}
          filteredCount={filteredArticles.length}
        />

        {/* 2. Featured Guide Card (shown when no specific filter active or when featured matches) */}
        {(!searchQuery && selectedCategory === 'All') && featuredArticle && (
          <FeaturedGuideCard article={featuredArticle} />
        )}

        {/* 3. Library Bento Grid */}
        <InsightsLibraryBento
          articles={filteredArticles}
          onResetFilters={handleResetFilters}
        />

        {/* 4. Curated Learning Paths */}
        <LearningPathsSection />

        {/* 5. Financial Jargon Buster 3D Flip Cards */}
        <JargonBusterSection />

        {/* 6. Reassurance Enquiry Section */}
        <section id="enquiry" className="section-padding" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
          <div className="container">
            <EnquiryPanel
              title="Have Questions on Any Financial Topic?"
              subtitle="Speak with our certified advisory team in Godhra for unbiased educational clarifications."
              defaultService="mutual-funds"
              reassuranceLines={[
                'Direct consultation with our licensed advisor in Godhra',
                'Unbiased educational guidance — zero high-pressure sales',
                'Tailored reviews of existing portfolios and policies',
              ]}
            />
          </div>
        </section>
      </div>
    </>
  );
};
