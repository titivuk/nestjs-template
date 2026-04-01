# Workflow Patterns

Common patterns for structuring skill instructions.

## Table of contents

- [Pattern 1: Sequential workflow](#pattern-1-sequential-workflow)
- [Pattern 2: Multi-MCP coordination](#pattern-2-multi-mcp-coordination)
- [Pattern 3: Iterative refinement](#pattern-3-iterative-refinement)
- [Pattern 4: Context-aware tool selection](#pattern-4-context-aware-tool-selection)
- [Pattern 5: Domain-specific intelligence](#pattern-5-domain-specific-intelligence)

## Pattern 1: Sequential workflow

Use when users need multi-step processes in a specific order.

```markdown
## Workflow: Onboard New Customer

### Step 1: Create Account
Call MCP tool: `create_customer`
Parameters: name, email, company

### Step 2: Setup Payment
Call MCP tool: `setup_payment_method`
Wait for: payment method verification

### Step 3: Create Subscription
Call MCP tool: `create_subscription`
Parameters: plan_id, customer_id (from Step 1)
```

Key techniques:
- Explicit step ordering
- Dependencies between steps
- Validation at each stage
- Rollback instructions for failures

## Pattern 2: Multi-MCP coordination

Use when workflows span multiple services.

```markdown
## Phase 1: Design Export (Figma MCP)
1. Export design assets
2. Generate specifications
3. Create asset manifest

## Phase 2: Asset Storage (Drive MCP)
1. Create project folder
2. Upload assets
3. Generate shareable links

## Phase 3: Task Creation (Linear MCP)
1. Create development tasks
2. Attach asset links
3. Assign to team
```

Key techniques:
- Clear phase separation
- Data passing between MCPs
- Validation before moving to next phase
- Centralized error handling

## Pattern 3: Iterative refinement

Use when output quality improves with iteration.

```markdown
## Initial Draft
1. Fetch data via MCP
2. Generate first draft
3. Save to temporary file

## Quality Check
1. Run validation: `scripts/check_report.py`
2. Identify issues (missing sections, formatting, data errors)

## Refinement Loop
1. Address each issue
2. Regenerate affected sections
3. Re-validate
4. Repeat until quality threshold met

## Finalization
1. Apply final formatting
2. Generate summary
3. Save final version
```

Key techniques:
- Explicit quality criteria
- Validation scripts
- Know when to stop iterating

## Pattern 4: Context-aware tool selection

Use when the same outcome requires different tools depending on context.

```markdown
## Decision Tree
1. Check file type and size
2. Determine best storage:
   - Large files (>10MB): cloud storage MCP
   - Collaborative docs: Notion/Docs MCP
   - Code files: GitHub MCP
   - Temporary files: local storage

## Execute
- Call appropriate MCP tool
- Apply service-specific metadata
- Generate access link

## Explain
- Tell user why that storage was chosen
```

Key techniques:
- Clear decision criteria
- Fallback options
- Transparency about choices

## Pattern 5: Domain-specific intelligence

Use when the skill adds specialized knowledge beyond tool access.

```markdown
## Before Processing (Compliance Check)
1. Fetch transaction details via MCP
2. Apply compliance rules:
   - Check sanctions lists
   - Verify jurisdiction allowances
   - Assess risk level
3. Document compliance decision

## Processing
IF compliance passed:
  - Process transaction
  - Apply fraud checks
ELSE:
  - Flag for review
  - Create compliance case

## Audit Trail
- Log all checks
- Record decisions
- Generate audit report
```

Key techniques:
- Domain expertise embedded in logic
- Compliance/validation before action
- Comprehensive documentation
- Clear governance
