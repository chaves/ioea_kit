-- Migration: Add waitlisted column to call_submissions
-- Date: 2026-02-10
-- Description: Support "liste d'attente" (waitlist) status for submissions

ALTER TABLE `call_submissions` ADD COLUMN `waitlisted` tinyint(1) NOT NULL DEFAULT 0 AFTER `accepted`;
