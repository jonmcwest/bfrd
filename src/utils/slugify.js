export function slugify (string) {
  if (!string) throw new Error('string is required');
  return string.toLowerCase().trim().replace(/\s+/g, '-');
}
