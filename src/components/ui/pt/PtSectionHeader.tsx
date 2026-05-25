import React from 'react'
import { Icons } from '@/components/ui/pt/Icons'
import { PtEyebrow, type PtEyebrowVariant } from '@/components/ui/pt/PtEyebrow'
import { PtTextLink, type PtTextLinkVariant } from '@/components/ui/pt/PtTextLink'
import { cn } from '@/utilities/ui'

export function PtSectionHeader({
  eyebrow,
  eyebrowVariant = 'default',
  eyebrowCenter = false,
  title,
  titleClassName,
  description,
  action,
  className,
}: {
  eyebrow: string
  eyebrowVariant?: PtEyebrowVariant
  eyebrowCenter?: boolean
  title: React.ReactNode
  titleClassName?: string
  description?: string
  action?: { href: string; label: string; variant?: PtTextLinkVariant }
  className?: string
}) {
  return (
    <div className={cn('hp-section-head', className)}>
      <div className="hp-section-head__main">
        <PtEyebrow variant={eyebrowVariant} center={eyebrowCenter}>
          {eyebrow}
        </PtEyebrow>
        <h2 className={cn('hp-heading-section', titleClassName)}>{title}</h2>
        {description ? <p className="hp-prose-muted hp-section-head__desc">{description}</p> : null}
      </div>
      {action ? (
        <PtTextLink href={action.href} variant={action.variant ?? 'green'} className="hp-section-head__action pt-btn-inline-icon">
          {action.label} <Icons.arrowRight size={14} />
        </PtTextLink>
      ) : null}
    </div>
  )
}
