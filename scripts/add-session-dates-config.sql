-- Add session dates to site_config
-- These dates define when the IOEA session takes place each year

-- Session dates for 2026: 6-10 May 2026 (23rd session)
INSERT INTO site_config (`key`, `value`, `category`) VALUES
('session.year', '2026', 'session'),
('session.sessionNumber', '23', 'session'),
('session.startDate', '6', 'session'),
('session.endDate', '10', 'session'),
('session.month', 'May', 'session'),
('session.dateRange', '6-10 May', 'session'),
('session.fullDateRange', '6-10 May 2026', 'session')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated` = CURRENT_TIMESTAMP;
