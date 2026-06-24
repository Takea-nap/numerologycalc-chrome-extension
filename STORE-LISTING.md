# Chrome Web Store Listing

## Name
NumerologyCalc - Quick Calculator

## Short Description (132 chars max)
Calculate Life Path, Expression, Soul Urge & Personality numbers instantly. Free numerology at your fingertips.

## Detailed Description
Discover your core numerology numbers in seconds — right from your browser toolbar. No sign-ups, no ads, no data collection. Just fast, accurate Pythagorean numerology.

NumerologyCalc Quick Calculator gives you instant access to five key numerology numbers without leaving the page you're on:

🔢 WHAT YOU CAN CALCULATE

Life Path Number — Your life's purpose and direction, calculated from your date of birth.
Birthday Number — Your special talents and gifts, derived from the day you were born.
Expression Number — Your natural strengths and abilities, revealed through your full birth name.
Soul Urge Number — Your inner desires and motivations, drawn from the vowels in your name.
Personality Number — How others perceive you, based on the consonants in your name.

✨ KEY FEATURES

• Two simple tabs: Life Path (date of birth) or Name Numbers (full birth name)
• Master Numbers (11, 22, 33) are preserved — never reduced — and highlighted with a distinct style
• "Treat Y as vowel" toggle for the classical Pythagorean method, so you can compare both interpretations
• Each result includes a brief meaning and a "Read more" link to the full interpretation on numerologycalc.org
• Recent calculations are saved locally so you can quickly revisit past readings
• Works offline — core calculations need no internet connection
• Clean, distraction-free popup that opens with one click or a keyboard shortcut (Ctrl+Shift+N / ⌃⇧N on Mac)

📖 HOW IT WORKS

1. Click the NumerologyCalc icon in your toolbar (or press the keyboard shortcut)
2. Choose "Life Path" and enter your date of birth — or choose "Name Numbers" and type your full birth name
3. Tap "Calculate" and see your results instantly
4. Want the full story? Click "Read more" to open the detailed interpretation on numerologycalc.org

🔒 YOUR PRIVACY

• Only one permission requested: storage (to save your recent calculations locally)
• Zero data collection — nothing is sent to any server, ever
• No tracking, no analytics, no cookies
• "Read more" links open numerologycalc.org in a new tab only when you choose to click them

Built by the team behind numerologycalc.org — a free, comprehensive numerology resource.

## Category
Lifestyle

## Language
English

## Privacy Policy URL
https://numerologycalc.org/privacy/

## Privacy Tab Draft
Single purpose:
Provide quick numerology calculations (Life Path, Expression, Soul Urge, Personality, Birthday) from a lightweight browser popup.

Permissions justification:
- `storage`: saves the user's recent calculations locally inside Chrome so they can quickly reopen recently used numbers.

Remote code:
- No. The extension does not execute remote code.

User data:
- The extension does not collect or transmit personal data.
- Recent calculations are stored only in the user's local browser storage.
- "Read more" links open numerologycalc.org pages in a new tab only when the user clicks the link.

## Required Store Assets
- Screenshot: `store-assets/generated/screenshot-1280x800.png`
- Small promo image: `store-assets/generated/promo-440x280.png`

## Packaging
- Run `node scripts/package-release.mjs`
- Upload the generated zip from `dist/`

## Notes
- No `host_permissions` in manifest.json — minimal permissions approach
- No data collection — all storage is local to the user's browser
- Number meanings are intentionally short snippets; full interpretations live on numerologycalc.org
