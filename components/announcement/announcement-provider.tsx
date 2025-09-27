"use client";

import * as React from "react";
import {
  type AnnouncementConfig,
  type AnnouncementTrackingData,
  announcementService,
} from "./announcement-service";
import { AnnouncementModal } from "./announcement-modal";

type Ctx = {
  activeAnnouncement: AnnouncementConfig | null;
  showAnnouncement: (
    announcement: AnnouncementConfig,
    forceShow?: boolean
  ) => void;
  dismissAnnouncement: (announcementId: string, permanent?: boolean) => void;
  updateAnnouncementConfig: (
    announcement: Partial<AnnouncementConfig> & { id: string }
  ) => void;
  // Utilities
  canShowAnnouncement: (announcement: AnnouncementConfig) => boolean;
  getAnnouncementStats: (announcementId: string) => AnnouncementTrackingData;
  resetAnnouncementTracking: (announcementId: string) => void;
};

const AnnouncementContext = React.createContext<Ctx | null>(null);

export function AnnouncementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeAnnouncement, setActiveAnnouncement] =
    React.useState<AnnouncementConfig | null>(null);

  const showAnnouncement = React.useCallback(
    (announcement: AnnouncementConfig, forceShow?: boolean) => {
      if (forceShow) {
        announcement.onShow?.();
        setActiveAnnouncement(announcement);
        return;
      }

      if (!announcementService.canShowAnnouncement(announcement)) {
        console.warn(
          `[Announcement] "${announcement.id}" cannot be shown due to conditions or limits`
        );
        return;
      }

      const delay = announcement.showDelay || 0;
      window.setTimeout(() => {
        setActiveAnnouncement((prev) => {
          if (prev?.id !== announcement.id) {
            // this is to prevent showing the same announcement multiple times
            return announcement;
          }
          return prev;
        });
        announcementService.recordAnnouncementShown(announcement.id);
        announcement.onShow?.();
      }, delay);
    },
    []
  );

  const dismissAnnouncement = React.useCallback(
    (announcementId: string, permanent?: boolean) => {
      announcementService.recordAnnouncementDismissed(
        announcementId,
        !!permanent
      );
      setActiveAnnouncement(null);
    },
    []
  );

  const updateAnnouncementConfig = React.useCallback(
    (announcement: Partial<AnnouncementConfig> & { id: string }) => {
      setActiveAnnouncement((prev) => {
        if (!prev || prev.id !== announcement.id) return prev;
        return { ...prev, ...announcement };
      });
    },
    []
  );

  // Modal handlers combine onOk/onDismiss results with tracking
  const handleOk = React.useCallback(
    async (id: string) => {
      if (!activeAnnouncement || activeAnnouncement.id !== id) return;
      let shouldClose = true;
      try {
        const result = await activeAnnouncement.onOk?.();
        // if onOk returns false, do not close
        if (result === false) shouldClose = false;
      } catch (e) {
        // if error in onOk, do not close to let app decide
        shouldClose = false;
      }
      if (shouldClose) {
        const markPermanent =
          (activeAnnouncement.onDismiss?.(true) ?? false) === true;
        dismissAnnouncement(id, markPermanent);
      }
    },
    [activeAnnouncement, dismissAnnouncement]
  );

  const handleCancel = React.useCallback(
    (id: string) => {
      if (!activeAnnouncement || activeAnnouncement.id !== id) return;
      const markPermanent =
        (activeAnnouncement.onDismiss?.(false) ?? false) === true;
      dismissAnnouncement(id, markPermanent);
    },
    [activeAnnouncement, dismissAnnouncement]
  );

  const value: Ctx = {
    activeAnnouncement,
    showAnnouncement,
    dismissAnnouncement,
    updateAnnouncementConfig,
    canShowAnnouncement: (a) => announcementService.canShowAnnouncement(a),
    getAnnouncementStats: (id) => announcementService.getAnnouncementStats(id),
    resetAnnouncementTracking: (id) =>
      announcementService.resetAnnouncementTracking(id),
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
      {activeAnnouncement ? (
        <AnnouncementModal
          config={activeAnnouncement}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      ) : null}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncement() {
  const ctx = React.useContext(AnnouncementContext);
  if (!ctx) {
    throw new Error("useAnnouncement must be used within AnnouncementProvider");
  }
  return ctx;
}

// Re-export types for convenience
export type {
  AnnouncementConfig,
  AnnouncementTrackingData,
} from "./announcement-service";
