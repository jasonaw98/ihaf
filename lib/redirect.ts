/** Only allow same-site relative paths, so `next` can't send people off-site. */
export function safeNext(
  value: FormDataEntryValue | string | null | undefined,
) {
  if (typeof value !== "string") return "/events";
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return "/events";
  }
  return value;
}
