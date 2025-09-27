"use client"

import * as React from "react"
import { useAnnouncement, type AnnouncementConfig } from "./announcement-provider"

export function DemoAnnouncementPanel() {
  const {
    showAnnouncement,
    updateAnnouncementConfig,
    getAnnouncementStats,
    resetAnnouncementTracking,
    canShowAnnouncement,
  } = useAnnouncement()

  const [lastStats, setLastStats] = React.useState<string>("")

  // Simple route-agnostic announcement
  const showDashboardWelcome = () => {
    const config: AnnouncementConfig = {
      id: "sample-announcement-v1",
      content: (
        <div className="space-y-2">
          <p className="text-pretty">This is a sample announcement.</p>
          <p className="text-pretty">You can customize the content, title, and behavior.</p>
        </div>
      ),
      modalProps: {
        title: "Announcement",
        description: "A simple example using the Announcement system.",
        okText: "OK",
        cancelText: "Dismiss",
      },
      maxViewCount: 3,
      showDelay: 0,
      onOk: () => true, // close on OK
      onDismiss: () => false, // not permanent unless you design it so
    }
    showAnnouncement(config)
    setLastStats(JSON.stringify(getAnnouncementStats(config.id), null, 2))
  }

  // Force show anywhere (ignores limits/target)
  const forceShowAnywhere = () => {
    const config: AnnouncementConfig = {
      id: "force-override-v1",
      content: <div>Admin override: This is visible anywhere for testing.</div>,
      modalProps: {
        title: "Force Show",
        okText: "Close",
        cancelText: "Dismiss",
      },
      onDismiss: () => false,
      onOk: () => true,
    }
    showAnnouncement(config, true)
    setLastStats(JSON.stringify(getAnnouncementStats(config.id), null, 2))
  }

  // Two-step announcement
  const [step, setStep] = React.useState(1)
  const startTwoStep = () => {
    setStep(1)
    const step1: AnnouncementConfig = {
      id: "feature-two-step-v1",
      content: (
        <div>
          <p className="mb-2 font-medium">Introducing Email Automation</p>
          <p>Set up in minutes. Click Next to review changes.</p>
        </div>
      ),
      modalProps: { title: "New Feature", okText: "Next" },
      onOk: () => {
        setStep(2)
        return false // do not close, move to next step
      },
      onDismiss: () => false,
    }
    showAnnouncement(step1)
  }

  React.useEffect(() => {
    if (step !== 2) return
    updateAnnouncementConfig({
      id: "feature-two-step-v1",
      content: (
        <div>
          <p className="mb-2 font-medium">Review and Accept</p>
          <ul className="list-disc pl-5">
            <li>No disruption to current campaigns</li>
            <li>Can be reverted anytime</li>
          </ul>
        </div>
      ),
      modalProps: { title: "Confirm Upgrade", okText: "Accept and Upgrade", cancelText: "Cancel" },
      onOk: () => true, // close on final step
      onDismiss: (afterOk) => afterOk === true, // permanently dismiss if accepted
    })
  }, [step, updateAnnouncementConfig])

  const checkIfDashboardWouldShow = () => {
    const cfg: AnnouncementConfig = {
      id: "sample-announcement-v1",
      content: <div />,
    }
    const can = canShowAnnouncement(cfg)
    alert(`canShowAnnouncement() = ${String(can)}`)
  }

  const resetDashboardAnnouncement = () => {
    resetAnnouncementTracking("sample-announcement-v1")
    setLastStats('Reset tracking for "sample-announcement-v1"')
  }

  return (
    <div className="rounded-lg border border-(--color-border) bg-(--color-card) p-4 text-(--color-card-foreground)">
      <h3 className="text-balance text-lg font-semibold">Announcement Demo</h3>
      <p className="mt-1 text-sm text-(--color-muted-foreground)">
        Click the button below to show a sample announcement.
      </p>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <button
          onClick={showDashboardWelcome}
          className="rounded-md bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
        >
          Show Announcement
        </button>
      </div>

      <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-(--color-muted) p-3 text-xs text-(--color-muted-foreground)">
        {lastStats || "Stats will appear here after showing an announcement."}
      </pre>
    </div>
  )
}
