# Skill Quality Checklist

Use this checklist to validate a skill before considering it done.

## Before you start

- [ ] Identified 2-3 concrete use cases
- [ ] Tools identified (built-in or MCP)
- [ ] Planned folder structure

## Structure

- [ ] Folder named in kebab-case
- [ ] `SKILL.md` file exists (exact spelling, case-sensitive)
- [ ] YAML frontmatter has `---` delimiters
- [ ] `name` field: kebab-case, no spaces, no capitals, matches folder name
- [ ] `description` includes WHAT it does and WHEN to use it
- [ ] No XML tags (`<` `>`) in frontmatter
- [ ] No `README.md` inside skill folder

## Content quality

- [ ] Instructions are clear and actionable (not vague)
- [ ] Examples provided for common scenarios
- [ ] Error handling / troubleshooting included
- [ ] References clearly linked from SKILL.md
- [ ] SKILL.md body under 500 lines
- [ ] Detailed docs moved to `references/` (if needed)
- [ ] File references are one level deep (no nested chains)
- [ ] Consistent terminology throughout
- [ ] No time-sensitive information
- [ ] Only includes context Claude doesn't already have
- [ ] Forward slashes in all file paths (no backslashes)

## Scripts (if applicable)

- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] Required packages listed and verified as available
- [ ] Validation/verification steps for critical operations

## Testing

- [ ] Triggers on obvious tasks
- [ ] Triggers on paraphrased requests
- [ ] Does NOT trigger on unrelated topics
- [ ] Functional tests pass (correct outputs)
- [ ] Performance comparison vs. no skill (fewer messages, fewer errors)

## Troubleshooting guide

### Skill doesn't trigger

- Description too generic ("Helps with projects" won't work)
- Missing trigger phrases users would actually say
- Missing relevant file types or keywords
- Debug: ask Claude "When would you use the [skill name] skill?"

### Skill triggers too often

- Add negative triggers: "Do NOT use for..."
- Be more specific about scope
- Clarify what other skills should handle instead

### Instructions not followed

- Instructions too verbose — trim to essentials
- Critical instructions buried — put them at the top
- Ambiguous language — replace "validate things properly" with specific checks
- For critical validations, consider bundling a script instead of language instructions

### Large context issues

- SKILL.md too large — move detailed docs to `references/`
- Too many skills enabled simultaneously (evaluate if >20-50)
- All content loaded instead of using progressive disclosure
