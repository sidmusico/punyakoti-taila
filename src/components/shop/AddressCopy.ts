import type { Account } from '@/payload-types'

/**
 * Address-book copy resolved from the Payload `account` global (Addresses tab),
 * with hard fallbacks so the storefront renders before the CMS is populated.
 */
export type AddressCopy = ReturnType<typeof resolveAddressCopy>

type AccountGroup = NonNullable<Account['account']>

export function resolveAddressCopy(account?: AccountGroup | null) {
  const a = account ?? {}
  return {
    title: a.addressesTitle ?? 'Addresses',
    subtitle: a.addressesSubtitle ?? 'Save your delivery and billing addresses for faster checkout.',
    cardTitle: a.addressesCardTitle ?? 'Addresses',
    manageLabel: a.manageAddressesLabel ?? 'Manage',
    addLabel: a.addAddressLabel ?? 'Add address',
    addFirstLabel: a.addFirstAddressLabel ?? 'Add your first address',
    editLabel: a.editAddressLabel ?? 'Edit',
    deleteLabel: a.deleteAddressLabel ?? 'Delete',
    saveLabel: a.saveAddressLabel ?? 'Save address',
    cancelLabel: a.cancelLabel ?? 'Cancel',
    setDefaultShippingLabel: a.setDefaultShippingLabel ?? 'Set as default shipping',
    setDefaultBillingLabel: a.setDefaultBillingLabel ?? 'Set as default billing',
    defaultShippingBadge: a.defaultShippingBadge ?? 'Default shipping',
    defaultBillingBadge: a.defaultBillingBadge ?? 'Default billing',
    billingSameLabel: a.billingSameLabel ?? 'Billing address is the same as my shipping address',
    emptyMessage: a.emptyAddressesMessage ?? "You haven't saved any addresses yet.",
    deleteConfirm: a.deleteAddressConfirm ?? 'Remove this address from your account?',
    newFormTitle: a.newAddressFormTitle ?? 'New address',
    editFormTitle: a.editAddressFormTitle ?? 'Edit address',
    fields: {
      nickname: a.fieldLabelNickname ?? 'Nickname (optional)',
      fullName: a.fieldLabelFullName ?? 'Full name',
      phone: a.fieldLabelPhone ?? 'Phone',
      line1: a.fieldLabelLine1 ?? 'Address line 1',
      line2: a.fieldLabelLine2 ?? 'Address line 2 (optional)',
      landmark: a.fieldLabelLandmark ?? 'Landmark (optional)',
      city: a.fieldLabelCity ?? 'City',
      state: a.fieldLabelState ?? 'State',
      pincode: a.fieldLabelPincode ?? 'Pincode',
      country: a.fieldLabelCountry ?? 'Country',
    },
    checkoutUseSavedLabel: a.checkoutUseSavedLabel ?? 'Use a saved address',
    checkoutUseNewLabel: a.checkoutUseNewLabel ?? '+ Use a new address',
  }
}
