# Web client daily notes (4 May – 13 August 2026)

User-facing work on `web_client`, newest first. Dependency bumps, translation dumps, and CI-only commits are omitted. Copy a day’s `##` block as needed.

---

## Thursday 13 August 2026

**[Web Core App] [Learning] Example sentences: show two, hide the rest.**
Learning screens now show at most two example sentences. Anything beyond that opens from an eye-icon popup. The relevant learnable is underlined in each sentence.

## Wednesday 12 August 2026

**[Web Core App] Add keyboard shortcuts to checkpoint tapping tests.**
You can use the 1–5 on the left-hand column, and 6–0 on the right-hand column, to quickly speed-run these tests (vocab check / match board).

**[Web Core App] [Path]**
On the Immerse preview card, we now show up to 5 learnables from the immersion video.

**[Web Core App] [Path] Session preview cards on hover.**
Hovering a Path tile now shows a richer preview of what is coming, with a loading state while content fetches. Previews cover:

- Learn (upcoming words and translations)
- Grammar and Conjugation (topic / pattern — including when you are standing on the current tile)
- Pronunciation (target-language items only, no source gloss)
- Sentence Builder (on the Path **and** the Dashboard)
- Immerse
- AI conversation
- Membot
- Next video

Where the next session’s content is not knowable in advance, the tile keeps a simple type label instead of a guessed preview.

**[Web Core App] [Onboarding] Fifth screen: “Your expert-built path”.**
Staging only: after **Just curious for now** in the focus onboarding flow, learners now see a fifth screen with their goal on a milestone path, plus **Start first session** and **Tweak path**. Production onboarding is unchanged.

**[Web Core App] [Path] Sessions still complete the Path when the node id is missing.**
If a session finishes without a Path node id, we complete the current Path node when it matches that session type, so progress is not left hanging.

## Tuesday 11 August 2026

**[Web Core App] [Learning] Pitch accent on web.**
Official learnables can now show kana pitch accent in learning sessions. It is shown by default, with a customise-learning setting to hide it. When a word has more than one pitch accent, they are listed with a localised “or”.

**[Web Core App] [Plans] Milestone identity upsells.**
After a 7-day streak celebration, and after completing a wordlist, free learners may see a membership upsell. Pro members never see it. The same milestone will not nag again immediately.

**[Community Courses] Switch and Start on wordlist cards.**
Wordlist cards now have Switch and Start session actions, so you can change the active wordlist or jump straight into a lesson.

**[Web Core App] Dashboard summer cleanup (Path learners).**
For Path learners, Home no longer shows the pronunciation card (pronunciation stays on Speak). The videos card moves to Explore. Learners who are not on the Path are unchanged.

**[Web Core App] [Path] Grammar and Conjugation previews.**
Hovering an upcoming Grammar or Conjugation tile now previews the next concept or pattern (title and description), instead of a plain session-type label.

**[Web Core App] [Learning] Tap-to-reveal hints on Grammar.**
Grammar sessions now hint that you can tap an example to reveal its translation. The same hint idea is on the Patterns and Grammar pages.

**[Web Core App] Recommended missions come from the backend.**
The Speak tab now uses the shared server-side mission recommender instead of picking a mission on the client.

## Monday 10 August 2026

**[Web Core App] [Path] Grammar session previews.**
Hovering an upcoming grammar session on the Path now shows a preview card with the concept it will cover.

## Friday 7 August 2026

**[Web Core App] [Path] Grammar and Conjugation sessions are on in production.**
New Grammar sessions, and Conjugation sessions alongside them, are now on the Path in production. Grammar polish includes:

- A back button from practice to the explanation
- Seen grammar in green
- Difficulty level and a complexity meter
- Marking a concept as known
- A smoother second phase, then auto-continue into the final phase

**[Web Core App] [Path] Italian.**
Italian is now a Path language.

**[Web Core App] [Onboarding] A wordlist is selected by default.**
Onboarding no longer leaves learners without a wordlist.

**[Web Core App] [Learning] Mems and sample sentences are hidden by default.**
Customise-learning scaffolding now defaults to mems and sample sentences off, so they stay out of the way unless you turn them on.

## Thursday 6 August 2026

**[Web Core App] [Path] Stepping-stone redesign.**
The Path page has a new stepping-stone layout: a meandering trail of tightly packed stones, colour-themed checkpoints with “Checkpoint: {name}” titles, an inline session-type legend, and collision-aware section labels.

## Wednesday 5 August 2026

**[Web Core App] [Learning] Grammar sessions (not yet production on this date).**
New Grammar sessions are wired to the live backend (no longer mock content) and polished for the Path.

**[Web Core App] [Path] Simpler selectors.**
Language and related selectors on the Path page are simplified.

**[Web Core App] [Learning] Smaller example-sentence audio button.**
The example-sentence audio control is smaller and sits in the top-right corner.

**[Web Core App] [Learning] Character-tracing scaffolding is Chinese and Japanese only.**
Tracing prompts no longer appear for other scripts (including Korean hangul).

## Tuesday 4 August 2026

**[Web Core App] [Path] Conversation checkpoint.**
The Path now includes a conversation checkpoint session type.

**[Web Core App] [Path] Goal selector.**
You can choose your learning goal from the Path page.

**[Web Core App] [Onboarding] “Crafting your path” replaces the commitment survey.**
The “How committed are you?” step (including the 3-day Pro trial prompt) is replaced by a **Crafting your path** screen. It shows a personalised plan being built, then continues on its own after a few seconds — no buttons. Focus-flow learners reach it after the wordlist step. Learners outside that flow go to the plans page. The 3-day trial is no longer offered on web.

**[Community Courses] Community badge on wordlists.**
Wordlists now show a Community badge so community lists are distinct from official ones (no tooltip on the badge). The change-wordlist control has an icon, and estimated lesson time has a small timer icon.

**[Community Courses] Currently-learning card layout.**
The currently-learning card has a clearer progress bar (outline, without a percentage) and a more reliable video/audio layout that lines up with Start lesson.

## Monday 3 August 2026

**[Web Core App] Next-checkpoint card on Home.**
Home now has a card for the next checkpoint, with a subtle bobbing motion. Types covered:

- Vocabulary check — recall words under light pressure
- Sentence building — form sentences with words and patterns you have been learning
- Text comprehension — read a short passage
- Audio comprehension — follow spoken language
- Conversation — handle a short exchange
- Pronunciation — say key words and phrases out loud

**[Web Core App] [Path] Checkpoint celebration.**
Passing a Path checkpoint now opens a celebration screen — badge, confetti, “CHECKPOINT REACHED”, and Continue back to the Path — instead of silence or a generic well done. Sentence building and vocab check celebrate in-session when run as a checkpoint; other checkpoint types celebrate when you return to the Path. Everyday (non-checkpoint) runs keep their existing success screen.

**[Web Core App] [Path] Tweak my path describes outcomes.**
Copy now talks about outcomes (recall words easily, speak with confidence, handle short exchanges, understand native speakers). A banner shows the current goal, with Change to pick a different focus. Confirm appears only after you choose a new goal.

**[Web Core App] [Path] End of session: Continue learning / Go back to my path.**
Sessions launched from the Path now end with **Continue learning** (start the next Path activity) and **Go back to my path**. This applies to Learn, Pronunciation, Immersion (easy rating), Sentence building, Grammar, Conjugation, and AI conversation. The same activities launched from Home are unchanged.

**[Web Core App] [Path] Progress so far boxes.**
Progress cards use outline icons so they do not look like buttons. The Review highlight and CTA appear only when words are actually due. The label is now “Words due for review.”

**[Web Core App] Share Membot is gone.**
The Share Membot button is removed.

**[Community Courses] Wordlist page alignment.**
Wordlist page text alignment is tightened, and the next-checkpoint card gets that bobbing motion.

## Saturday 1 August 2026

**[Web Core App] Public wiki pages.**
Learner wiki pages (`/wiki/…`) are public — no staff login required — and load from the public wiki-pages API with proper markdown rendering.

**[Web Core App] Grammar markdown can include HTML.**
Grammar wiki-style pages can render HTML in markdown, including ruby annotations and line breaks, so Japanese and similar content displays correctly.

---

## Friday 31 July 2026

**[Community Courses] Curated wordlists sit above Community.**
Pro and free Memrise lists are merged into one Curated section (at least one Pro list every four when we have them), with subtitles for curated vs community. See all for curated goes to `/curated-wordlists` (free + paid); Community See all still goes to `/community-wordlists`.

**[Web Core App] [Path] Review only on sessions you have actually finished.**
Skipped-over nodes (via Skip to here) no longer offer “Review again” — you have not done that lesson yet. The action is renamed **Review** and only shows when the session is completed. Skipped sessions show **Jump back** only.

**[Web Core App] [Path] “Regress” is now “Jump back”.**
Friendlier label when you return to an earlier session on the path.

## Thursday 30 July 2026

**[Web Core App] [Plans] End-of-session soft-sell is actually on for free learners.**
Free users never saw a post-session upsell on web: the plans page waited for a “soft-sell seen” flag that nothing in production ever set. After a 2025 Learn session, free users now get the word-lists soft-sell; once they have seen it, the existing plans page resumes its every-other-session cadence. “Browse PRO Word Lists” goes to `/wordlists` (locked lists still hit the paywall). Pro users see neither surface.

**[Web Core App] [Plans] Lapsed-Pro win-back on Settings.**
If your Pro trial has ended, a win-back card sits under the current-language block and deep-links to the paywall. Same copy as the trial-expired modal. Everyone else sees Settings unchanged. Layout is RTL-safe and stacks the CTA full-width on small screens.

**[Web Core App] [Path] Path works on small and medium viewports.**
Desktop keeps the zigzag; smaller screens get a less-wavy compact layout, scaled to width, with larger station labels. The start-session bar pins above the mobile nav. Sidebar toggle works on small viewports.

**[Web Core App] [Onboarding] No more “you’re not starting from scratch” sheet.**
After picking a level, learners no longer get the Level Selection Impact bottom sheet. They just continue.

## Wednesday 29 July 2026

**[Web Core App] [Path] Path (and the new onboarding) are on in production for new users.**
Live when the user ID is over **88504700** (above then-current highest IDs) and the pair is **Spanish / Mexican Spanish / French / German for English (UK or US)**. Existing production users are unchanged.

**[Web Core App] Redesigned the Home “next lesson” card.**
Word rows with growth-stage bars, a media preview panel, and a header with wordlist progress. Growth comes from the user dictionary, with session progress as fallback, so bars update after learn sessions. On small screens, media → Start lesson → word list stay above the fold. Row media buttons, status labels, Hear it, and media captions are gone.

**[Web Core App] “Words learnt” opens your dictionary.**
Small arrow on the progress card (same destination as the header book icon — My words). Real link, so keyboard, screen readers, and cmd/middle-click work.

**[Web Core App] [Path] Map polish.**
Wigglier ribbon, labels closer to nodes, more readable type, more vertical spacing, larger checkpoint copy. Session dots use **section** colour (section 1 green, 2 blue, and so on) instead of session-type colour: upcoming muted, otherwise solid; completed dots are larger, white, with a tick; skipped stay small and blank. Footer is sticky. Session-track boxes are hidden. On small screens you can scroll horizontally so node labels are not clipped. The next-session label on the node is dropped (the floating label already shows it). Skip to here updates the path in real time. We reliably scroll to the current node. Staging disclaimer and unimplemented progress boxes are gone.

**[Web Core App] [Path] Path tab in the mobile bottom nav.**
New Path icon. Inactive state is outlined; active is heavier stroke — it no longer looks permanently selected on desktop sidebar or mobile nav.

**[Web Core App] [Path] Tweak my path is clearer and actually usable.**
Static “Still expertly guided…” banner is replaced with: “Adjust the frequency of the learning features on your path.” Title, subcopy, and **Update my path** stay pinned; only the sliders scroll, with a visible scrollbar and a fade when there is more below. After update, the path shows a loader while it rebuilds, then the new path.

**[Web Core App] [Onboarding] Wordlist selection copy and flow.**
Clearer strings and flow on wordlist selection, plus extra context on onboarding pages. If you pick the **lowest** skill level, we do not ask again.

**[Web Core App] MemBot: no more triple messages, cleaner bubbles, an exit after chatting.**
Speech-to-text no longer appended the same utterance three times. Bot replies no longer leak a “(Language) Speaker:” prefix into the bubble. After **3 interactions** in a buddy session you get a button to leave.

**[Web Core App] [Learning] Backspace and Clear are actually tappable.**
Backspace on type-in-with-buttons is larger and no longer clipped. Clear on tile rearrangement is bigger.

**[Web Core App] [Path] Vocab checkpoint completion is registered.**
Finishing the vocab checkpoint now counts as completed on the path.

## Tuesday 28 July 2026

**[Web Core App] [Onboarding] Path onboarding with focus selection.**
New Path onboarding: pick what you want to focus on, wired to the backend. The focus modal only appears when we do not already know the focus. Second-screen boxes are aligned.

**[Web Core App] SEO grammar pages.**
Public `/grammar/[tl]/[sl]/[slug]` pages with SSR. Markdown supports GFM, Obsidian wikilinks/callouts, and KaTeX. Frontmatter tags and CEFR show as chips.

**[Web Core App] [Learning] Backspace and Clear on type-in and tile tests.**
Type-in-with-buttons gets Backspace; tile rearrangement gets Clear. Learn and review modes (difficult-words mode still to come at this point).

**[Community Courses] Open the current wordlist from Home.**
Click the icon on the current-wordlist card to jump into that wordlist.

**[Web Core App] [Onboarding] Bienvenue signup hero uses the App Store product shot.**
Replaces the old registration photo; white panel behind the form to match the other side.

## Monday 27 July 2026

**[Web Core App] SEO character pages.**
Public pages with basic information about characters (for search / wiki-style content).

**[Web Core App] [Path] Wordlist selector on the Path page.**
Small selector on the path so you can switch wordlist without leaving.

**[Web Core App] [Path] Checkpoints read as destinations.**
Checkpoints are larger, labels show by default, and the arrow back to the dashboard is gone.

**[Web Core App] [Path] Path statistics start filling in.**
Progress / stats on the path are populated from real data rather than empty boxes.

## Wednesday 22 July 2026

**[Web Core App] [Path] Path sessions actually start — and complete.**
“Next session: Grammar” (and the rest) now launches that session type and registers completion on the path. Covers grammar, vocab, cloze, MemBot, Immerse, text comprehension, audio comprehension, and vocab check (vocab check is on the backend, not a mock).

**[Web Core App] [Path] Immerse sessions go straight to the video.**
No extra Immerse landing page. Completing the video marks the session done and returns you to the Path.

**[Web Core App] [Path] MemBot sessions on the path.**
Buddy / MemBot is a real path session, not a dead click.

**[Web Core App] [Path] Text and audio comprehension.**
New front-ends for reading and listening comprehension sessions on the path.

**[Web Core App] [Path] Cloze tests polished and on the path.**
Fill-in-the-blank sessions look and behave like a proper checkpoint exercise.

**[Web Core App] [Path] Pronunciation checkpoint.**
Uses the same backend as the existing pronunciation buddy.

**[Web Core App] [Path] Tweak my path modal.**
Easier to hit. Vocab frequency cannot sit in the dead zone between 0 and 0.5.

**[Web Core App] [Path] Checkpoints have the right icons.**
Each checkpoint type uses a relevant icon instead of a generic blob.

## Tuesday 21 July 2026

**[Web Core App] [Path] Tube-map Path: colours, toggles, and node actions.**
Session-type colours, optional glow, Tube-map labels, sticky legend. Section headers sit in each leg’s open bay. Dots stay on the ribbon on narrow screens. Labels / Legend / Glow / progress-panel prefs persist. Progress so far can be collapsed (hidden by default below large screens). Click a dot for **Skip to here**, **Review again**, or **Regress**. Action chips sit above the path with a white glow. **On track** / **Tweak my path** swapped in the chrome.

**[Web Core App] [Path] Wider, section-coloured ribbon.**
Zigzag is wider; each leg uses pastel Learn / Review / Audio / Speed Review / Difficult Words colours. Checkpoints and session dots follow those section pastels.

**[Web Core App] [Onboarding] Skill-level selection no longer blocks the rest of onboarding.**
Picking a proficiency level used to full-screen-spin while we marked known words (painful for advanced learners). We now fire the selection and continue immediately. We only wait at “Start learning” → dashboard if the background job still is not done — and we never block forever on 404 / error / timeout.

**[Web Core App] [Path] Vocab sessions complete; vocab-check mock page.**
Vocab sessions mark complete after you finish. Vocab check has a dedicated (mock) page ahead of the next day’s backend hookup.

## Monday 20 July 2026

**[Web Core App] [Path] Cloze exercises, including Path progression.**
Cloze is in the learning flow and advances the path when you complete it.

**[Web Core App] Homepage learnable pills are RTL-aware.**
On the Next lesson module, upcoming-word pills right-align (and set `dir`) for RTL targets — Arabic, Hebrew, Persian, Urdu — instead of always hugging the left.

**[Web Core App] Removed leftover 2024 “new feature” tooltips.**
Gone: “New Feature: My Words”, “Introducing My Activities”, “Introducing points and levels”, the proficiency-learning tooltip, and “Let’s get started”. The newer My Words intro for new users is untouched.

## Friday 17 July 2026

**[Web Core App] [Mems] AI image limit copy can show the count.**
The “limit exceeded” string now receives the `count` translations expect, so the message is not broken.

## Wednesday 15 July 2026

**[Web Core App] [Learning] Arabic letter breakdown is on in production.**
The on-demand letter split for Arabic / Persian / Urdu (see 9 July) is no longer staging-only.

**[Web Core App] [Learning] Lookalike characters no longer fail typing / tapping.**
If you type 一 vs ー, or a Cyrillic/Greek letter that looks identical to Latin, we fold both answers through a shared confusable map before scoring. Multiple choice is unchanged. Same map as iOS/Android.

**[Web Core App] [Path] Path data comes from the pathways API.**
No more hardcoded path on the client — we use the deployed backend endpoints.

**[Web Core App] Mobile session header and dashboard card actually fit.**
Customise features and report issue show on mobile (keyboard shortcuts stay desktop-only). “Change Word list” no longer overflows the card. Native-speaker preview video is visible on mobile instead of collapsing to zero height.

## Monday 13 July 2026

**[Web Core App] [Onboarding] English fallback courses are on in production.**
For non-English source languages, English-taught courses show on the language page. Sort by popularity (default) or alphabetically.

**[Web Core App] [Onboarding] Don’t offer your own language as an English-taught target.**
If you speak Italian, Italian no longer appears in the “taught in English” target list.

**[Web Core App] [Learning] “Show answer before test” on difficult-words review.**
Toggle on the customise-learning surface. **On** (default) shows the meaning first, as today. **Off** tests you first and reveals the meaning in feedback — no flash of the answer while settings load.

**[Web Core App] [Mems] Mem generation feels less dead while you wait.**
Loading bar while AI images generate, plus a few Mem UX nips.

## Saturday 11 July 2026

**[Web Core App] [Mems] New Mems are private by default.**
Creating a Mem no longer defaults to public.

## Thursday 9 July 2026

**[Web Core App] [Learning] Letter breakdown for Arabic, Persian, and Urdu (staging).**
On the presentation card: **Show letter breakdown** splits joined script (e.g. سلام → س + ل + ا + م). Multi-word items keep a wider gap between words, not a `+`. Customise learning gets a **Letter breakdown** toggle (default on), only for Arabic / Persian / Urdu. Hidden in production for now (same pattern as character tracing).

**[Web Core App] [Onboarding] English-taught courses where the source language is thin.**
If your source language has too few courses, we surface English sources so you still have something to learn. (Production follow-up on 13 July.)

**[Web Core App] [Onboarding] Sort languages by popularity or A–Z.**
On the languages dashboard and Bienvenue “I speak… want to learn…”. Default is popularity (then alphabetical); falls back to A–Z if popularity is not on the API yet. Dashboard used to be A–Z only; onboarding used raw API order.

**[Web Core App] [Path] Path page improvements, session-track box, mark-ready helper.**
More path-page polish, a Sessions track box on the map, and a helper to mark words as ready for review.

## Wednesday 8 July 2026

**[Web Core App] [Path] The Path page exists.**
First Path surface on web (still staging / in development at this point), with a follow-up pass the same day.

**[Web Core App] [Learning] Character tracing for CJK, kana, and hangul (staging).**
Opt-in tracing tests replace typing for single-character Hanzi/kanji (HanziWriter stroke-order quiz) and hiragana / katakana / hangul (canvas + font overlay). Easy = outline stays; Medium = outline fades after ~2.5s; Hard = no outline. 80% stroke accuracy, one retry, then incorrect. Toggle off by default. **Hidden in production.**

**[Internal] Path playground for tuning layout values.**
Internal playground so we can nudge Path geometry without shipping guesswork.

**[Web Core App] Survive denied access to localStorage.**
Stops crashes when storage is blocked (private mode, locked-down browsers).

## Wednesday 1 July 2026

**[Web Core App] Dashboard wordlist card.**
Clearer current-wordlist card on home (layout and hierarchy).

---

## Tuesday 30 June 2026

**[Web Core App] [Learning] Learning toggles now work — and they are on in production.**
The customise-learning side panel is connected to the backend, so your choices stick. Turn Sample Sentences (or other learning extras) off, and they actually disappear from the session. Clicking outside the panel closes it, same as the keyboard shortcuts panel. This is no longer gated off production.

**[Web Core App] [Learning] Sample sentence author, plus a bit of breathing room.**
Sample sentences get a small, subdued info bubble you can open to see who created them. We’ve also added spacing between the sample sentence and mems so they don’t sit on top of each other.

## Monday 29 June 2026

**[Web Core App] [Learning] Sample sentences in learning.**
Example / sample sentences now show in the learning experience on web.

## Tuesday 23 June 2026

**[Web Core App] Spring cleaning is the dashboard.**
The spring-cleaning dashboard was an experiment. The old layout is gone — everyone gets the new Home / Learn / Speak / Explore experience.

**[Web Core App] Next-lesson card: video with a local, plus the next words.**
On the Start next lesson card we now show the immersion video when there is one, and list the next 5 learnables.

**[Web Core App] [Learning] Customise-learning panel (still hidden).**
The toggle UI exists as a side panel with updated copy, but it is not connected to the backend yet and is hidden from learners. That ships for real on 30 June.

## Monday 22 June 2026

**[Web Core App] [Onboarding] New users skip product selection.**
After signup, learners are enrolled in language learning automatically and go straight to skill level. They no longer choose between Memrise, Exam Prep, and Podchats on the way in. Switching product is still available later from the profile menu.

**[Community Courses] Wordlists you can actually scroll to.**
The Wordlists page now scrolls horizontally, so you can reach more than four started wordlists on typical screens (previously the fifth one was unreachable on web). Also fixed checkboxes sitting on top of the footer on the wordlist details page.

## Wednesday 17 June 2026

**[Web Core App] Product switcher moved off the dashboard.**
The product switcher is no longer in the dashboard header, where it competed with starting a session. You’ll find **Switch Product** in the profile dropdown instead.

## Tuesday 16 June 2026

**[Web Core App] Recommended Mission card.**
We now surface a Recommended Mission: Beginners with enough beginner missions get a random beginner mission; Intermediate learners with enough intermediate missions get a recommended mission at their level.

**[Community Courses] Bulk mark words as known.**
On a wordlist page you can select several learnables and mark or unmark them as known in one go, instead of tapping them one by one.

You can use Shift + Click on a desktop or mobile with a mouse to bulk select in one fell swoop.

## Thursday 11 June 2026

**[Web Core App] Spring cleaning for existing users.**
After a same-day revert (the Scenario button was too hard to find for 2024 users), spring cleaning is opened to older users as well as new ones.

**[Web Core App] Conversations show topics, and you filter by topic.**
Conversation cards now show the topic name (translated by the backend) instead of an unexplained “Mission” or “Chat” label. Filtering is by topic rather than Chats vs Missions, including on the spring-cleaning dashboard. We also removed the “Membot – Powered by AI” button, which pointed at a dead Zendesk page.

**[Web Core App] Pre-mission copy, and Conversations is easier to land on.**
Updated the copy on the pre-mission screen, and added intro text at the top of the Conversations page. Fixed the Scenario tab sending some spring-cleaning (2024) users back to the dashboard by mistake.

## Monday 8 June 2026

**[Web Core App] Spring cleaning for new users.**
New web users (user id above 87502800) now get the spring-cleaning dashboard.

**[Web Core App] Stories, Talk Prep, and Buddies buttons work again.**
Read Stories and Start Practicing were doing nothing on click — they now open Stories (Replit) and Talk Prep. The Buddies entry point was missing and is back.

## Saturday 6 June 2026

**[Web Core App] Video tab is back in the sidebar.**
The Video tab had disappeared from the sidebar (called out on Reddit). It’s visible again.

## Wednesday 3 June 2026

**[Web Core App] [Plans] Condensed plans page, tuned for conversion.**
Lifetime is first and pre-selected, with the “Best value” badge. Discounted plans show a strikethrough old price, “Save X%” where there’s a saving (including monthly), and clearer sub-text: pay once / billed yearly / cancel anytime. The selected Lifetime card has a pulsating glow. CTA is **Unlock Pro now**, with a flash-sale countdown banner, and the layout tightens on short screens so you don’t have to scroll. Stripe checkout has a back button to the plans page, and the top Pro benefits sit above the pay button.

**[Web Core App] Spring cleaning polish (staging).**
Visual pass on the new dashboard, plus the Explore tab now shows for languages that don’t have Buddies. This revamp was still staging-only at this point.

## Tuesday 2 June 2026

**[Web Core App] Dashboard spring cleaning (staging).**
The dashboard is rearranged into Home, Learn, Speak, and Explore. Staging only for now — not the live dashboard for everyone.

## Monday 1 June 2026

**[Web Core App] [Learning] “Actually, I was right” is on in production.**
The button is localised, which was the last blocker. Learners can use it in production.

---

## Thursday 28 May 2026

**[Web Core App] [Plans] Condensed plans page is on in production.**
The condensed plans layout replaces the classic upsell everywhere it appears: `/payment/plans/`, onboarding Choose Plan, and end of session.

## Wednesday 27 May 2026

**[Web Core App] [Learning] “Actually, I was right!” (staging).**
After a wrong answer, learners can mark that they were actually right. Staging only for now, so we can test it before production (that follows on 1 June).

## Tuesday 26 May 2026

**[Web Core App] [Plans] New plans page v2 (behind a flag).**
A redesigned pricing page: dark hero + plans panel on desktop, stacked on mobile, with price-per-day, save badges, social proof, and a sticky mobile CTA. Classic page stays the default until the experiment / query param (`plansVersion=v2`) turns v2 on.

## Monday 25 May 2026

**[Community Courses] AI / community audio generation is on in production.**
The “Community Audios” feature — generate audio for wordlist words — is available to all users in production.

## Wednesday 20 May 2026

**[Web Core App] [Learning] Report an issue from the learn-session header.**
Learners can report a problem from the header of a learn session. Success and error toasts now actually show. Shipped to production the same day, after a URL-prefix fix.

**[Community Courses] AI audio only where Azure can speak the language.**
If we cannot generate audio for a language, the AI option is hidden. Support is expanded to a long list of extra languages (Cantonese, Finnish, Czech, Hungarian, Romanian, Afrikaans, Croatian, Serbian, Bulgarian, and many more — including Toki Pona via Japanese).

**[Community Courses] Community Audios polish.**
Third round of front-end improvements on community audio.

## Tuesday 19 May 2026

**[Community Courses] Editing community learnables.**
Community vs official learnables are visually distinct, with a tooltip on official items. You can now update community learnables (the backend had been ready; web can call it). Localisation for the official tooltip was a merge blocker.

**[Web Core App] [Mems] Mems for everyone, and easier to use.**
Mems are no longer limited by source language — anyone can see them. They move lower on the presentation card so you can read the full text and see several at once. Keyboard shortcuts work in the editor (Cmd/Ctrl+B bold, Cmd/Ctrl+I italics).

**[Community Courses] Community Audio: Pro-only, snappier, rerecord.**
Only Pro users can use community audio generation. AI audio plays as soon as it comes back from the backend. You can rerecord an item. Clicking the waveform starts a recording.

## Monday 18 May 2026

**[Community Courses] Generate AI audio for wordlist words (staging).**
A button to generate audio on community learnables. Staging only until the backend and production rollout (25 May).

## Thursday 14 May 2026

**[Web Core App] Memrise Stories in German.**
German is added as a target language for Memrise Stories (Replit), alongside Spanish, English, and French. Still for English (UK/US) source languages.

## Tuesday 12 May 2026

**[Web Core App] [Mems] Mems on production for English.**
Mems are available in production when the source language is English. Image ratios and cropping are fixed, plus a few UX tweaks from user testing.

## Monday 11 May 2026

**[Web Core App] [Mems] Images on Mems (staging).**
You can upload images with your Mems. Still staging-only at this point.

**[Web Core App] [Mems] Formatting and “where did my Mem go?”**
Bold and italics behave as expected. If you create a Mem early in a session and later miss the same item, you still see the Mem you already made.

## Tuesday 5 May 2026

**[Web Core App] [Mems] Mems on the web client.**
Mems land on web, on the presentation card:

- Create / update modal
- Mem on the card itself
- Gallery of up to 11 Mems side by side
- Edit or delete Mems you created