# Site Configuration System

## Overview
The IOEA site now uses a database-backed configuration system for emails, deadlines, and application settings. This allows you to update these values without code changes or redeployment.

## Accessing the Configuration Editor

1. Navigate to: **`/program-admin/login`**
2. Enter the program admin password
3. Click on **"Config"** in the sidebar
4. You'll see all editable configuration values grouped by category

## Available Configuration Settings

### Email Addresses
- `email.general` - Main contact email for the site
- `email.coordination` - Coordination team email
- `email.webmaster` - Webmaster contact email

### General Deadlines
- `deadline.application` - Application submission deadline
- `deadline.notification` - Notification date for applicants
- `deadline.registration` - Registration deadline for accepted participants
- `deadline.students` - Student-specific deadline

### Application Deadlines
**First Round:**
- `applicationDeadline.first.date` - First application deadline date
- `applicationDeadline.first.notificationDate` - Notification date for first round
- `applicationDeadline.first.active` - Enable/disable first deadline (true/false)

**Second Round:**
- `applicationDeadline.second.date` - Second application deadline date
- `applicationDeadline.second.notificationDate` - Notification date for second round
- `applicationDeadline.second.active` - Enable/disable second deadline (true/false)

### Registration Deadline
- `registrationDeadline.date` - Final registration deadline
- `registrationDeadline.active` - Enable/disable registration deadline (true/false)

## How to Edit Configuration

1. In the Config page, find the setting you want to change
2. Click the **"Edit"** button next to that setting
3. For text values: Type the new value in the input field
4. For boolean values: Select "Enabled (true)" or "Disabled (false)" from the dropdown
5. Click **"Save"** to apply the change
6. Changes take effect immediately across the entire site

## Date Format Guidelines

- Use human-readable date formats
- Examples: "March 31", "April 4", "April 27th 2026"
- Consistency recommended but not required

## Boolean Values

- Must be exactly `true` or `false` (lowercase)
- Shown as "Enabled" or "Disabled" badges in the interface
- Use the dropdown selector when editing

## Technical Details

### Database Table
Configuration is stored in the `site_config` table with:
- `key`: Unique identifier (e.g., "email.general")
- `value`: The configuration value (stored as TEXT)
- `category`: Grouping category for organization
- `updated`: Auto-updated timestamp

### Caching
- Configuration is cached for 1 minute to reduce database load
- Cache is automatically cleared when you save changes
- This means updates appear immediately but reads are optimized

### Scripts

**Initialize/Re-seed configuration:**
```bash
npx tsx scripts/init-site-config.ts
```

**Verify configuration data:**
```bash
npx tsx scripts/verify-config.ts
```

## For Developers

### Using Configuration in Code

**In Svelte components (with layout data):**
```typescript
import { getConfig } from '$lib/config';

// In component with access to parent layout data
let { data } = $props();
const config = getConfig(data.dynamicConfig);

// Use config values
console.log(config.emails.general);
console.log(config.deadlines.application);
```

**In server-side code:**
```typescript
import { loadDynamicConfig } from '$lib/server/config';

export const load: PageServerLoad = async () => {
  const dynamicConfig = await loadDynamicConfig();
  return { dynamicConfig };
};
```

**Static configuration (non-editable):**
```typescript
import { staticConfig } from '$lib/config';

// Access static values like current year, bad sessions, etc.
console.log(staticConfig.currentYear); // 2026
console.log(staticConfig.archiveToYear); // 2025
```

## Troubleshooting

**500 Error when loading pages:**
- Ensure the `site_config` table exists in the database
- Run `npx tsx scripts/init-site-config.ts` to create/seed the table
- Check that all configuration keys are present in the database

**Changes not appearing:**
- Configuration is cached for 1 minute
- Saving via the admin interface clears the cache automatically
- Manual database changes require waiting 1 minute or restarting the server

**Missing configuration values:**
- Default values are used if database values are missing
- Re-run the init script to restore missing values
- Check the console for error messages
