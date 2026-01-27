-- Migration: Create call_submissions table
-- Date: 2026-01-26
-- Description: New unified call submissions table replacing legacy call_proposals

CREATE TABLE IF NOT EXISTS `call_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `call_year` year(4) NOT NULL DEFAULT 2026,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `nationality` int(11) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `age` smallint(6) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `diploma` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `university` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `country` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `phd_ad_name` varchar(255) DEFAULT NULL,
  `phd_year` year(4) DEFAULT NULL,
  `phd_ad_mail` varchar(255) DEFAULT NULL,
  `summary` text NOT NULL,
  `cv` varchar(255) NOT NULL,
  `paper` varchar(255) NOT NULL,
  `accepted` tinyint(1) NOT NULL DEFAULT 0,
  `call_group_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `call_submissions_call_group_id_foreign` (`call_group_id`),
  KEY `call_submissions_email_index` (`email`),
  KEY `call_submissions_call_year_index` (`call_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Migrate existing data from call_proposals (if needed)
-- Uncomment to migrate:
-- INSERT INTO call_submissions (
--   call_year, last_name, first_name, nationality, gender, age, status,
--   domain, diploma, email, university, department, country,
--   title, phd_ad_name, phd_year, phd_ad_mail, summary, cv, paper,
--   created_at, updated_at
-- )
-- SELECT
--   YEAR(NOW()) as call_year,
--   last_name, first_name, nationality, gender, age, status,
--   domain, diploma, email, university, department, country,
--   phd_title as title, phd_ad_name,
--   CASE WHEN phd_year REGEXP '^[0-9]{4}$' THEN CAST(phd_year AS UNSIGNED) ELSE NULL END as phd_year,
--   phd_ad_mail, phd_summary as summary, cv, paper,
--   created as created_at, modified as updated_at
-- FROM call_proposals
-- WHERE email IS NOT NULL
--   AND last_name IS NOT NULL
--   AND first_name IS NOT NULL;
