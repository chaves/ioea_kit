# Migration Complete: call_* Tables Modernization

## Date: 2026-01-27

## Summary

Successfully migrated the call application system from legacy structure to modern normalized database schema.

## Database Changes

### New Structure

#### 1. call_submissions (BigInt IDs)
- **Primary Key**: BigInt ID (auto-increment)
- **New Fields**:
  - `call_year` (Year) - Track applications by year
  - `title` (replaces phd_title)
  - `summary` (replaces phd_summary)
  - `accepted` (Boolean) - Acceptance status
  - `call_group_id` (BigInt) - Assignment to reviewer group
  - `created_at`, `updated_at` (Timestamps)
- **Indexes**: email, call_year, call_group_id

#### 2. call_notes (Modernized)
- **Changed**: Int → BigInt for ID
- **Field Renames**:
  - `call_id` → `call_submission_id`
  - `reviewer_id` → `call_reviewer_id`
- **New Fields**: `created_at`, `updated_at`

#### 3. call_comments (Modernized)
- **Changed**: Int → BigInt for ID
- **Fields**:
  - `call_submission_id` (BigInt)
  - `call_reviewer_id` (BigInt)
  - `created_at`, `updated_at`

#### 4. call_reviewers (Simplified)
- **Changed**: Int → BigInt for ID
- **Removed Fields**: `password`, `type`, `group`
- **New Fields**:
  - `call_group_id` (BigInt)
  - `slug` (String)
- **Note**: Authentication now uses `users` table

#### 5. call_groups (New)
- **Purpose**: Manage reviewer groups by year
- **Fields**:
  - `id` (BigInt)
  - `year` (Year)
  - `name` (String)

#### 6. call_reviewer_call_submissions (New)
- **Purpose**: Many-to-many junction table
- **Fields**:
  - `id` (BigInt)
  - `call_submission_id` (BigInt)
  - `call_reviewer_id` (BigInt)

#### 7. call_evaluation_types (New)
- **Purpose**: Define evaluation types
- **Fields**: `id` (BigInt), `name` (String)

#### 8. call_statuses (New)
- **Purpose**: Define submission statuses
- **Fields**: `id` (BigInt), `name` (String)

### Removed Tables
- `call_proposals` (legacy)
- `call_proposals_2014` through `call_proposals_2020` (archived)

## Code Changes

### Updated Files

#### 1. src/routes/call/+page.server.ts
- Changed duplicate check to use `call_submissions`
- Filters by `call_year` instead of global check
- Allows same email for different years

#### 2. src/routes/call/step3/+page.server.ts
- Uses `call_submissions.create()`
- Field mappings: `phd_title` → `title`, `phd_summary` → `summary`
- Adds `call_year`, `created_at`, `updated_at`

#### 3. src/routes/auth/reviewer/+page.server.ts
- Finds reviewer by email in `call_reviewers`
- Uses `call_reviewer_call_submissions` junction table
- Queries submissions assigned via junction table
- Updated note queries: `call_submission_id`, `call_reviewer_id`
- BigInt ID handling

#### 4. src/routes/auth/manager/+page.server.ts
- Queries `call_submissions` instead of `call_proposals`
- Loads `call_groups` data
- Updated field references
- BigInt ID handling
- Returns group names and year info

#### 5. src/lib/server/auth.ts
- Removed legacy `call_reviewers` authentication fallback
- Now uses only `users` table for authentication
- Removed references to removed fields (password, type, group)

#### 6. scripts/test-db-connection.ts
- Updated to test `call_submissions` instead of `call_proposals`

#### 7. scripts/clear-2025-data.ts
- Updated to clear `call_submissions`
- Added cleanup for `call_reviewer_call_submissions`

#### 8. scripts/test-migration.ts (New)
- Comprehensive test script
- Verifies all new table structures
- Tests BigInt ID handling
- Validates field name changes

## Benefits of New Structure

### 1. Scalability
- BigInt IDs support millions of records
- Normalized structure reduces data duplication

### 2. Flexibility
- Many-to-many relationship allows multiple reviewers per submission
- Groups by year enable better organization
- Separate evaluation types and statuses

### 3. Data Integrity
- Foreign key relationships properly defined
- Indexed fields for performance
- Timestamps for auditing

### 4. Security
- Authentication separated from reviewer table
- Password handling through users table only

## Migration Verification

✅ All tests pass (`npm run check`)
✅ Prisma schema synchronized with database
✅ Test script confirms all tables working
✅ No legacy table references in code
✅ BigInt compatibility verified

## Known Considerations

### Session IDs
- `Session.userId` remains `number` for cookie compatibility
- BigInt IDs converted to Number for session storage
- No impact on functionality (IDs within Number.MAX_SAFE_INTEGER)

### Email Per Year
- New system allows same email to apply in different years
- Checked via `call_year` field
- Better for recurring applicants

### Reviewer Groups
- Old `reviewer_group` (TinyInt 0-255) → `call_group_id` (BigInt, nullable)
- Groups now managed via `call_groups` table
- Must be assigned through junction table

## Next Steps

### For Development
1. ✅ Schema updated
2. ✅ Code migrated
3. ✅ Tests passing
4. ✅ Documentation complete

### For Production
1. Database already updated by user
2. Deploy updated code
3. Test application flow:
   - Submit new application (Steps 1-3)
   - Review interface (assign to reviewers)
   - Manager interface (view scores)
4. Verify email notifications
5. Test reviewer assignment workflow

## Rollback (If Needed)

If issues occur:
1. Revert code changes in git
2. Database structure already updated - no rollback needed
3. Contact DBA for data restoration if necessary

## Files Changed

- ✅ prisma/schema.prisma
- ✅ src/routes/call/+page.server.ts
- ✅ src/routes/call/step3/+page.server.ts
- ✅ src/routes/auth/reviewer/+page.server.ts
- ✅ src/routes/auth/manager/+page.server.ts
- ✅ src/lib/server/auth.ts
- ✅ scripts/test-db-connection.ts
- ✅ scripts/clear-2025-data.ts
- ✅ scripts/test-migration.ts (new)
- ✅ MIGRATION_COMPLETE.md (new)

## Support

For questions or issues:
1. Check test script: `npx tsx scripts/test-migration.ts`
2. Review Prisma schema: `prisma/schema.prisma`
3. Check application logs for errors
4. Verify database foreign keys are satisfied

---

**Migration Status**: ✅ COMPLETE
**Breaking Changes**: Yes (database structure)
**Backward Compatible**: No (requires database update)
**Testing Required**: Yes (full application flow)
