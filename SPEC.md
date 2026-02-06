# Die Zauberverben 🦉✨
**German Strong Verbs Learning Game**

> A fun, interactive React game helping German primary school children (ages 8-10) master *starke Verben* through three engaging mini-games.

---

## Overview

| Attribute | Value |
|-----------|-------|
| **Target Audience** | Primary school children, ages 8-10 |
| **UI Language** | German |
| **Platform** | Web (React) — Desktop, Tablet, Mobile |
| **Orientation** | Landscape only |
| **Theme** | Colorful & Playful with magical forest aesthetic |
| **Mascot** | Friendly owl |

---

## Core Concept

Children practice conjugating German strong verbs across three tenses:
- **Präsens** (Present) — Color: 🔵 Blue
- **Präteritum** (Simple Past) — Color: 🟠 Orange  
- **Perfekt** (Perfect) — Color: 🟢 Green

All three tenses are always in play, distinguished by consistent color-coding throughout all games.

---

## Data Source

**File**: `VerbenList.json`

Each verb entry contains:
```json
{
  "verbName": {
    "Praesens": "conjugated form",
    "Praesens_example": ["sentence1", "sentence2", "sentence3"],
    "Praeteritum": "conjugated form",
    "Praeteritum_example": ["sentence1", "sentence2", "sentence3"],
    "Perfekt": "conjugated form",
    "Perfekt_example": ["sentence1", "sentence2", "sentence3"]
  }
}
```

- Current verbs: 12
- Planned expansion: 120+ verbs
- Maximum supported: 150 verbs

---

## Game Selection & Verb Configuration

### Main Menu
- All 3 games available from the start (no progressive unlocking)
- Verb selection UI before starting any game:
  - Scrollable list with checkboxes
  - Minimum: 10 verbs
  - Maximum: 150 verbs (full list)
  - "Select All" / "Deselect All" options

---

## Mini-Games

### 1. 🧠 Gedächtnisspiel (Memory Match)

**Objective**: Match conjugated verb forms to their example sentences.

**Mechanics**:
- Cards are laid face-down in a grid
- Player flips two cards per turn
- **Matching pairs**: A conjugated verb (e.g., "begann") + an example sentence containing that verb (e.g., "Es begann plötzlich zu regnen.")
- Matched pairs are removed; unmatched cards flip back
- Game ends when all pairs are found

**Difficulty Selection** (player chooses before starting):
| Level | Grid | Pairs |
|-------|------|-------|
| Leicht (Easy) | 3×4 | 6 pairs (12 cards) |
| Mittel (Medium) | 4×4 | 8 pairs (16 cards) |
| Schwer (Hard) | 4×6 | 12 pairs (24 cards) |

**Visual Design**:
- Verb cards show tense color indicator
- Sentence cards are neutral/white
- Flip animation on card turn
- Glow effect on successful match

---

### 2. 🥷 Verben-Ninja (Verb Ninja) — Fruit Ninja Style

**Objective**: Slice verbs that are OTHER tenses of a shown hint verb.

**Game Flow (Per Round)**:

1. **Hint Phase**: 
   - A verb appears in one tense (e.g., "beißt" in Präsens)
   - Shown prominently, then fades to a small corner reminder
   
2. **Slicing Phase** (5 seconds):
   - 6-7 verbs fall from the top of the screen
   - **2 correct**: Other tenses of the hint verb (e.g., "biss", "hat gebissen")
   - **4-5 distractors**: Random verbs from the pool in random tenses
   - Verbs spawn gradually throughout the 5 seconds

3. **Round Transition**: 
   - Immediate transition to next hint (no pause)
   - Cycles through all selected verbs before repeating
   - Hint tense selected randomly each round

**Correct Answer Logic**:
- If hint is "beißt" (Präsens) → Slice "biss" (Präteritum) + "hat gebissen" (Perfekt)
- If hint is "biss" (Präteritum) → Slice "beißt" (Präsens) + "hat gebissen" (Perfekt)
- The hint tense itself is NEVER correct — only the other two tenses

**Scoring**:
| Event | Points |
|-------|--------|
| Starting points | 10 |
| Correct slice | +1 |
| Wrong slice (distractor) | -1 |
| Missed correct verb | -1 |
| Perfect round (both correct, no wrong) | +1 bonus |

**Game End**: Endless mode — play until points reach 0

**Slicing Interaction**:
- **Drag/swipe** gesture on both desktop (mouse) and mobile (touch)
- Visible **white-gray slice trail** follows the cursor/finger

**Visual Design**:
- Verbs displayed in **large, fruit-sized text** inside fruit-shaped containers
- **Rainbow juice splash** on correct slice
- **Red juice splash** on wrong slice
- No visual feedback for missed verbs
- Hint verb fades to corner but remains visible during slicing

**Sound Effects**:
- **Juicy splat** sound on correct slice
- Error sound on wrong slice

---

### 3. 🎯 Lückenfüller (Fill the Gap)

**Objective**: Drag the correct verb into the blank within an example sentence.

**Mechanics**:
- A sentence is displayed with a blank: "Der Film ___ um acht Uhr."
- 3-4 verb options float on screen as draggable chips
- Player drags the correct verb into the blank
- **Distractors**: Different verbs in the SAME tense
  - E.g., for Präsens blank: show `beginnt`, `beißt`, `bekommt`
  - Forces contextual understanding, not just tense recognition

**Feedback**:
- Correct: Celebration animation, verb snaps into place
- Incorrect: Gentle shake, verb returns to original position

**Round Structure**:
- 10 sentences per round
- Score displayed throughout
- Summary screen at end

**Visual Design**:
- Sentence displayed in large, readable font
- Blank area highlighted with dashed border
- Verb chips color-coded by tense
- Drag shadow/lift effect when picking up chip

---

## Visual Design

### Theme
- **Style**: Colorful & Playful (inspired by Duolingo for kids)
- **Background**: Use `background.png` — magical fantasy forest with planets
- **Colors**: Teal, green, soft blue palette from background
- **Typography**: Rounded, child-friendly fonts (e.g., Nunito, Quicksand)

### Tense Color Coding
| Tense | Color | Hex (suggested) |
|-------|-------|-----------------|
| Präsens | Blue | `#4A90D9` |
| Präteritum | Orange | `#F5A623` |
| Perfekt | Green | `#7ED321` |

### Mascot
- Friendly owl character
- Appears on:
  - Main menu (welcoming)
  - Game instructions
  - Celebration moments
  - Encouragement on mistakes

### UI Components
- Rounded buttons with hover/press states
- Card shadows for depth
- Smooth transitions and animations
- Large touch targets for mobile (min 44×44px)

---

## Audio

### Sound Effects
| Event | Sound Type |
|-------|------------|
| Correct answer | Cheerful chime/ding |
| Wrong answer | Gentle "oops" (not harsh) |
| Card flip | Soft flip sound |
| Ninja slice | Whoosh + slice |
| Drag pickup | Subtle pop |
| Drop in place | Click/snap |
| Level complete | Celebration fanfare |
| Lose a heart | Sad tone |
| Game over | Encouraging melody |

### Sound Toggle
- Visible mute/unmute button on all screens
- Icon: Speaker with sound waves / Speaker with X
- State persists during session (resets on refresh per no-persistence rule)

### No Background Music
- Keeps focus on learning
- Better for classroom use

---

## Scoring & Achievements

### Score Display
- Running score visible during gameplay
- Large, clear numbers
- Animated increment on points gained

### No Persistence
- Fresh start each session
- No login, accounts, or saved progress
- Simplicity for classroom/shared device use

### Badge System (Session-Only)
Earned during a single session, displayed at round end:

| Badge | Condition |
|-------|-----------|
| ⭐ Anfänger (Beginner) | Complete first game |
| 🌟 Schnell (Fast) | Memory Match < 2 minutes |
| 🔥 Strähne (Streak) | 5 correct in a row |
| 💯 Perfekt! | Round with no mistakes |
| 🏆 Meister (Master) | Score > threshold |
| 🦉 Eulenfreund (Owl Friend) | Play all 3 games |

Badges appear with celebratory animation when earned.

---

## Technical Requirements

### Framework
- **React** (with Vite for build tooling)
- Vanilla CSS for styling (no Tailwind unless requested)

### Responsive Design
- Desktop: Full experience
- Tablet: Touch-optimized
- Mobile: Scaled UI, larger touch targets
- **Landscape orientation only** (prompt to rotate on portrait)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Touch and mouse input

### Performance
- Smooth 60fps animations
- Fast load time
- Efficient verb data loading

### Accessibility Considerations
- High contrast text
- Large tap targets
- Clear visual feedback
- Color is not sole differentiator (use labels too)

---

## File Structure (Proposed)

```
starkenVerbenSpiel/
├── public/
│   └── background.png
├── src/
│   ├── assets/
│   │   ├── sounds/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   ├── MemoryMatch/
│   │   ├── VerbNinja/
│   │   └── FillTheGap/
│   ├── data/
│   │   └── VerbenList.json
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── SPEC.md
├── package.json
└── vite.config.js
```

---

## Future Considerations (Out of Scope for V1)

- Progress persistence with local profiles
- Additional verb tenses (Plusquamperfekt, Futur)
- Multiplayer/competition mode
- More mini-games
- Teacher dashboard
- Print-friendly verb lists

---

## Summary

**Die Zauberverben** is a colorful, engaging React game that helps German children master strong verbs through:
1. **Memory Match** — Pair verbs with example sentences
2. **Verb Ninja** — Fast-paced color/tense recognition
3. **Fill the Gap** — Contextual sentence completion

With a friendly owl mascot, magical forest theme, and consistent tense color-coding, learning *starke Verben* becomes an adventure! 🦉✨
