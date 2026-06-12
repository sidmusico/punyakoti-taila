import { redirect } from 'next/navigation'

/** Legacy/CMS-linked route — subscriptions live on the account Subscriptions tab. */
export default function AccountSubscriptionsRedirect() {
  redirect('/account?tab=subscriptions')
}
