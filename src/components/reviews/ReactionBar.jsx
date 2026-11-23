import { hasReacted, reactionCounts } from '../../services/engagement'

const EMOJI = ['👍', '🌱', '💧', '❤️']

export default function ReactionBar({
  targetId,
  targetLabel,
  reactions = [],
  actor,
  onToggle,
  disabled,
}) {
  const counts = reactionCounts(reactions)
  const isDisabled = disabled || !actor

  return (
    <div className="flex flex-wrap gap-2" aria-label={`Reactions for ${targetLabel}`}>
      {EMOJI.map((emoji) => {
        const pressed = actor ? hasReacted(reactions, emoji, actor) : false
        return (
          <button
            key={emoji}
            type="button"
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm ${
              pressed
                ? 'border-primary bg-primary-tint text-primary-dark'
                : 'border-line bg-surface text-muted'
            } disabled:opacity-50`}
            aria-label={`${pressed ? 'Remove' : 'Add'} ${emoji} reaction to ${targetLabel}`}
            aria-pressed={pressed}
            disabled={isDisabled}
            onClick={() => onToggle({ targetId, emoji })}
          >
            <span aria-hidden="true">{emoji}</span>
            <span>{counts[emoji] ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}
