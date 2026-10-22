import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1120px] flex-col items-start justify-center px-6">
      <div className="text-[13px] font-semibold text-accent">404</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em]">This page doesn't exist.</h1>
      <Link to="/" className="link-grow mt-6 text-[15px] font-semibold text-accent">
        Back to home
      </Link>
    </section>
  )
}
