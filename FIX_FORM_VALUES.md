# Fix: Form Values Disappearing on Error

## Issue

When the call application form returned a validation error, some fields (first name, last name, age, etc.) would lose their values and become empty.

## Root Cause

Two problems were identified:

### 1. Variable Scope Issue
The `values` object was defined inside the `try` block, making it inaccessible in the `catch` block. When an unexpected error (500) occurred, the catch block returned `values: {}` (empty object) instead of the user's input values.

### 2. Inconsistent Null Handling
The original code used `|| null` as fallback:
```typescript
const firstName = data.get('first_name')?.toString()?.trim() || null;
```

Then converted to empty string in the values object:
```typescript
const values = {
  first_name: firstName ?? '',  // null coalescing
  // ...
};
```

While this worked, it was unnecessarily complex and could cause issues in edge cases.

## Solution

### Changes Made

1. **Moved variable extraction outside try block**:
   - Extracted form data before the try block
   - Defined all variables and the `values` object before try/catch
   - Now accessible in both try and catch blocks

2. **Simplified null handling**:
   - Changed `|| null` to `|| ''` (empty string fallback)
   - Removed unnecessary null coalescing in values object
   - More straightforward and consistent

### Before:
```typescript
export const actions: Actions = {
  default: async ({ request, cookies }) => {
    try {
      const data = await request.formData();
      const firstName = data.get('first_name')?.toString()?.trim() || null;
      // ... more extractions

      const values = {
        first_name: firstName ?? '',
        // ... more fields
      };

      // ... validation
    } catch (error) {
      return fail(500, {
        error: 'An unexpected error occurred...',
        values: {}  // ❌ Empty object!
      });
    }
  }
};
```

### After:
```typescript
export const actions: Actions = {
  default: async ({ request, cookies }) => {
    // ✅ Extract outside try block
    const data = await request.formData();
    const firstName = data.get('first_name')?.toString()?.trim() || '';
    // ... more extractions

    const values = {
      first_name: firstName,  // ✅ Already a string
      // ... more fields
    };

    try {
      // ... validation
    } catch (error) {
      return fail(500, {
        error: 'An unexpected error occurred...',
        values  // ✅ Contains user input
      });
    }
  }
};
```

## Benefits

1. **Values always preserved**: User input is maintained even on unexpected errors
2. **Simpler code**: Removed unnecessary null coalescing operators
3. **Better UX**: Users don't need to re-enter all their information after an error
4. **Consistent behavior**: All error paths return the same values structure

## Testing

To test this fix:

1. Fill out the call application form
2. Trigger a validation error (e.g., invalid email)
3. Verify all fields retain their values
4. Try various error scenarios:
   - Empty required fields
   - Invalid email format
   - Duplicate email for current year
   - Invalid age range

All fields should maintain their values across all error scenarios.

## Files Modified

- `src/routes/call/+page.server.ts`: Fixed value preservation logic

## Related

This fix ensures consistency with Step 2 form handling in `src/routes/call/step2/+page.server.ts`, which already uses similar patterns.
