-- Migration: Add cancelled column to call_submissions
-- Date: 2026-03-20
-- Description: Track accepted students who later cancelled their participation

ALTER TABLE `call_submissions` ADD COLUMN `cancelled` tinyint(1) NOT NULL DEFAULT 0 AFTER `waitlisted`;
