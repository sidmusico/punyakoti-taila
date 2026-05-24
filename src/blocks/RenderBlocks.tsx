import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock }      from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock }      from '@/blocks/Content/Component'
import { FormBlock }         from '@/blocks/Form/Component'
import { MediaBlock }        from '@/blocks/MediaBlock/Component'

// ── PT block stubs ────────────────────────────────────────────────────────────
// These are lightweight fallbacks for PT blocks rendered via the generic [slug]
// page route. Full implementations live in the dedicated frontend pages
// (homepage, shop, etc.).  Replace with real components as needed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PTBlockFallback: React.FC<any> = () => null

const blockComponents: Record<string, React.FC<any>> = { // eslint-disable-line @typescript-eslint/no-explicit-any
  // Generic Payload blocks
  archive:   ArchiveBlock,
  content:   ContentBlock,
  cta:       CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,

  // PT-specific blocks (full renders handled in dedicated page components)
  ptHeroSection:         PTBlockFallback,
  ptTrustStrip:          PTBlockFallback,
  ptFeaturedProducts:    PTBlockFallback,
  ptProcessBanner:       PTBlockFallback,
  ptBenefitCards:        PTBlockFallback,
  ptTestimonialsSection: PTBlockFallback,
  ptNewsletterBand:      PTBlockFallback,
  ptFAQSection:          PTBlockFallback,
  ptEmptyState:          PTBlockFallback,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
