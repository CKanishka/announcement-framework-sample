"use client";

import * as React from "react";
import {
  useAnnouncement,
  type AnnouncementConfig,
} from "./announcement-provider";
import Image from "next/image";

const simpleAnnouncementId = "simple-announcement-v1";
const twoStepAnnouncementId = "two-step-announcement-v1";

export function DemoAnnouncementPanel() {
  const {
    showAnnouncement,
    updateAnnouncementConfig,
    getAnnouncementStats,
    resetAnnouncementTracking,
  } = useAnnouncement();

  const [lastStats, setLastStats] = React.useState<string>("");

  const showSimpleAnnouncement = () => {
    const config: AnnouncementConfig = {
      id: simpleAnnouncementId,
      content: (
        <div className="space-y-2">
          <p className="text-pretty">
            Welcome to your new dashboard! Here's what changed, new charts, and
            more.
          </p>
          <Image
            src="/dashboard-v2.png"
            alt="Dashboard"
            width={500}
            height={500}
          />
        </div>
      ),
      modalProps: {
        title: "Feature Announcement",
        okText: "OK",
        cancelText: "Dismiss",
      },
      maxViewCount: 3,
      showDelay: 0,
      onOk: () => true, // close on OK
      onDismiss: () => false, // not permanent unless you design it so
    };
    showAnnouncement(config);
    setLastStats(JSON.stringify(getAnnouncementStats(config.id), null, 2));
  };

  const moveToStep2 = () => {
    updateAnnouncementConfig({
      id: twoStepAnnouncementId,
      content: (
        <div className="space-y-2">
          <ul className="list-disc pl-5">
            <li>No disruption to current analytics</li>
            <li>Can be reverted to previous version</li>
            <li>Existing reports will remain accessible</li>
          </ul>
        </div>
      ),
      modalProps: {
        title: "Review and Accept",
        okText: "Confirm Upgrade",
        cancelText: "Cancel",
      },
      onOk: () => true, // close on final step
    });
  };

  const showTwoStepAnnouncement = () => {
    const step1Config: AnnouncementConfig = {
      id: twoStepAnnouncementId,
      content: (
        <div className="space-y-2">
          <p className="font-medium">Introducing Web Analytics</p>
          <p>
            All new analytics dashboard, built to track your website traffic.
            Click Next to review changes.
          </p>
          <Image
            src="/analytics-step1.png"
            alt="Analytics Step 1"
            width={500}
            height={500}
          />
        </div>
      ),
      modalProps: { title: "New Feature", okText: "Next" },
      onOk: () => {
        moveToStep2();
        return false; // do not close, move to next step
      },
      onDismiss: () => false,
    };
    showAnnouncement(step1Config);
  };

  const resetDashboardAnnouncement = () => {
    resetAnnouncementTracking(simpleAnnouncementId);
    resetAnnouncementTracking(twoStepAnnouncementId);
    setLastStats("Announcements reset");
  };

  return (
    <div className="rounded-lg border border-(--color-border) bg-(--color-card) p-4 text-(--color-card-foreground)">
      <h3 className="text-balance text-lg font-semibold">Announcement Demo</h3>
      <p className="mt-1 text-sm text-(--color-muted-foreground)">
        Click the button below to show a sample announcement.
      </p>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <button
          onClick={showSimpleAnnouncement}
          className="rounded-md bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
        >
          Show Announcement
        </button>
        <button
          className="rounded-md bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
          onClick={showTwoStepAnnouncement}
        >
          Show multi-step announcement
        </button>
        <button
          className="rounded-md bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
          onClick={resetDashboardAnnouncement}
        >
          Reset Announcement
        </button>
      </div>

      <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-(--color-muted) p-3 text-xs text-(--color-muted-foreground)">
        {lastStats || "Stats will appear here after showing an announcement."}
      </pre>
    </div>
  );
}
