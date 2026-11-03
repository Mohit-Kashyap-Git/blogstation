import { Link } from 'react-router'

const base =
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary:
    'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
  ghost:
    'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    light: 'bg-white text-indigo-700 hover:bg-indigo-100', 
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

// Renders a <Link> when `to` is given, otherwise a <button>.
function Button({ to, variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (to) return <Link to={to} className={classes} {...props} />
  return <button type={type} className={classes} {...props} />
}

export default Button