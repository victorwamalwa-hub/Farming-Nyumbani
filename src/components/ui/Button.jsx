import { Link } from 'react-router-dom'

const VARIANT_CLASSES = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  accent: 'bg-accent text-white hover:bg-accent-dark',
  outline: 'border border-line bg-surface text-ink hover:border-primary hover:text-primary',
}

const SIZE_CLASSES = {
  md: 'px-4 py-2',
  lg: 'px-5 py-3',
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center rounded-lg font-semibold transition-colors',
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
    className,
  ].filter(Boolean).join(' ')

  if (to) {
    return <Link className={classes} to={to} {...props}>{children}</Link>
  }

  if (href) {
    return <a className={classes} href={href} {...props}>{children}</a>
  }

  return <button className={classes} type={type} {...props}>{children}</button>
}
