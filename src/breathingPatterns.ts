export interface BreathingPhase {
  name: string
  seconds: number
  scale: number
}

export interface BreathingPattern {
  id: string
  name: string
  hint: string
  phases: [BreathingPhase, ...BreathingPhase[]]
}

export const breathingPatterns: [BreathingPattern, ...BreathingPattern[]] = [
  {
    id: 'calm',
    name: 'Sanfte Ruhe',
    hint: 'Einatmen 4s · Ausatmen 6s',
    phases: [
      { name: 'Einatmen', seconds: 4, scale: 1 },
      { name: 'Ausatmen', seconds: 6, scale: 0.5 },
    ],
  },
  {
    id: '478',
    name: 'Tiefe Entspannung',
    hint: '4-7-8 · Einatmen 4s · Halten 7s · Ausatmen 8s',
    phases: [
      { name: 'Einatmen', seconds: 4, scale: 1 },
      { name: 'Halten', seconds: 7, scale: 1 },
      { name: 'Ausatmen', seconds: 8, scale: 0.5 },
    ],
  },
  {
    id: 'box',
    name: 'Klarer Fokus',
    hint: 'Box-Atmung · Ein · Halten · Aus · Halten (je 4s)',
    phases: [
      { name: 'Einatmen', seconds: 4, scale: 1 },
      { name: 'Halten', seconds: 4, scale: 1 },
      { name: 'Ausatmen', seconds: 4, scale: 0.5 },
      { name: 'Halten', seconds: 4, scale: 0.5 },
    ],
  },
]
