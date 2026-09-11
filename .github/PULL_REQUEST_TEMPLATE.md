## PR Checklist

### Code Quality
- [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatting applied
- [ ] No `any` types introduced

### Testing
- [ ] Unit tests for new business logic
- [ ] Component test for new/modified UI
- [ ] Integration test for new feature flow
- [ ] RLS test for new/modified table policies
- [ ] All existing tests still pass (`npm test`)

### Features
- [ ] Acceptance criteria met
- [ ] Loading state implemented
- [ ] Empty state implemented
- [ ] Error state implemented
- [ ] All strings through i18n (EN + PL)

### Security
- [ ] No secrets in code or logs
- [ ] RLS policies enforce access control
- [ ] Input validation on all user data
- [ ] No direct DB writes from UI

### Documentation
- [ ] README updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Changelog entry (if user-facing)

---

**Reviewer:** Please verify all items before approving.
