---
description: /design appends to pending plans, overwrites completed plans
---

# Insight: /design Command Behavior Rules

**Context:** User noticed inconsistent /design behavior - sometimes overwriting, sometimes appending, sometimes entering plan mode.

**Discovery:** The correct behavior should be deterministic based on plan status:

| Plan Status | `/design` Action |
|-------------|------------------|
| `pending` | **Append** - add new phases to existing plan |
| `completed` | **Overwrite** - start fresh with new plan |
| No plan | **Create** - new plan from scratch |

**Key Rules:**
1. `/design [task]` checks `.claude/plans/current.md` status field
2. If `Status: pending` → append new requirements/phases to the plan
3. If `Status: completed` → overwrite with new plan
4. `/run` marks plan as `Status: completed` when done
5. NEVER use `EnterPlanMode` tool for `/design` - just write the file directly
6. NEVER implement code in `/design` - only create the plan

**Implication:** This preserves unexecuted work while allowing fresh starts after completion. Users won't accidentally lose pending plans.

**Captured:** 2026-02-02
