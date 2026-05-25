import React from 'react'

import { NewsletterForm } from '@/components/shop/NewsletterForm'
import { CowMark } from '@/components/ui/pt/CowMark'

export function HomeNewsletterSection({
  eyebrow = 'The Wood-Press Diary',
  headlineLine1 = 'A short letter,',
  headlineLine2Italic = 'once a fortnight.',
  body = 'Press updates from Erode, the occasional recipe from our test kitchen, and ten percent off your next bottle.',
  legalText = "We won't sell your address. Unsubscribe in one click. No emoji.",
  buttonLabel = 'Subscribe',
}: {
  eyebrow?: string | null
  headlineLine1?: string | null
  headlineLine2Italic?: string | null
  body?: string | null
  legalText?: string | null
  buttonLabel?: string | null
}) {
  return (
    <section className="hp-newsletter-outer">
      <div className="newsletter-grid hp-newsletter-card">
        <div className="hp-newsletter__wm" aria-hidden="true">
          <CowMark size={300} color="var(--cream-100)" />
        </div>
        <div className="hp-newsletter__col">
          <div className="pt-eyebrow pt-eyebrow--on-dark">{eyebrow}</div>
          <h2 className="hp-heading-newsletter">
            {headlineLine1}
            <br />
            <span className="pt-display-italic" style={{ color: 'var(--mustard-400)' }}>
              {headlineLine2Italic}
            </span>
          </h2>
          <p className="hp-prose-newsletter">{body}</p>
        </div>
        <div className="hp-newsletter__form-col">
          <NewsletterForm submitLabel={buttonLabel ?? undefined} />
          <p className="hp-prose-newsletter-note">{legalText}</p>
        </div>
      </div>
    </section>
  )
}
