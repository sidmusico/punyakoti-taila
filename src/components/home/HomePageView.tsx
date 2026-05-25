import React from 'react'

import { BottleRowSection } from '@/components/home/BottleRowSection'
import { FALLBACK_PRODUCTS, type FallbackProduct } from '@/components/home/home-constants'
import { HomeBestSellersSection } from '@/components/home/HomeBestSellersSection'
import { HomeFaqSection } from '@/components/home/HomeFaqSection'
import { HomeFeaturedCollection } from '@/components/home/HomeFeaturedCollection'
import { HomeHeroCinematic } from '@/components/home/HomeHeroCinematic'
import { HomeHeroEditorial } from '@/components/home/HomeHeroEditorial'
import { HomeJournalSection } from '@/components/home/HomeJournalSection'
import { HomeNewsletterSection } from '@/components/home/HomeNewsletterSection'
import { HomePoeticSection } from '@/components/home/HomePoeticSection'
import { HomeProcessBannerSection } from '@/components/home/HomeProcessBannerSection'
import { HomeProcessSection } from '@/components/home/HomeProcessSection'
import { HomeStatsSection } from '@/components/home/HomeStatsSection'
import { HomeTestimonialsSection, mapManualHomeTestimonials } from '@/components/home/HomeTestimonialsSection'
import { HomeTraditionSection } from '@/components/home/HomeTraditionSection'
import { HomeTrustStrip } from '@/components/home/HomeTrustStrip'
import { HomeWhySection } from '@/components/home/HomeWhySection'
import { PressBand } from '@/components/home/PressBand'
import type { HomepageSetting, Product, Testimonial } from '@/payload-types'

type HomeGlobal = Partial<HomepageSetting> | null

export function HomePageView({
  homepage,
  featuredProducts,
  bestSellers,
  testimonials,
}: {
  homepage: HomeGlobal
  featuredProducts: Product[]
  bestSellers: Product[]
  testimonials: Testimonial[]
}) {
  const hp = homepage

  const showFallbackFeatured = featuredProducts.length === 0
  const showFallbackBest = bestSellers.length === 0
  const bestList: (Product | FallbackProduct)[] = showFallbackBest
    ? FALLBACK_PRODUCTS.slice(0, 4)
    : bestSellers.slice(0, 4)

  const tb = hp?.testimonialsBand
  const maxT = Math.min(Math.max(tb?.maxItems ?? 3, 1), 12)
  const manualRows =
    tb?.source === 'manual' && tb.manualItems?.length
      ? mapManualHomeTestimonials(tb.manualItems).slice(0, maxT)
      : null
  const showFallbackTestimonials = !manualRows && testimonials.length === 0

  return (
    <>
      {hp?.cinematicEnabled !== false ? (
        <HomeHeroCinematic
          badge={hp?.cinematic?.badge}
          headlineLine1={hp?.cinematic?.headlineLine1}
          headlineItalic={hp?.cinematic?.headlineItalic}
          lead={hp?.cinematic?.lead}
          ctaLabel={hp?.cinematic?.cta?.label}
          ctaHref={hp?.cinematic?.cta?.href}
          image={hp?.cinematic?.image}
        />
      ) : null}

      {hp?.heroEnabled !== false ? (
        <HomeHeroEditorial
          eyebrow={hp?.hero?.eyebrow}
          headlineLine1={hp?.hero?.headlineLine1}
          headlineLine2={hp?.hero?.headlineLine2}
          headlineItalicWord={hp?.hero?.headlineItalicWord}
          body={hp?.hero?.body}
          primaryCTA={hp?.hero?.primaryCTA}
          secondaryCTA={hp?.hero?.secondaryCTA}
          reviewRating={hp?.hero?.reviewRating}
          reviewCount={hp?.hero?.reviewCount}
          bottleVariant={hp?.hero?.bottleVariant}
          batchCaptionLeft={hp?.hero?.batchCaptionLeft}
          batchCaptionRight={hp?.hero?.batchCaptionRight}
          pressWeekKicker={hp?.hero?.pressWeekKicker}
          pressWeekTitle={hp?.hero?.pressWeekTitle}
          backgroundStyle={hp?.hero?.backgroundStyle}
          image={hp?.hero?.image}
        />
      ) : null}

      {hp?.pressMarqueeEnabled !== false ? (
        <PressBand items={hp?.pressMarquee?.items ?? undefined} />
      ) : null}

      {hp?.trustStripEnabled !== false ? <HomeTrustStrip items={hp?.trustStrip ?? undefined} /> : null}

      {hp?.featuredSectionEnabled !== false ? (
        <HomeFeaturedCollection
          products={featuredProducts}
          showFallback={showFallbackFeatured}
          eyebrow={hp?.featuredSection?.eyebrow}
          headline={hp?.featuredSection?.headline}
          body={hp?.featuredSection?.body}
          ctaLabel={hp?.featuredSection?.ctaLabel}
          ctaHref={hp?.featuredSection?.ctaHref}
          columns={hp?.featuredSection?.columns}
        />
      ) : null}

      {hp?.traditionEnabled !== false && hp?.tradition ? (
        <HomeTraditionSection
          eyebrow={hp.tradition.eyebrow}
          headlineLine1={hp.tradition.headlineLine1}
          headlineItalic={hp.tradition.headlineItalic}
          paragraph1={hp.tradition.paragraph1}
          paragraph2={hp.tradition.paragraph2}
          ctaPrimary={hp.tradition.ctaPrimary}
          ctaSecondary={hp.tradition.ctaSecondary}
          mediaCaptionLeft={hp.tradition.mediaCaptionLeft}
          mediaCaptionRight={hp.tradition.mediaCaptionRight}
          image={hp.tradition.image}
        />
      ) : hp?.traditionEnabled !== false ? (
        <HomeTraditionSection />
      ) : null}

      {hp?.processStepsEnabled !== false && hp?.processSteps ? (
        <HomeProcessSection
          eyebrow={hp.processSteps.eyebrow}
          headlineLine1={hp.processSteps.headlineLine1}
          headlineItalic={hp.processSteps.headlineItalic}
          body={hp.processSteps.body}
          steps={hp.processSteps.steps}
          cta={hp.processSteps.cta}
          bannerImage={hp.processSteps.bannerImage}
        />
      ) : hp?.processStepsEnabled !== false ? (
        <HomeProcessSection />
      ) : null}

      {hp?.processSectionEnabled !== false ? (
        <HomeProcessBannerSection
          eyebrow={hp?.processSection?.eyebrow}
          headlineLine1={hp?.processSection?.headlineLine1}
          headlineLine2={hp?.processSection?.headlineLine2}
          body={hp?.processSection?.body}
          stats={hp?.processSection?.stats}
          ctaLabel={hp?.processSection?.ctaLabel}
          ctaHref={hp?.processSection?.ctaHref}
          backgroundImage={hp?.processSection?.backgroundImage}
        />
      ) : null}

      {hp?.poeticEnabled !== false && hp?.poetic ? (
        <HomePoeticSection
          eyebrow={hp.poetic.eyebrow}
          headline1={hp.poetic.headline1}
          headline2={hp.poetic.headline2}
          body={hp.poetic.body}
          backgroundImage={hp.poetic.backgroundImage}
        />
      ) : hp?.poeticEnabled !== false ? (
        <HomePoeticSection />
      ) : null}

      {hp?.whyColdPressedEnabled !== false ? (
        <HomeWhySection
          eyebrow={hp?.whyColdPressed?.eyebrow}
          headline={hp?.whyColdPressed?.headline}
          headlineItalic={hp?.whyColdPressed?.headlineItalic}
          scienceHref={hp?.whyColdPressed?.scienceHref}
          scienceLabel={hp?.whyColdPressed?.scienceLabel}
          cards={hp?.whyColdPressed?.cards ?? undefined}
        />
      ) : null}

      {hp?.statsBandEnabled !== false ? (
        <HomeStatsSection
          eyebrow={hp?.statsBand?.eyebrow}
          headlinePrefix={hp?.statsBand?.headlinePrefix}
          headlineItalic={hp?.statsBand?.headlineItalic}
          stats={hp?.statsBand?.stats ?? undefined}
          backgroundImage={hp?.statsBand?.backgroundImage}
        />
      ) : null}

      {hp?.bestSellersEnabled !== false ? (
        <HomeBestSellersSection
          bestSellers={bestList}
          eyebrow={hp?.bestSellers?.eyebrow}
          headline={hp?.bestSellers?.headline}
          ctaLabel={hp?.bestSellers?.cta?.label}
          ctaHref={hp?.bestSellers?.cta?.href}
        />
      ) : null}

      {hp?.bottleRowEnabled !== false ? (
        <BottleRowSection
          eyebrow={hp?.bottleRow?.eyebrow}
          headlineBefore={hp?.bottleRow?.headlineBefore}
          headlineItalic={hp?.bottleRow?.headlineItalic}
          ctaLabel={hp?.bottleRow?.cta?.label}
          ctaHref={hp?.bottleRow?.cta?.href}
        />
      ) : null}

      {hp?.testimonialsBandEnabled !== false ? (
        <HomeTestimonialsSection
          testimonials={testimonials}
          showFallback={showFallbackTestimonials}
          eyebrow={tb?.eyebrow}
          headline={tb?.headline ?? undefined}
          overrideRows={manualRows}
        />
      ) : null}

      {hp?.journalEnabled !== false ? (
        <HomeJournalSection
          eyebrow={hp?.journal?.eyebrow}
          headlineLine1={hp?.journal?.headlineLine1}
          headlineLine2={hp?.journal?.headlineLine2}
          ctaLabel={hp?.journal?.cta?.label}
          ctaHref={hp?.journal?.cta?.href}
          posts={hp?.journal?.posts ?? undefined}
        />
      ) : null}

      {hp?.newsletterEnabled !== false ? (
        <HomeNewsletterSection
          eyebrow={hp?.newsletter?.eyebrow}
          headlineLine1={hp?.newsletter?.headlineLine1}
          headlineLine2Italic={hp?.newsletter?.headlineLine2Italic}
          body={hp?.newsletter?.body}
          legalText={hp?.newsletter?.legalText}
          buttonLabel={hp?.newsletter?.buttonLabel}
        />
      ) : null}

      {hp?.faqEnabled !== false ? (
        <HomeFaqSection
          eyebrow={hp?.faq?.eyebrow}
          headlinePrefix={hp?.faq?.headlinePrefix}
          headlineItalic={hp?.faq?.headlineItalic}
          style={hp?.faq?.style}
          items={hp?.faq?.items ?? undefined}
          backgroundImage={hp?.faq?.backgroundImage}
        />
      ) : null}
    </>
  )
}
