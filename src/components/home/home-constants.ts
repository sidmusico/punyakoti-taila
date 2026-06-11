import type { OilVariant } from '@/components/ui/pt/Bottle'

export type FallbackProduct = {
  id: number
  slug: string
  name: string
  oilVariant: OilVariant
  badge: string | null
  price: number
  size: string
}

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  { id: 1, slug: 'sesame-oil', name: 'Sesame · Til', oilVariant: 'sesame', badge: 'Best seller', price: 420, size: '500 ml' },
  { id: 2, slug: 'coconut-oil', name: 'Virgin Coconut', oilVariant: 'coconut', badge: 'Cold-pressed', price: 480, size: '500 ml' },
  { id: 3, slug: 'groundnut-oil', name: 'Groundnut', oilVariant: 'groundnut', badge: null, price: 380, size: '500 ml' },
  { id: 4, slug: 'mustard-oil', name: 'Mustard · Sarson', oilVariant: 'mustard', badge: 'Pungent', price: 360, size: '500 ml' },
  { id: 5, slug: 'sunflower-oil', name: 'Sunflower', oilVariant: 'sunflower', badge: 'Daily cook', price: 320, size: '1 litre' },
  { id: 6, slug: 'black-sesame', name: 'Black Sesame', oilVariant: 'blackSes', badge: 'Limited', price: 680, size: '250 ml' },
]

export type FallbackTestimonial = {
  id: number
  rating: number
  body: string
  customerName: string
  customerLocation: string
  initials: string
  avatarTone: 'warm' | 'deep' | 'sun'
}

export const FALLBACK_TESTIMONIALS: FallbackTestimonial[] = [
  {
    id: 1,
    rating: 5,
    body: "I'd forgotten what real sesame smells like. The first dosa I made with this brought my grandmother into the room.",
    customerName: 'Lakshmi V.',
    customerLocation: 'Bangalore · Sesame · 6 orders',
    initials: 'LV',
    avatarTone: 'warm',
  },
  {
    id: 2,
    rating: 5,
    body: 'The batch number on the bottle matches the village I lived next to as a kid. That detail did it.',
    customerName: 'Karthik R.',
    customerLocation: 'Mumbai · Subscriber · 14 months',
    initials: 'KR',
    avatarTone: 'deep',
  },
  {
    id: 3,
    rating: 5,
    body: "I've stopped buying the supermarket coconut oil. The colour, the cling, even how it solidifies — it's just different.",
    customerName: 'Anisha M.',
    customerLocation: 'Chennai · Coconut · 9 orders',
    initials: 'AM',
    avatarTone: 'sun',
  },
]
