/**
 * Pure helpers for URL-driven PLP filters.
 * Filter state lives in the URL search params so the page can be a Server Component.
 */

export const PLP_PAGE_SIZE = 6

export const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: low → high', value: 'price-asc' },
  { label: 'Price: high → low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
] as const
export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export interface PlpFilters {
  cat: string                // category slug, '' = All
  sizes: string[]            // variant size values
  uses: string[]             // useCase values
  priceMin: number | null
  priceMax: number | null
  sort: SortValue
  page: number
}

export function parseFilters(sp: Record<string, string | string[] | undefined>): PlpFilters {
  const get = (k: string): string => {
    const v = sp[k]
    if (typeof v === 'string') return v
    if (Array.isArray(v)) return v[0] ?? ''
    return ''
  }
  const list = (k: string): string[] => {
    const v = get(k)
    return v ? v.split(',').filter(Boolean) : []
  }
  const sort = (get('sort') || 'featured') as SortValue
  const page = Math.max(1, parseInt(get('page') || '1', 10) || 1)
  const min = get('min')
  const max = get('max')
  return {
    cat: get('cat'),
    sizes: list('sizes'),
    uses: list('uses'),
    priceMin: min ? Number(min) : null,
    priceMax: max ? Number(max) : null,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'featured',
    page,
  }
}

export function buildHref(filters: PlpFilters, patch: Partial<PlpFilters>, basePath = '/shop'): string {
  const f = { ...filters, ...patch }
  const p = new URLSearchParams()
  if (f.cat) p.set('cat', f.cat)
  if (f.sizes.length) p.set('sizes', f.sizes.join(','))
  if (f.uses.length) p.set('uses', f.uses.join(','))
  if (f.priceMin != null) p.set('min', String(f.priceMin))
  if (f.priceMax != null) p.set('max', String(f.priceMax))
  if (f.sort && f.sort !== 'featured') p.set('sort', f.sort)
  // page only included when > 1 (load-more) and only if a patch sets it explicitly
  if (patch.page != null && f.page > 1) p.set('page', String(f.page))
  const q = p.toString()
  return q ? `${basePath}?${q}` : basePath
}

export function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function countActiveFilters(f: PlpFilters): number {
  return (
    (f.cat ? 1 : 0) +
    f.sizes.length +
    f.uses.length +
    (f.priceMin != null || f.priceMax != null ? 1 : 0)
  )
}

export const EMPTY_FILTERS: PlpFilters = {
  cat: '',
  sizes: [],
  uses: [],
  priceMin: null,
  priceMax: null,
  sort: 'featured',
  page: 1,
}
