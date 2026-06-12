import { redirect } from 'next/navigation'

/** Legacy/CMS-linked route — saved bottles live on the account Wishlist tab. */
export default function AccountSavedRedirect() {
  redirect('/account?tab=wishlist')
}
