export default function Spinner({ label = 'Loading' }) {
  return (
    <p className="section py-10 text-muted" role="status">
      {label}…
    </p>
  )
}
