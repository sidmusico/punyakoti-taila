import React from 'react'

import { Icons } from '@/components/ui/pt/Icons'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'
import { cn } from '@/utilities/ui'

const DEFAULT_FAQ = [
  {
    question: 'How long does the oil keep?',
    answer:
      'Six months from the press date stamped on the bottle. After opening, refrigerate and finish within ten weeks for full aroma.',
  },
  {
    question: 'Is this organic-certified?',
    answer:
      'Our farms are USDA-NOP and India-Organic certified. We publish lab tests for each batch on the product page.',
  },
  {
    question: "What does 'kachi ghani' mean?",
    answer:
      'Literally: a cold press. Practically: pressed without heat in a wooden mortar — the original method, slow and low-yield.',
  },
  {
    question: 'Can I subscribe?',
    answer: "Yes — pick any oil and select 'subscribe & save 15%'. Pause, skip, or cancel anytime from your account.",
  },
] as const

export function HomeFaqSection({
  eyebrow = 'Frequently asked',
  headlinePrefix = 'Short, honest',
  headlineItalic = 'answers.',
  style: variant = 'light',
  items,
}: {
  eyebrow?: string | null
  headlinePrefix?: string | null
  headlineItalic?: string | null
  style?: 'light' | 'dark' | null
  items?: { question: string; answer: string }[] | null
}) {
  const list = items?.length ? items : [...DEFAULT_FAQ]
  const isDark = variant === 'dark'

  return (
    <section className={cn('faq-grid hp-faq', isDark && 'hp-faq--dark')}>
      <div>
        <PtEyebrow variant={isDark ? 'onDark' : 'default'}>{eyebrow}</PtEyebrow>
        <h2 className="hp-heading-faq">
          {headlinePrefix}{' '}
          <em className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
            {headlineItalic}
          </em>
        </h2>
      </div>
      <div>
        {list.map((f) => (
          <details key={f.question} className="hp-faq-item">
            <summary className="hp-faq-summary">
              <div className="hp-faq-q">{f.question}</div>
              <div className="hp-faq-toggle">
                <Icons.plus size={14} />
              </div>
            </summary>
            <p className="hp-faq-a">{f.answer}</p>
          </details>
        ))}
        <div className="hp-faq-end-rule" />
      </div>
    </section>
  )
}
