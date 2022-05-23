export function generateRandomId(text: string): string {
  return Math.random().toString(36).slice(2) + text
}