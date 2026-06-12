export type TestimonialSeedRow = {
  customerName: string
  customerLocation: string
  title: string
  body: string
  rating: number
  /** ImageKit media alt (`people/portrait-…`). */
  photoAlt: string
  featuredOnHome: boolean
  status: 'approved' | 'pending' | 'rejected'
}

export const TESTIMONIALS_CATALOG: TestimonialSeedRow[] = [
  {
    customerName: 'Lakshmi V.',
    customerLocation: 'Bangalore · Sesame · 6 orders',
    title: 'Grandmother in the room',
    body: "I'd forgotten what real sesame smells like. The first dosa I made with this brought my grandmother into the room.",
    rating: 5,
    photoAlt: 'people/portrait-middle-aged-woman-sophisticated',
    featuredOnHome: true,
    status: 'approved',
  },
  {
    customerName: 'Karthik R.',
    customerLocation: 'Mumbai · Subscriber · 14 months',
    title: 'The village on the bottle',
    body: 'The origin village printed on the bottle is the one I grew up next to. That detail did it.',
    rating: 5,
    photoAlt: 'people/portrait-young-professional-man',
    featuredOnHome: true,
    status: 'approved',
  },
  {
    customerName: 'Anisha M.',
    customerLocation: 'Chennai · Coconut · 9 orders',
    title: 'Never going back to supermarket oil',
    body: "I've stopped buying the supermarket coconut oil. The colour, the cling, even how it solidifies — it's just different.",
    rating: 5,
    photoAlt: 'people/portrait-young-woman-glowing-skin',
    featuredOnHome: true,
    status: 'approved',
  },
  {
    customerName: 'Priya S.',
    customerLocation: 'Hyderabad · Groundnut · 4 orders',
    title: 'Sunday breakfast again',
    body: 'We switched the groundnut oil for our Sunday pongal. My father said it tastes like the mill near our old house.',
    rating: 5,
    photoAlt: 'people/portrait-young-mother-gentle-smile',
    featuredOnHome: true,
    status: 'approved',
  },
  {
    customerName: 'Ramesh K.',
    customerLocation: 'Coimbatore · Mustard · 11 orders',
    title: 'Worth the wait',
    body: 'The mustard has a slow heat that builds — not the sharp bite from refined bottles. I use less and taste more.',
    rating: 5,
    photoAlt: 'people/portrait-elderly-man-dignified',
    featuredOnHome: true,
    status: 'approved',
  },
]
