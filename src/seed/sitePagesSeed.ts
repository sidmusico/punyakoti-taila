/** Site `pages` collection seed — block layouts for storefront routes. */
export const SITE_PAGES_SEED = [
  {
    title: 'Homepage',
    slug: 'home',
    layout: [
      {
        blockType: 'ptHeroSection',
        eyebrow: 'Est. from a village press',
        headlineLine1: 'Pressed slowly,',
        headlineLine2: 'on wood.',
        headlineItalicWord: 'wood.',
        body: "The way your grandmother's kitchen smelled. Unrefined oils from wooden ghanis in Erode and Raibag — bottled within 72 hours, shipped to your kitchen in eight days.",
        primaryCTA: { label: 'Shop the collection', href: '/shop' },
        secondaryCTA: { label: 'Read our story', href: '/about' },
        reviewRating: '4.9 / 5',
        reviewCount: '2,847 verified kitchens',
        backgroundStyle: 'cream',
      },
      {
        blockType: 'ptTrustStrip',
        items: [
          { icon: 'leaf',   label: 'Cold-pressed',    sub: 'Below 40°C always' },
          { icon: 'drop',   label: 'Unrefined',       sub: 'No chemicals, no bleach' },
          { icon: 'truck',  label: 'Ships in 8 days', sub: 'Fresh from press to door' },
          { icon: 'shield', label: 'Lab tested',       sub: 'Every batch certified' },
        ],
      },
      {
        blockType: 'ptFeaturedProducts',
        eyebrow: 'The collection',
        headline: 'Six oils, one philosophy',
        body: 'Pressed slowly on wooden ghanis. Bottled within 72 hours. Always single-batch.',
        ctaLabel: 'Shop all',
        ctaHref: '/shop',
        columns: '3',
      },
      {
        blockType: 'ptProcessBanner',
        eyebrow: 'How we press',
        headlineLine1: 'The ghani has turned',
        headlineLine2: 'for a thousand years.',
        body: "A wooden press, a stone wheel, a slow rotation — this is how oil has been made in India for millennia. At Punyakoti, we've changed nothing. Seeds go in, oil comes out, below 40°C. Always.",
        stats: [
          { value: '< 40°C', label: 'Press temperature' },
          { value: '72 hrs', label: 'Farm to bottle' },
          { value: '100%',   label: 'Single-origin seeds' },
          { value: '0',      label: 'Chemical additives' },
        ],
        ctaLabel: 'Read our story',
        ctaHref: '/about',
      },
      {
        blockType: 'ptBenefitCards',
        eyebrow: 'Why it matters',
        headline: 'Cold-pressed vs. refined — the difference you taste',
        headlineItalic: 'the difference you taste',
        cards: [
          { icon: 'drop',   title: 'Full nutrition intact', body: 'Heat-extracted oils lose vitamins and antioxidants. Cold-pressing retains all of them — Omega-3s, Vitamin E, polyphenols.' },
          { icon: 'leaf',   title: 'No chemicals',          body: 'Refined oils use hexane solvent to extract every last drop. We use only mechanical pressure. Nothing else touches the oil.' },
          { icon: 'shield', title: 'Real flavour',          body: 'Refined oils are deodorised and bleached. Our oils taste exactly like the seed they came from — sesame is nutty, coconut is floral.' },
        ],
      },
      {
        blockType: 'ptTestimonialsSection',
        eyebrow: 'What customers say',
        headline: 'Trusted by 2,800+ kitchens',
        source: 'featured',
        maxItems: 3,
      },
      {
        blockType: 'ptNewsletterBand',
        headline: 'Stay in the loop',
        body: "New batches every week. Subscribe and we'll let you know the moment fresh oil is ready — before it sells out.",
        legalText: 'One email per batch. No spam. Unsubscribe anytime.',
        buttonLabel: 'Subscribe',
        style: 'dark-green',
      },
      {
        blockType: 'ptFAQSection',
        eyebrow: 'Frequently asked',
        headline: 'Questions & answers',
        style: 'light',
        items: [
          { question: 'What is wood-pressed (ghani) oil?', answer: 'A wooden or stone expeller rotates slowly, crushing oilseeds without generating significant heat (below 40°C). This preserves natural flavours, vitamins, and fatty acid profiles.' },
          { question: 'How long does the oil keep?', answer: 'Unopened, 12–18 months in a cool, dark place. Once opened, use within 3–4 months.' },
          { question: 'Is it safe to fry with cold-pressed oil?', answer: 'Yes. Groundnut and sesame have a high smoke point (~180–200°C) and are ideal for Indian cooking.' },
          { question: 'Do you ship pan-India?', answer: 'Yes — we ship to all major pincodes via Delhivery and Shiprocket. Orders placed before 2 PM are dispatched same day.' },
        ],
      },
    ],
  },

  // Shop, cart, checkout, and account use dedicated App Router pages — do not seed CMS `pages` slugs here.

  // ── Order Success ─────────────────────────────────────────────────────────────
  {
    title: 'Order Confirmed',
    slug: 'order-success',
    layout: [
      {
        blockType: 'ptEmptyState',
        icon: 'package',
        headline: 'Order confirmed!',
        body: 'Your order has been placed. You will receive a confirmation email shortly.',
        ctaLabel: 'Continue shopping',
        ctaHref: '/shop',
        note: 'Order success page — rendered dynamically with order details from Payload.',
      },
    ],
  },

  // ── About / Our Story ─────────────────────────────────────────────────────────
  {
    title: 'Our Story',
    slug: 'about',
    layout: [
      {
        blockType: 'ptHeroSection',
        eyebrow: 'Our story',
        headlineLine1: 'Born in a village,',
        headlineLine2: 'built for your kitchen.',
        headlineItalicWord: 'your kitchen.',
        body: 'Punyakoti Taila started with a single wooden ghani in Raibag, Karnataka. We press what we\'d cook with ourselves.',
        backgroundStyle: 'cream',
      },
      {
        blockType: 'ptProcessBanner',
        eyebrow: 'The process',
        headlineLine1: 'Traditional pressing,',
        headlineLine2: 'uncompromised.',
        body: 'Seeds go in. Oil comes out. Below 40°C. Every single time.',
        stats: [
          { value: '< 40°C', label: 'Press temperature' },
          { value: '72 hrs', label: 'Farm to bottle' },
          { value: '100%',   label: 'Single-origin' },
          { value: '0',      label: 'Additives' },
        ],
        ctaLabel: 'Shop the collection',
        ctaHref: '/shop',
      },
      {
        blockType: 'ptNewsletterBand',
        headline: 'Stay in the loop',
        body: 'New batch alerts, pressing schedules, and seasonal oils — right in your inbox.',
        legalText: 'One email per batch. No spam.',
        buttonLabel: 'Subscribe',
        style: 'dark-green',
      },
    ],
  },

  // ── Contact ───────────────────────────────────────────────────────────────────
  {
    title: 'Contact',
    slug: 'contact',
    layout: [
      {
        blockType: 'ptHeroSection',
        eyebrow: 'Get in touch',
        headlineLine1: "We'd love to",
        headlineLine2: 'hear from you.',
        headlineItalicWord: 'hear from you.',
        body: 'Have a question about an order, a product, or just want to say hello? Write to us.',
        primaryCTA: { label: 'Email us', href: 'mailto:hello@punyakoitaila.com' },
        backgroundStyle: 'cream',
      },
      {
        blockType: 'ptFAQSection',
        eyebrow: 'Common questions',
        headline: 'Before you write to us',
        style: 'light',
        items: [
          { question: 'Where do you ship?', answer: 'Pan-India — all major pincodes via Delhivery and Shiprocket.' },
          { question: 'How can I track my order?', answer: 'You will receive a tracking link via email and WhatsApp once your order is dispatched.' },
          { question: 'What is your return policy?', answer: 'We accept returns within 7 days of delivery for unopened bottles. Write to us at hello@punyakoitaila.com.' },
        ],
      },
    ],
  },

  // ── Support / FAQ ─────────────────────────────────────────────────────────────
  {
    title: 'Help & FAQs',
    slug: 'support',
    layout: [
      {
        blockType: 'ptHeroSection',
        eyebrow: 'Support',
        headlineLine1: 'Help &',
        headlineLine2: 'FAQs',
        backgroundStyle: 'cream',
      },
      {
        blockType: 'ptFAQSection',
        eyebrow: 'Frequently asked',
        headline: 'Everything you need to know',
        style: 'light',
        items: [
          { question: 'What is wood-pressed (ghani) oil?', answer: 'A wooden or stone expeller rotates slowly, crushing oilseeds without generating significant heat (below 40°C). This preserves natural flavours, vitamins, and fatty acid profiles.' },
          { question: 'How long does the oil keep?', answer: 'Unopened, 12–18 months in a cool, dark place. Once opened, use within 3–4 months.' },
          { question: 'Is it safe to fry with cold-pressed oil?', answer: 'Yes. Groundnut and sesame have a high smoke point (~180–200°C) and are ideal for Indian cooking.' },
          { question: 'Do you ship pan-India?', answer: 'Yes — we ship to all major pincodes. Orders placed before 2 PM are dispatched same day.' },
          { question: 'What is your return policy?', answer: 'We accept returns within 7 days for unopened bottles. Email hello@punyakoitaila.com with your order number.' },
          { question: 'How do I cancel an order?', answer: 'Contact us within 2 hours of placing your order. Once dispatched, we cannot cancel but can initiate a return.' },
        ],
      },
    ],
  },

  // ── Privacy Policy ────────────────────────────────────────────────────────────
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    layout: [
      {
        blockType: 'ptEmptyState',
        icon: 'shield',
        headline: 'Privacy Policy',
        body: 'Add your privacy policy content here via the Content block below.',
        note: 'Add a Content block below this for the full policy text.',
      },
    ],
  },

  // ── Terms of Service ──────────────────────────────────────────────────────────
  {
    title: 'Terms of Service',
    slug: 'terms',
    layout: [
      {
        blockType: 'ptEmptyState',
        icon: 'shield',
        headline: 'Terms of Service',
        body: 'Add your terms of service content here via the Content block below.',
        note: 'Add a Content block below this for the full terms text.',
      },
    ],
  },

  // ── Returns Policy ────────────────────────────────────────────────────────────
  {
    title: 'Returns & Refunds',
    slug: 'returns',
    layout: [
      {
        blockType: 'ptEmptyState',
        icon: 'package',
        headline: 'Returns & Refunds',
        body: 'We accept returns within 7 days of delivery for unopened bottles in original condition.',
        ctaLabel: 'Contact support',
        ctaHref: '/contact',
        note: 'Add a Content block below for full returns policy text.',
      },
    ],
  },

  // ── Sustainability ────────────────────────────────────────────────────────────
  {
    title: 'Sustainability',
    slug: 'sustainability',
    layout: [
      {
        blockType: 'ptHeroSection',
        eyebrow: 'Our commitment',
        headlineLine1: 'Good for you,',
        headlineLine2: 'good for the earth.',
        headlineItalicWord: 'good for the earth.',
        body: 'Cold-pressing uses minimal energy, produces no chemical waste, and supports small-scale traditional farmers.',
        backgroundStyle: 'cream',
      },
      {
        blockType: 'ptBenefitCards',
        eyebrow: 'How we do it',
        headline: 'Sustainability at every step',
        cards: [
          { icon: 'leaf',   title: 'No chemicals',         body: 'Only mechanical pressure. No hexane, no bleach, no deodorising agents.' },
          { icon: 'drop',   title: 'Low energy pressing',  body: 'Traditional wooden ghanis consume a fraction of the energy of industrial oil mills.' },
          { icon: 'shield', title: 'Farmer partnerships',  body: 'We source directly from farmers in Erode and Raibag, ensuring fair pricing and long-term relationships.' },
        ],
      },
    ],
  },

  // ── Wholesale ─────────────────────────────────────────────────────────────────
  {
    title: 'Wholesale',
    slug: 'wholesale',
    layout: [
      {
        blockType: 'ptHeroSection',
        eyebrow: 'Wholesale enquiries',
        headlineLine1: 'Bulk orders for',
        headlineLine2: 'restaurants & retailers.',
        headlineItalicWord: 'restaurants & retailers.',
        body: 'We supply premium cold-pressed oils to restaurants, wellness brands, and specialty retailers across India. Write to us for pricing.',
        primaryCTA: { label: 'Enquire now', href: 'mailto:wholesale@punyakoitaila.com' },
        backgroundStyle: 'cream',
      },
      {
        blockType: 'ptTrustStrip',
        items: [
          { icon: 'drop',   label: 'MOQ 10 litres',   sub: 'Minimum order quantity' },
          { icon: 'truck',  label: 'Bulk shipping',    sub: 'Pan-India delivery' },
          { icon: 'shield', label: 'Custom labelling', sub: 'White-label available' },
          { icon: 'leaf',   label: 'Lab certified',    sub: 'FSSAI compliant' },
        ],
      },
    ],
  },

  // ── Journal (blog listing) ─────────────────────────────────────────────────────
  {
    title: 'Journal',
    slug: 'journal',
    layout: [
      {
        blockType: 'ptHeroSection',
        eyebrow: 'The journal',
        headlineLine1: 'Stories from',
        headlineLine2: 'the press room.',
        headlineItalicWord: 'the press room.',
        body: 'Recipes, pressing notes, farmer stories, and the science behind cold-pressed oils.',
        backgroundStyle: 'cream',
      },
      {
        blockType: 'ptEmptyState',
        icon: 'leaf',
        headline: 'Journal posts',
        body: 'Blog posts are managed via the Posts collection in the CMS.',
        note: 'This page uses the /posts route for actual blog listing. Update layout as needed.',
      },
    ],
  },
] as const
