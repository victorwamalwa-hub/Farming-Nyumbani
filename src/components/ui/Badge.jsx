const TONE_CLASSES = {
  neutral: 'bg-paper text-muted',
  primary: 'bg-primary-tint text-primary-dark',
  warning: 'bg-warning/10 text-warning',
  accent: 'bg-accent-tint text-accent-dark',
}

export default function Badge({ children, tone = 'neutral' }) {
  const toneClasses = TONE_CLASSES[tone] ?? TONE_CLASSES.neutral

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses}`}>
      {children}
    </span>
  )
}
