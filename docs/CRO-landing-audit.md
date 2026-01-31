# CRO Audit – CloudSaver Landing

**Rule:** `.claude/skills/page-cro/SKILL.md` — Page Conversion Rate Optimization.

**Last reviewed:** After copy and CTA alignment updates (hero, navbar, token section, form button, modal).

---

## Initial assessment

| Aspect | Value |
|--------|--------|
| **Page type** | Landing (single conversion goal) |
| **Primary conversion goal** | User pastes DigitalOcean token and runs analysis (“run analysis”) |
| **Traffic context** | TBD (organic, paid, email, social). Affects message match. |
| **Product** | CloudSaver — free DigitalOcean infrastructure analysis for finding savings (read-only, no sign-up). |

No `.claude/product-marketing-context.md`; context taken from README and current components.

---

## Current state (implemented)

| Element | Before | After (current) |
|--------|--------|------------------|
| Hero headline | “Find Hidden Savings” | “Find Hidden Savings in Your DigitalOcean Account for” + typewriter |
| Hero CTA | “See My Savings” | “See My Savings” (unchanged) |
| Navbar CTA | “Start Audit” | “See My Savings” |
| Token section badge | “Secure Environment” | “Read-only · No storage” |
| Token section title | “Enter the Mainframe” | “Paste your token. Get your report in under 30 seconds.” |
| Token section sub | “Paste your read-only token to begin the audit.” | “Paste your read-only token below. We never store it.” |
| Form button copy | “Start Analysis” | “Get my report” |
| Modal description | “Follow these strict security directives.” | “Follow these steps to get your read-only token.” |

**Still unchanged (needs code/design):** Form button is still ghost style; no CTA block after FAQs; no direct link to DigitalOcean in the token modal.

---

## Analysis by dimension (impact order)

### 1. Value proposition clarity (highest impact)

**Status:** Strong.

- Fixed headline now includes “in Your DigitalOcean Account” so cold visitors see product and context in the first line.
- Typewriter adds concrete problems (Unused Resources, Zombie Droplets, etc.) without hiding “DigitalOcean” or “savings.”
- Subhead is specific: “Paste your DigitalOcean token. Get a free report in under 30 seconds.” + benefit language (droplets, volumes, snapshots, cut costs).
- Trust line: “Free. No sign-up. No card.”

**No change needed** for copy; optional test: “Find Hidden Savings in Your DigitalOcean Bill” if you want stronger cost framing.

---

### 2. Headline effectiveness

**Status:** Strong.

- Headline communicates outcome and audience (DigitalOcean) and leads into typewriter.
- Subhead matches promise (30s, free report).
- **Resolved:** Navbar and hero CTA both say “See My Savings” — single message.

---

### 3. CTA placement, copy, and hierarchy

**Status:** Good; a few structural improvements left.

- **Primary CTA:** One clear action (paste token → get report). Hero and navbar both “See My Savings”; form button “Get my report” — aligned and benefit-focused.
- **Visibility:** CTA visible above the fold in hero and navbar.
- **Remaining (implementation):**
  - **Repeat CTA after FAQs** — No CTA after Features/FAQs for users who scroll to the end. Add a short block (e.g. “See where you can cut costs”) + button scrolling to `#token-input` with same copy as hero.
  - **Form button prominence** — “Get my report” copy is done; button is still ghost. Consider primary style (e.g. same as hero) to reinforce hierarchy.

---

### 4. Visual hierarchy and scannability

**Status:** Good.

- Sections are clear: Current State → Future State → How It Works → Token Input → Features → FAQs → About Me → Footer.
- Trust row under hero (Read-Only, 30s, We never store) supports the CTA.
- **Optional:** “Read Changelog” badge in hero can compete with CTA; consider moving or de-emphasizing if conversion is the main goal.

---

### 5. Trust signals and social proof

**Status:** Partial.

- **Present:** Read-only, 30s, “We never store your token,” token section “Read-only · No storage,” strong FAQs (safety, time, savings, control).
- **Missing:** Logos, testimonials, or a concrete number (e.g. “X analyses run”) or outcome (“Saved $X/month”).
- **Recommendation:** Add one proof point near hero or token input (e.g. “Join X+ developers who’ve found savings” or one short testimonial) to reduce perceived risk of pasting the token.

---

### 6. Objection handling

**Status:** Very good.

- FAQs cover: safety, duration, savings range, no auto-changes, technical level, free, disagreeing with a recommendation, “Low” confidence.
- “Where is my token?” + step-by-step modal reduces friction.
- **Recommendation:** Add a direct link to DigitalOcean API/tokens in the modal (e.g. on “Generate New Token” or step 1) to reduce steps and drop-off.

---

### 7. Friction

**Status:** Low on the form (one field, one button).

**Possible friction:**

- Users who are “ready” still scroll Hero → Current → Future → How It Works before the token input. For warm traffic, consider testing moving the token block higher (e.g. right after hero or after How It Works).
- Nav has four links (Current State, Future State, How It Works, Features); for a strict landing, you could simplify or make the CTA more dominant.
- “About Me” before footer may distract “convert now” users; option to shorten or move to footer.

---

## Recommendations

### Quick wins

| # | Action | Status | Notes |
|---|--------|--------|--------|
| 1 | Unify hero and navbar CTA copy | Done | Both “See My Savings.” |
| 2 | Add repeated CTA after FAQs | Pending | Block + button scrolling to `#token-input`; same copy as hero. |
| 3 | Direct link to DigitalOcean in token modal | Pending | e.g. `https://cloud.digitalocean.com/account/api/tokens` on “Generate New Token” or step 1. |
| 4 | Stronger form button (copy + prominence) | Copy done | Copy “Get my report” in place; consider primary (solid) button style. |

### High-impact (prioritize)

1. **Add one social proof element**  
   Near hero or token input: e.g. “X+ analyses run” or one short testimonial with outcome (“Saved $X/month”). Reduces perceived risk of pasting the token.

2. **Reposition or shorten “About Me”**  
   If conversion is the priority: move “About the Creator” to footer or shorten to 1–2 lines + “About me” link. Keeps credibility without competing with the CTA.

3. **Simplify or refocus nav**  
   Fewer links or group under “How it works” so the CTA is the main action. On mobile, keep the CTA most visible when the menu opens.

---

## Test ideas (A/B)

1. **Content order**  
   - A: Hero → How It Works → Token Input → Current State → Future State → Features → FAQs.  
   - B: Current order.  
   - Hypothesis: Ready users convert more when the form appears earlier.

2. **Hero headline**  
   - A: “Find Hidden Savings in Your DigitalOcean Account for” (current).  
   - B: “Find Hidden Savings in Your DigitalOcean Bill.”  
   - C: “Stop Paying for What You Don’t Use.”  
   - Measure: Scroll to token input and/or completed analyses.

3. **Primary CTA copy**  
   - A: “See My Savings” (current).  
   - B: “Get my free report.”  
   - C: “Run free analysis.”  
   - Measure: CTA clicks and analyses started.

4. **Social proof**  
   - A: No number/testimonial.  
   - B: One line near hero or form (e.g. “Join X+ developers who’ve found savings”).  
   - Measure: Completed analyses from landing.

---

## Copy alternatives (for tests)

**Hero headline (current:** “Find Hidden Savings in Your DigitalOcean Account for” + typewriter **)**  
- **A (current):** Clear, includes DigitalOcean and savings.  
- **B:** “Find Hidden Savings in Your DigitalOcean Bill” — stronger cost angle, no typewriter.  
- **C:** “Stop Paying for What You Don’t Use” — pain-focused; aligns with Current State.

**Primary CTA (current:** “See My Savings” **)**  
- **A (current):** Outcome-focused.  
- **B:** “Get my free report” — emphasizes what they get.  
- **C:** “Run free analysis” — action-focused; good if traffic is “audit” or “analysis.”

**Token section (current:** “Paste your token. Get your report in under 30 seconds.” **)**  
- **A (current):** Clear promise and instruction.  
- **B:** “See your savings — paste your read-only token below.” — value first, then action.

**Form button (current:** “Get my report” **)**  
- **A (current):** Aligned with benefit.  
- **B:** “See my savings” — consistent with hero CTA.

---

## Validation

- In browser: hero, navbar, scroll to token input, form, FAQs; confirm copy and CTA consistency.
- In analytics: define conversion (e.g. analysis completed or results shown) and measure rate from this landing.
- After implementing remaining quick wins (CTA after FAQs, DO link, button style), compare completion rate before/after or run A/B tests if volume allows.

---

*Audit based on Page CRO framework (`.claude/skills/page-cro/SKILL.md`).*
