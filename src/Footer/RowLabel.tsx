'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useRowLabel<any>()

  const label =
    data?.data?.label
      ? `Link: ${data.data.label}`
      : `Row ${(data?.rowNumber ?? 0) + 1}`

  return <div>{label}</div>
}
