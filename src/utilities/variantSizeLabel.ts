/**
 * Maps a product variant `size` value to the admin-configured label (PDP global).
 */
export function labelForVariantSize(
  size: string | null | undefined,
  rows:
    | { sizeValue?: string | null; label?: string | null }[]
    | null
    | undefined,
): string {
  if (!size) return ''
  const row = rows?.find((r) => r?.sizeValue === size)
  const label = row?.label?.trim()
  return label || size
}
