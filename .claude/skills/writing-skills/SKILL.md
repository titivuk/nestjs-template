---
name: writing-skills
description: Guide for creating and improving Claude skills. Use when user asks to create, write, build, improve, or review a skill for Claude.
---

# Writing Skills for Claude

## When to use this skill

- Creating a new skill from scratch
- Improving or reviewing an existing skill
- Structuring skill content and references

## Skill structure

A skill is a folder containing:

```
your-skill-name/
├── SKILL.md              # Required - main instructions
├── scripts/              # Optional - executable code
├── references/           # Optional - detailed documentation
└── assets/               # Optional - templates, fonts, icons
```

### Critical rules

- File must be exactly `SKILL.md` (case-sensitive, no variations)
- Folder name must be kebab-case: `my-skill-name`
- No spaces, underscores, or capitals in folder name
- No `README.md` inside the skill folder
- No `claude` or `anthropic` in skill name (reserved)

## YAML frontmatter

The frontmatter is how Claude decides whether to load the skill. This is the most important part.

```yaml
---
name: your-skill-name
description: What it does. Use when [specific trigger phrases].
---
```

### Required fields

**name:**
- kebab-case only, must match folder name
- Max 64 characters, lowercase letters/numbers/hyphens only

**description:**
- Max 1024 characters
- MUST include both WHAT the skill does and WHEN to use it
- Write in third person ("Processes files", not "I process files")
- Include specific trigger phrases users would say
- Mention relevant file types if applicable
- No XML angle brackets (`<` or `>`)

### Optional fields

- `license` — e.g. `MIT`, `Apache-2.0`
- `compatibility` — environment requirements (1-500 chars)
- `metadata` — custom key-value pairs (author, version, mcp-server)

### Description examples

Good — specific with triggers:

```yaml
description: Analyzes Figma design files and generates developer handoff documentation. Use when user uploads .fig files, asks for "design specs", "component documentation", or "design-to-code handoff".
```

```yaml
description: Manages Linear project workflows including sprint planning, task creation, and status tracking. Use when user mentions "sprint", "Linear tasks", "project planning", or asks to "create tickets".
```

Bad — too vague or missing triggers:

```yaml
# Too vague
description: Helps with projects.

# Missing triggers
description: Creates sophisticated multi-page documentation systems.
```

To reduce over-triggering, add negative triggers:

```yaml
description: Advanced data analysis for CSV files. Use for statistical modeling, regression, clustering. Do NOT use for simple data exploration.
```

## Writing instructions

After frontmatter, write instructions in Markdown. Recommended structure:

```markdown
# Skill Name

## When to use this skill
- [list of use cases]

## Instructions
### Step 1: [First Major Step]
Clear explanation with examples.

### Step 2: [Next Step]
...

## Examples
### Example 1: [Common scenario]
User says: "..."
Actions: ...
Result: ...

## Troubleshooting
### Error: [Common error]
Cause: [Why]
Solution: [Fix]
```

### Content guidelines

**Be specific and actionable:**

```markdown
# Good
Run `python scripts/validate.py --input {filename}` to check data format.
If validation fails, common issues include:
- Missing required fields (add them to the CSV)
- Invalid date formats (use YYYY-MM-DD)

# Bad
Validate the data before proceeding.
```

**Be concise — context window is shared:**
- Only add context Claude doesn't already have
- Challenge each piece of info: "Does Claude really need this?"
- Default assumption: Claude is already very smart

**Set appropriate degrees of freedom:**
- High freedom (text instructions) — when multiple approaches are valid
- Medium freedom (pseudocode/scripts with params) — when a preferred pattern exists
- Low freedom (specific scripts) — when operations are fragile or consistency is critical

**Reference bundled resources clearly:**

```markdown
Before writing queries, consult `references/api-patterns.md` for:
- Rate limiting guidance
- Pagination patterns
- Error codes and handling
```

## Progressive disclosure

Skills use a three-level loading system:

1. **YAML frontmatter** — always loaded in system prompt (discovery)
2. **SKILL.md body** — loaded when Claude thinks skill is relevant
3. **Linked files** — loaded only when Claude needs them

This means: keep SKILL.md body under 500 lines. Move detailed content to separate files and link to them.

### Organization patterns

**High-level guide with references:**

```markdown
## Quick start
[Core instructions here]

## Advanced features
- **Form filling**: See [FORMS.md](references/forms.md)
- **API reference**: See [REFERENCE.md](references/reference.md)
```

**Domain-specific organization:**

```
my-skill/
├── SKILL.md
└── references/
    ├── finance.md
    ├── sales.md
    └── product.md
```

**Important:** Keep references one level deep from SKILL.md. Deeply nested references (files referencing other files) may not be fully read by Claude.

For reference files longer than 100 lines, include a table of contents at the top.

## Anti-patterns to avoid

- Windows-style paths (`scripts\helper.py`) — always use forward slashes
- Offering too many options — pick one approach unless alternatives are necessary
- Time-sensitive information — don't include content that will become outdated
- Inconsistent terminology — choose one term and stick with it
- Verbose instructions — if Claude already knows it, don't explain it
- Putting all content in SKILL.md — use progressive disclosure

## Testing

Test skills at three levels:

1. **Triggering** — does the skill load when it should (and not when it shouldn't)?
2. **Functional** — does the skill produce correct outputs?
3. **Performance** — does the skill improve results vs. no skill?

Iterate on a single challenging task first, then expand to multiple test cases.

See [checklist.md](references/checklist.md) for the full quality checklist.
See [patterns.md](references/patterns.md) for common workflow patterns.
