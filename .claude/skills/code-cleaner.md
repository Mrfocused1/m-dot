# Code Cleaner Skill

**Purpose:** Clean up code for production, remove debug statements, organize files, delete backups

**When to use this skill:**
- Preparing for production deployment
- Code review and cleanup
- Repository maintenance
- Removing dead code and unused files

## Context

**Current Cleanup Needs:**
- ✅ DEBUG flag set to false (DONE)
- ✅ Console logging controlled (DONE)
- ⚠️ 20 animation versions (V1-V20) - Only need 1 working version
- ⚠️ Multiple collision detection versions - Consolidate
- ⚠️ Backup files (.bak, .backup) - Should be deleted
- ⚠️ Test files in root directory - Should move to /tests/
- ⚠️ Commented-out code - Remove if truly unused
- ⚠️ Unused imports - Clean up

## Cleanup Categories

### 1. Debug Code
**Status:** ✅ Mostly fixed
- DEBUG constant set to false
- Console logging controlled by DEBUG flag
- Console.error still enabled for critical errors

**Remaining work:**
- Review animation version debug functions (window.setAnimV1-V20)
- Consider removing or gating behind DEBUG flag

### 2. Animation Versions
**Problem:** 20 different animation implementations taking up code space

**Task:**
1. Identify which version is actively used in production
2. Test that version thoroughly
3. Remove the other 19 versions
4. Update documentation

**Location:** game.js lines 18-262

**How to identify active version:**
- Check which version is called in actual game code
- Search for "animationVersion" usage
- Test game and verify animations work
- Once confirmed, delete unused functions

### 3. Collision Detection Versions
**Problem:** Multiple collision implementations (V1, V2, etc.)

**Task:**
1. Determine which version is most accurate
2. Profile performance of each
3. Choose best one
4. Remove others
5. Document choice

**Location:** game.js lines 5965-6069

### 4. Backup Files
**Files to delete:**
```bash
game.js.backup-before-fresh-start
game.js.bak
game.js.bak2
Fast Run.fbx.backup
Any other .bak or .backup files
```

**Why:** Git is your backup system, don't need file copies

**Command:**
```bash
cd /Users/paulbridges/stevo
rm *.bak *.backup game.js.backup-*
```

### 5. Test Files Organization
**Current:** 10+ test HTML files in root directory
**Goal:** Move to /tests/ directory

**Files to move:**
- v1.html through v10.html
- animation-test-*.html
- debug-*.html
- test-*.html
- tests.html

**Command:**
```bash
mkdir -p tests
mv v*.html tests/
mv animation-test-*.html tests/
mv debug-*.html tests/
mv test-*.html tests/
mv tests.html tests/
```

### 6. Commented-Out Code
**Look for:**
```javascript
// TODO: Implement damage system
// FIX: This is broken
// HACK: Temporary workaround
```

**Action:**
- If TODO is not planned, remove it
- If FIX is still needed, create GitHub issue
- If HACK is temporary, either fix properly or document why needed

**Search command:**
```bash
grep -n "// TODO\|// FIXME\|// HACK\|// XXX" game.js
```

### 7. Unused Variables & Functions
**Look for:**
- Variables declared but never used
- Functions defined but never called
- Imports never referenced

**Tools:**
- ESLint (no-unused-vars rule)
- Manual code review
- Browser DevTools Coverage tab

### 8. Dead Code
**Examples:**
- Feature flags for removed features
- Old event handlers
- Deprecated function implementations

**How to find:**
- Code coverage analysis
- Search for obviously old code
- Check git history for recently removed features

## Your Tasks

### Pre-Cleanup Checklist
- [ ] Create git branch for cleanup
- [ ] Commit current working state
- [ ] Run game and verify it works
- [ ] Note current file count and code size

### Cleanup Steps

#### Step 1: Safe Deletions
```bash
# Delete backup files
rm *.bak *.backup game.js.backup-*

# Move test files
mkdir -p tests
mv v*.html animation-test-*.html debug-*.html test-*.html tests.html tests/ 2>/dev/null

# Verify game still works
python3 -m http.server 8000
```

#### Step 2: Code Analysis
```bash
# Count lines of code
wc -l game.js

# Search for TODOs
grep -n "TODO\|FIXME\|HACK\|XXX" game.js

# Search for unused functions (manual review needed)
# Look for functions defined but never called
```

#### Step 3: Remove Animation Versions
1. Identify active version (search game.js for animation calls)
2. Test game thoroughly with that version
3. Delete other 19 version functions
4. Remove window.setAnimV1-V20 functions
5. Test again

**Expected reduction:** ~200-300 lines of code

#### Step 4: Consolidate Collision Detection
1. Test each collision version
2. Measure accuracy and performance
3. Choose best one
4. Remove others
5. Document choice in comments

**Expected reduction:** ~50-100 lines of code

#### Step 5: Clean Up Comments
```bash
# Find commented-out code blocks
grep -n "^[ ]*//[ ]*[a-z]" game.js | less

# Review each and decide: keep, remove, or uncomment
```

#### Step 6: Verify & Test
- [ ] Run game and test all modes
- [ ] Check console for errors
- [ ] Verify animations work
- [ ] Test collision detection
- [ ] Play through both levels
- [ ] Test on mobile

#### Step 7: Commit Changes
```bash
git add .
git commit -m "Clean up code for production

- Remove backup files
- Organize test files into /tests/ directory
- Remove unused animation versions
- Consolidate collision detection
- Clean up commented-out code
- Remove debug statements

Reduces codebase by ~XXX lines"
```

## Code Quality Standards

### Formatting
- Consistent indentation (2 or 4 spaces)
- No trailing whitespace
- Newline at end of file
- Max line length ~100 characters

### Naming Conventions
- `camelCase` for variables and functions
- `PascalCase` for classes
- `UPPER_CASE` for constants
- Descriptive names (not `x`, `temp`, `data`)

### Comments
- Explain "why" not "what"
- Remove commented-out code (use git for history)
- Keep TODO comments only if actionable
- Document complex algorithms

### File Organization
- Related code grouped together
- Clear section headers
- Imports at top
- Exports at bottom (if using modules)

## Production Checklist

Before deploying, ensure:
- [ ] DEBUG = false
- [ ] No console.log in hot paths (render loop, etc.)
- [ ] No test files in production
- [ ] No backup files
- [ ] Assets optimized (compressed, right size)
- [ ] No hardcoded credentials or secrets
- [ ] Error handling in place
- [ ] Loading states for async operations
- [ ] Tested on target devices
- [ ] Documentation updated

## Tools & Commands

### Find Large Files
```bash
du -sh * | sort -h | tail -20
```

### Count Lines by File Type
```bash
find . -name "*.js" -type f -exec wc -l {} + | sort -n
find . -name "*.html" -type f -exec wc -l {} + | sort -n
```

### Find TODO/FIXME
```bash
grep -rn "TODO\|FIXME\|HACK\|XXX" --include="*.js" --include="*.html"
```

### Remove Empty Lines
```bash
# In vim
:g/^$/d

# With sed (backup first!)
sed -i '/^$/d' file.js
```

### Check for Unused NPM Packages
```bash
npx depcheck
# Note: This project has no package.json yet
```

## Success Criteria

- ✅ No backup files in repository
- ✅ Test files organized in /tests/
- ✅ Unused animation versions removed
- ✅ Collision detection consolidated
- ✅ No commented-out dead code
- ✅ DEBUG flag set to false
- ✅ Console logs controlled
- ✅ Code follows style guidelines
- ✅ Game tested and working after cleanup
- ✅ Codebase smaller and cleaner

## Estimated Impact

**Before cleanup:**
- game.js: ~7,590 lines
- Root directory: 50+ files
- Code duplication: High (20 animation versions)

**After cleanup:**
- game.js: ~7,200 lines (save ~400 lines)
- Root directory: 30-40 files (organized)
- Code duplication: Low (single implementations)

**Benefits:**
- Faster to navigate codebase
- Easier to understand code
- Better performance (less code to parse)
- Cleaner git history
- Professional appearance

## Notes

- **Always backup before mass deletion** (git commit)
- **Test after each major cleanup step**
- **Don't remove code you don't understand** - Research first
- **Keep TODOs if they're actionable** - Remove if not planned
- **File deletion is reversible with git** - Don't fear it
- **Clean code is maintainable code** - Worth the effort
