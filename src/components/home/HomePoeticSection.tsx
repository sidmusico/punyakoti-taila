import React from 'react'

import { CowMark } from '@/components/ui/pt/CowMark'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'

export function HomePoeticSection({
  eyebrow = 'An aside · from the Wood-Press Diary',
  headline1 = 'Refined oil is a shortcut.',
  headline2 = 'We press the long way around.',
  body = 'The industrial press runs at 240°C with hexane solvent — fast, high-yield, and chemically obedient. The wooden ghani turns at four revolutions per minute, peaks at 38°C, and gives you back exactly half. The other half is what tradition called flavour. We chose half.',
}: {
  eyebrow?: string | null
  headline1?: string | null
  headline2?: string | null
  body?: string | null
}) {
  return (
    <section className="hp-poetic">
      <div className="hp-poetic__wm" aria-hidden="true">
        <CowMark size={520} color="var(--green-900)" />
      </div>
      <div className="hp-max-1080">
        <PtEyebrow>{eyebrow}</PtEyebrow>
        <h2 className="hp-heading-poetic">{headline1}</h2>
        <h2 className="hp-heading-poetic-accent">{headline2}</h2>
        <p className="pt-dropcap hp-prose-poetic">{body}</p>
      </div>
    </section>
  )
}
