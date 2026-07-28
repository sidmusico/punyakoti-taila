import type { Customer } from '@/payload-types'

export type CustomerAddress = NonNullable<Customer['addresses']>[number]

const DEFAULT_KEYS = ['isDefaultShipping', 'isDefaultBilling'] as const

/**
 * Keep an address book consistent after a write:
 *  - at most one row carries each default flag (the just-edited `targetIndex` wins),
 *  - if a book is non-empty but has no default for a flag, the first row becomes it,
 * so checkout always has a shipping + billing address to prefill.
 *
 * Mutates and returns the same array.
 */
export function normalizeDefaults(list: CustomerAddress[], targetIndex: number | null): CustomerAddress[] {
  for (const key of DEFAULT_KEYS) {
    // A row the user explicitly set as default takes precedence.
    if (targetIndex != null && list[targetIndex]?.[key]) {
      list.forEach((a, i) => {
        if (i !== targetIndex) a[key] = false
      })
    }
    if (!list.length) continue
    if (!list.some((a) => a[key])) {
      list[0]![key] = true
    } else {
      let seen = false
      for (const a of list) {
        if (a[key]) {
          if (seen) a[key] = false
          else seen = true
        }
      }
    }
  }
  return list
}
