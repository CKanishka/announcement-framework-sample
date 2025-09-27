"use client"

import type * as React from "react"
import { AnnouncementProvider } from "@/components/announcement/announcement-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <AnnouncementProvider>{children}</AnnouncementProvider>
}
