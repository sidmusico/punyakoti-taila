/** Human-readable delivery window (matches checkout copy). */
export function formatDeliveryEta(minDays: number, maxDays: number, noteSuffix?: string | null): string {
  const fmt = (offset: number) =>
    new Date(Date.now() + offset * 86_400_000).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  const range = minDays === maxDays ? fmt(minDays) : `${fmt(minDays)} – ${fmt(maxDays)}`
  const suffix = noteSuffix?.trim()
  return suffix ? `${range} ${suffix}` : range
}
