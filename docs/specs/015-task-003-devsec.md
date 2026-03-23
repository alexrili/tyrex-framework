# SPEC: Improve devsec skill

## Objective
Enhance devsec.md from 105 to ~120 lines by adding missing patterns for secure configuration, threat modeling, supply chain security, and cryptographic key lifecycle.

## Technical Approach
- Add secure configuration management: secrets rotation, env-var hygiene, config validation on boot
- Add threat modeling checklist: STRIDE-based, trust boundary identification, data flow analysis
- Add supply chain security: dependency auditing workflow, SBOM generation, lockfile integrity checks
- Add cryptographic key lifecycle: generation, rotation schedule, revocation procedure, storage standards
- Sharpen existing patterns with more specific, actionable language
- Add 3-5 new review criteria items

## Files Affected
- `templates/skills/devsec.md`
- `.tyrex/skills/devsec.md`

## Testing Strategy
N/A (markdown documentation)
