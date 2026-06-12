import { redirect } from 'next/navigation'

/** Legacy/CMS-linked route — order history lives on the account Orders tab. */
export default function AccountOrdersRedirect() {
  redirect('/account?tab=orders')
}
