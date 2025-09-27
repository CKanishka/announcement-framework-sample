"use client"

import * as React from "react"
import type { AnnouncementConfig } from "./announcement-service"

type Props = {
  config: AnnouncementConfig
  onOk: (id: string) => Promise<void> | void
  onCancel: (id: string) => void
}

export function AnnouncementModal({ config, onOk, onCancel }: Props) {
  const { modalProps } = config
  const title = modalProps?.title ?? "Announcement"
  const description = modalProps?.description
  const okText = modalProps?.okText ?? "OK"
  const cancelText = modalProps?.cancelText ?? "Not now"
  const hideCancel = !!modalProps?.hideCancel

  React.useEffect(() => {
    // Prevent background scroll
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
    >
      <div className="absolute inset-0 bg-black/50" onClick={() => onCancel(config.id)} aria-hidden="true" />
      <div className="relative mx-4 w-full max-w-lg rounded-lg border border-(--color-border) bg-(--color-card) text-(--color-card-foreground) shadow-lg">
        <div className="flex items-start justify-between p-4">
          <div>
            <h2 id="announcement-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-(--color-muted-foreground)">{description}</p> : null}
          </div>
          <button
            onClick={() => onCancel(config.id)}
            aria-label="Close"
            className="ml-4 rounded-md p-1 text-(--color-muted-foreground) hover:bg-(--color-accent) hover:text-(--color-accent-foreground)"
          >
            ×<span className="sr-only">Close</span>
          </button>
        </div>

        <div className="px-4 pb-4">
          {/* Render arbitrary React content */}
          <div className="prose prose-sm max-w-none text-(--color-foreground)">{config.content}</div>
        </div>

        <div className="flex justify-end gap-2 border-t border-(--color-border) bg-(--color-popover) px-4 py-3">
          {!hideCancel && (
            <button
              onClick={() => onCancel(config.id)}
              className="inline-flex items-center rounded-md border border-(--color-border) bg-(--color-secondary) px-3 py-2 text-sm font-medium text-(--color-secondary-foreground) hover:bg-(--color-accent)"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => onOk(config.id)}
            className="inline-flex items-center rounded-md border border-transparent bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  )
}
