export interface Mood {
  emoji: string
  label: string
}

export const MOODS: Mood[] = [
  { emoji: '😣', label: 'schlecht' },
  { emoji: '😐', label: 'okay' },
  { emoji: '🙂', label: 'gut' },
  { emoji: '😄', label: 'super' },
]

/** Liefert das passende Emoji zu einem (frei eingegebenen) Stimmungs-Label. */
export function moodEmoji(label: string | undefined): string {
  if (!label) return ''
  return MOODS.find((m) => m.label === label.trim().toLowerCase())?.emoji ?? ''
}
