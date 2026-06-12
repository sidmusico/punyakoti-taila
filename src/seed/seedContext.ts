/** Pass on Payload writes during CLI/HTTP seed so Next.js `revalidatePath` is skipped. */
export const seedWriteContext = { disableRevalidate: true } as const
