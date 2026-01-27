# Session Dates Configuration

## Overview

Session dates (e.g., "6-10 May 2026") are now stored as dynamic configuration in the `site_config` database table instead of being hardcoded in the application.

## Date: 2026-01-27

## Database Configuration

### New Configuration Keys

Added to `site_config` table with category `'session'`:

| Key | Value (2026) | Description |
|-----|--------------|-------------|
| `session.year` | `2026` | Current session year |
| `session.startDate` | `6` | Start day of month |
| `session.endDate` | `10` | End day of month |
| `session.month` | `May` | Month name |
| `session.dateRange` | `6-10 May` | Short date range format |
| `session.fullDateRange` | `6-10 May 2026` | Full date range with year |

### SQL Migration

```sql
-- Execute: scripts/add-session-dates-config.sql
INSERT INTO site_config (`key`, `value`, `category`) VALUES
('session.year', '2026', 'session'),
('session.startDate', '6', 'session'),
('session.endDate', '10', 'session'),
('session.month', 'May', 'session'),
('session.dateRange', '6-10 May', 'session'),
('session.fullDateRange', '6-10 May 2026', 'session')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated` = CURRENT_TIMESTAMP;
```

## Code Changes

### 1. Configuration Interface (`src/lib/server/config.ts`)

Added `session` to `DynamicConfig` interface:

```typescript
interface DynamicConfig {
  session: {
    year: number;
    startDate: number;
    endDate: number;
    month: string;
    dateRange: string;
    fullDateRange: string;
  };
  // ... other config
}
```

### 2. Configuration Loader (`src/lib/server/config.ts`)

Updated `loadDynamicConfig()` to load session dates from database:

```typescript
session: {
  year: parseInt(configMap.get('session.year') || '2026', 10),
  startDate: parseInt(configMap.get('session.startDate') || '6', 10),
  endDate: parseInt(configMap.get('session.endDate') || '10', 10),
  month: configMap.get('session.month') || 'May',
  dateRange: configMap.get('session.dateRange') || '6-10 May',
  fullDateRange: configMap.get('session.fullDateRange') || '6-10 May 2026'
}
```

### 3. Default Configuration (`src/lib/config.ts`)

Updated `defaultDynamicConfig` to include session dates as fallback:

```typescript
const defaultDynamicConfig = {
  session: {
    year: 2026,
    startDate: 6,
    endDate: 10,
    month: "May",
    dateRange: "6-10 May",
    fullDateRange: "6-10 May 2026",
  },
  // ... other defaults
}
```

### 4. Home Page (`src/routes/+page.svelte`)

**Before:**
```svelte
<strong>will be held in Cargèse (Corsica - France) on 12-16 May 2025.</strong>
```

**After:**
```svelte
const sessionDates = $derived(data.dynamicConfig?.session?.fullDateRange || '6-10 May 2026');

<strong>will be held in Cargèse (Corsica - France) on {sessionDates}.</strong>
```

### 5. Year Page (`src/routes/[year]/+page.svelte`)

**Before:**
```svelte
<meta name="description" content="..., 12-16 May {year} in Corsica, France." />
<h3>...Academy 12-16 May {year} in Corsica (France)</h3>
```

**After:**
```svelte
<meta name="description" content="..., {config.session.dateRange} {year} in Corsica, France." />
<h3>...Academy {config.session.dateRange} {year} in Corsica (France)</h3>
```

## How It Works

### Data Flow

1. **Database** → `site_config` table stores session dates
2. **Layout Loader** → `+layout.server.ts` calls `loadDynamicConfig()`
3. **Config Merger** → `getConfig(dynamicConfig)` merges with static config
4. **Component Access** → Pages access via `config.session.*` or `data.dynamicConfig.session.*`

### Caching

- Dynamic config is cached for 1 minute (60 seconds)
- Reduces database queries
- Cache can be cleared manually via `clearConfigCache()`

### Fallback Strategy

If database load fails:
1. Returns default values (6-10 May 2026)
2. Logs error to console
3. Application continues to work with defaults

## Usage Examples

### In Pages with Config Access

```svelte
<script>
  import { getConfig } from '$lib/config';

  let { data } = $props();
  const config = $derived(getConfig(data.dynamicConfig));
</script>

<p>Session: {config.session.fullDateRange}</p>
```

### In Pages with Direct Layout Data

```svelte
<script>
  let { data } = $props();
  const sessionDates = $derived(
    data.dynamicConfig?.session?.fullDateRange || '6-10 May 2026'
  );
</script>

<p>Session: {sessionDates}</p>
```

### In Server-Side Code

```typescript
import { loadDynamicConfig } from '$lib/server/config';

export const load = async () => {
  const config = await loadDynamicConfig();
  const sessionYear = config.session.year;
  // ...
};
```

## Updating Session Dates

### For Next Year (2027)

1. **Update database:**
   ```sql
   UPDATE site_config SET value = '2027' WHERE `key` = 'session.year';
   UPDATE site_config SET value = '5' WHERE `key` = 'session.startDate';
   UPDATE site_config SET value = '9' WHERE `key` = 'session.endDate';
   UPDATE site_config SET value = '5-9 May' WHERE `key` = 'session.dateRange';
   UPDATE site_config SET value = '5-9 May 2027' WHERE `key` = 'session.fullDateRange';
   ```

2. **Clear cache** (optional, will auto-refresh in 1 minute):
   ```typescript
   import { clearConfigCache } from '$lib/server/config';
   clearConfigCache();
   ```

3. **Restart server** for immediate effect

### Via Admin Interface (Future Enhancement)

Could create an admin page at `/auth/admin/config` to edit these values through a UI.

## Testing

Run the test script to verify configuration:

```bash
npx tsx scripts/test-session-dates-config.ts
```

Expected output:
```
✅ Session year is correct: 2026
✅ Date range is correct: 6-10 May
✅ Full date range is correct: 6-10 May 2026
```

## Benefits

### 1. Centralized Management
- All session dates in one place (database)
- No need to search and replace across multiple files
- Easy to update for new years

### 2. Dynamic Updates
- Update dates without code deployment
- Changes take effect within 1 minute (cache TTL)
- No build/compile step required

### 3. Consistency
- Single source of truth
- All pages use same dates automatically
- Reduces risk of inconsistencies

### 4. Maintainability
- Clear structure with documented keys
- Type-safe access via TypeScript
- Fallback values for robustness

## Files Modified

- ✅ `scripts/add-session-dates-config.sql` (new)
- ✅ `scripts/test-session-dates-config.ts` (new)
- ✅ `src/lib/config.ts` - Added session to defaultDynamicConfig
- ✅ `src/lib/server/config.ts` - Added session to interface and loader
- ✅ `src/routes/+page.svelte` - Use dynamic session dates
- ✅ `src/routes/[year]/+page.svelte` - Use dynamic session dates
- ✅ `SESSION_DATES_CONFIG.md` (new)

## Notes

- The session number (22nd, 23rd, etc.) is still calculated dynamically: `year - 2002 + 1`
- Static year (`config.currentYear = 2026`) remains in `src/lib/config.ts`
- This change only affects the **dates** of the session, not the year itself
- Database must be updated each year, but code changes are not required
