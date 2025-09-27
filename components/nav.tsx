"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Nav() {
  const pathname = usePathname()
  const linkClass = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      pathname === href
        ? "bg-(--color-primary) text-(--color-primary-foreground)"
        : "border border-(--color-border) bg-(--color-secondary) text-(--color-secondary-foreground) hover:bg-(--color-accent)"
    }`

  return (
    <nav className="sticky top-0 z-10 border-b border-(--color-border) bg-(--color-background)/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-3">
        <div className="text-sm font-semibold">Announcement Demo</div>
        <div className="flex gap-2">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link href="/reports" className={linkClass("/reports")}>
            Reports
          </Link>
        </div>
      </div>
    </nav>
  )
}
