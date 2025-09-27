"use client";

import type React from "react";

export interface AnnouncementTrackingData {
  viewedCount: number;
  lastShownAt?: number;
  dismissed?: boolean;
  dismissedAt?: number;
}

export type ModalProps = {
  title?: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  hideCancel?: boolean;
};

export type AnnouncementConfig = {
  id: string;
  content: React.ReactNode;
  modalProps?: ModalProps;
  maxViewCount?: number;
  showDelay?: number;
  targetPath?: string | RegExp;
  condition?: () => boolean;
  onShow?: () => void;
  onOk?: () => Promise<boolean> | boolean | void;
  onDismiss?: (dismissedAfterOk?: boolean) => boolean | void;
};

const ANNOUNCEMENT_TRACKING_DATA_LS_KEY = "__announcement_tracking_v1__";

type StorageShape = Record<string, AnnouncementTrackingData>;

class AnnouncementService {
  private static _instance: AnnouncementService | null = null;
  static get instance() {
    if (!AnnouncementService._instance) {
      AnnouncementService._instance = new AnnouncementService();
    }
    return AnnouncementService._instance;
  }

  private storage: StorageShape = {};

  private constructor() {
    this.loadFromStorage();
  }

  private isBrowser() {
    return typeof window !== "undefined";
  }

  private saveToStorage(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(
        ANNOUNCEMENT_TRACKING_DATA_LS_KEY,
        JSON.stringify(this.storage)
      );
    } catch (error) {
      console.error("[AnnouncementService] Failed to save:", error);
    }
  }

  private loadFromStorage(): void {
    if (!this.isBrowser()) return;
    try {
      const stored = localStorage.getItem(ANNOUNCEMENT_TRACKING_DATA_LS_KEY);
      if (stored) {
        this.storage = JSON.parse(stored) ?? {};
      }
    } catch (error) {
      console.error("[AnnouncementService] Failed to load:", error);
      this.storage = {};
    }
  }

  private getTrackingData(announcementId: string): AnnouncementTrackingData {
    return (
      this.storage[announcementId] ?? {
        viewedCount: 0,
      }
    );
  }

  public recordAnnouncementShown(announcementId: string): void {
    console.log("recordAnnouncementShown", announcementId);
    const trackingData = this.getTrackingData(announcementId);
    this.storage[announcementId] = {
      ...trackingData,
      viewedCount: trackingData.viewedCount + 1,
      lastShownAt: Date.now(),
    };
    this.saveToStorage();
  }

  public recordAnnouncementDismissed(
    announcementId: string,
    permanent = false
  ): void {
    const trackingData = this.getTrackingData(announcementId);
    this.storage[announcementId] = {
      ...trackingData,
      dismissed: permanent,
      dismissedAt: Date.now(),
    };
    this.saveToStorage();
  }

  public canShowAnnouncement(announcement: AnnouncementConfig): boolean {
    const trackingData = this.getTrackingData(announcement.id);

    if (trackingData.dismissed) return false;

    const maxViewCount = announcement.maxViewCount ?? 3;
    if (trackingData.viewedCount >= maxViewCount) return false;

    if (typeof announcement.condition === "function") {
      try {
        if (!announcement.condition()) return false;
      } catch {
        // If condition throws, be safe and do not show
        return false;
      }
    }

    if (announcement.targetPath) {
      if (!this.isBrowser()) return false;
      const currentPath = window.location.pathname;
      if (announcement.targetPath instanceof RegExp) {
        if (!announcement.targetPath.test(currentPath)) return false;
      } else if (!currentPath.includes(announcement.targetPath)) {
        return false;
      }
    }

    return true;
  }

  public getAnnouncementStats(
    announcementId: string
  ): AnnouncementTrackingData {
    return this.getTrackingData(announcementId);
  }

  public resetAnnouncementTracking(announcementId: string): void {
    delete this.storage[announcementId];
    this.saveToStorage();
  }
}

export const announcementService = AnnouncementService.instance;
