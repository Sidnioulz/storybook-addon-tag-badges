export function getTagParts(tag: string): {
  prefix: string
  suffix: string | undefined
} {
  const [prefix, suffix] = tag.split(':')
  return { prefix, suffix }
}
export function getTagPrefix(tag: string): string {
  return getTagParts(tag).prefix
}
export function getTagSuffix(tag: string): string | undefined {
  return getTagParts(tag).suffix
}
