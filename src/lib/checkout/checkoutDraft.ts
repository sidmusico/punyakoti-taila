/** Persist checkout wizard state in localStorage until payment succeeds. */

export type CheckoutDraftForm = {
  email: string
  phone: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export type CheckoutDraftBilling = {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export type CheckoutDraft = {
  form: CheckoutDraftForm
  billing: CheckoutDraftBilling
  billingSame: boolean
  step: number
  deliveryId: string
  leaveAtDoor: boolean
  promo: { code: string; pct: number } | null
  selectedAddressId: string | null
}

const STORAGE_KEY = 'pt-checkout-draft'

export function loadCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CheckoutDraft
  } catch {
    return null
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    /* quota / private mode */
  }
}

export function clearCheckoutDraft(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
