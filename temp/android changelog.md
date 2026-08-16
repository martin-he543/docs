# Android daily notes (4 May – 13 August 2026)

User-facing work on `Memrise-Android` (`origin/develop`), newest first. Dependency bumps, translation dumps, CI/pipeline-only work, and analytics-only instrumentation are omitted. Copy a day’s `##` block as needed.

---

## Tuesday 4 August 2026

**[Android] Set a password if you signed in with SSO.**
Edit Profile always asked for an old password. SSO accounts that never had one could not set one. If the account has no usable password, you now get a set-password form (new password only). After it saves, the UI switches to the usual change-password flow. Accounts that already have a password are unchanged.

## Wednesday 29 July 2026

**[Android] Home no longer shows the old language while it loads.**
Switching learning language used to keep the previous language’s Home cards on screen (often for a long time, with no spinner). Home now resets to a loading state and fills in the new language. Turning the network off and on without changing language still keeps your cards, so it does not flicker for no reason.

**[Android] [Plans] Banner text on the plans page.**
The plans page can show banner copy from growth/template config (same idea as iOS).

## Monday 27 July 2026

**[Android] Removed leftover 2024 “new feature” chrome.**
Gone: the post-onboarding **Let’s get started** wordlist welcome popup, and the one-time **community wordlists** promo bottom sheet. Community wordlists themselves are unchanged.

## Friday 24 July 2026

**[Android] [Learning] Speed Review no longer loops after you run out of lives.**
Timing out used to skip the word without recording it as wrong, so the same due words came straight back: fail → end of session → continue → same words again. A timeout now counts as an incorrect answer, so you can actually leave Speed Review.

## Wednesday 22 July 2026

**[Android] More 2024 intro tooltips removed.**
Gone: “Introducing My Activities”, “New Feature: My Words”, and “Introducing points and levels”.

**[Android] Scenario reviews load again.**
Scenario reviews were dying in a generic error popup: the client had started parsing review dates too strictly for what the backend sends. Parsing is tolerant again, so reviews open.

## Tuesday 21 July 2026

**[Android] [Learning] “Show answer before test” on difficult-words review.**
You can turn off seeing the meaning before the test. The toggle can be changed during the test (it no longer ignores you mid-session). **On** (default) still shows the meaning first.

**[Android] Removed the 2024 “check out your proficiency” tooltip.**

**[Android] [Mems] Mem strings no longer show placeholder keys.**
Translation placeholders for Mems are removed so learners see real copy.

## Wednesday 15 July 2026

**[Android] [Learning] `l` and `I` are distinct again.**
The lookalike map had folded Latin `l` into `I`, which (with lowercasing) made French `mal` pass for `mai`. That pair is dropped. Other lookalikes are unchanged.

## Monday 13 July 2026

**[Android] [Learning] Lookalike characters no longer fail typing / tapping.**
If you type 一 vs ー, or a Cyrillic/Greek letter that looks identical to Latin, both answers go through a shared confusable map before scoring. Multiple choice is unchanged. Same map as web and iOS.

**[Android] [Mems] New Mems are private by default.**
Creating a Mem no longer defaults to public.

**[Android] [Mems] See the AI image before you save the Mem.**
AI image generation now matches web: you can preview the image before creating the Mem.

## Wednesday 8 July 2026

**[Android] [Mems] Mems polish: create, images, customise learning.**
Mems and the learning bottom sheet keep moving forward:

- Upload an image from the device (button look and colour cleaned up)
- Create button actually works
- Customise-learning toggle no longer snaps back to the previous value
- Sample sentences are on the toggle list
- Crash on this flow is fixed

**[Android] Home updates when you change language.**
Picking a different learning language used to leave Home stuck on the old language until you killed the app. Home now reloads for the new pair immediately.

## Tuesday 7 July 2026

**[Android] [Mems] Mems land on Android.**
Mems show in learning, with the start of a customise-learning bottom sheet (same family as web’s learning toggles).

## Monday 6 July 2026

**[Android] [Plans] Plans page update.**
Plans page brought in line with the current growth designs (layout / conversion pass).

## Friday 3 July 2026

**[Android] [Learning] Sample sentence cards.**
Example sentences get a dedicated card in the learning UI (building on 1 July).

## Thursday 2 July 2026

**[Android] Launch / network crashes after the 29 June release.**
A Ktor bump was taking the app down on launch and navigation (`Unbalanced enter/exit`, network-on-main-thread). Reverted to the previous Ktor so cold start and tab switching are stable again.

## Wednesday 1 July 2026

**[Android] [Learning] Sample sentences.**
Example / sample sentences now show in the Android learning experience.

## Monday 29 June 2026

**[Android] Home wordlist video no longer re-downloads in a loop.**
The “video with a local” preview on the current-wordlist card was requesting the same MP4 many times per second. It now caches, keeps a stable player, and does not tear down on every refresh.

## Monday 22 June 2026

**[Android] Conversations screen improvements.**
Conversation / Speak tab polish (topics, layout, easier to start a chat — same pass as the other clients).

**[Android] Progress row taken off the wordlist card (for now).**
The “N words learnt • M left” row was using a progress fetch with bad counts (and extra load). The card goes back to video preview + next-session words only. (The row had shipped on 18 June.)

## Friday 19 June 2026

**[Android] [Onboarding] New users skip product selection.**
After signup, learners are enrolled in language learning automatically and go to skill level. They no longer choose Memrise / Exam Prep / Podchats on the way in. Switching product is still in Settings.

**[Android] Locals preview: first frame and rounded corners.**
The Home wordlist video no longer shows a black band on the first frame, and it clips to the card’s rounded corners.

## Thursday 18 June 2026

**[Android] Next-lesson card: tap to unmute, pause off-screen, progress row.**
On the current-wordlist card:

- Tap anywhere on the video to unmute (corner speaker is just an indicator)
- Playback pauses when you scroll the card away or background the app
- Progress row: “N words learnt • M left to learn” plus a bar (this row is pulled again on 22 June because the counts were wrong)

**[Android] Product switcher moved to Settings.**
The product switcher is no longer in the dashboard app bar. **Switch Product** lives in Settings instead.

## Wednesday 17 June 2026

**[Android] Next-lesson card: video with a local, plus the next words.**
The current-wordlist Continue learning card shows an inline looping preview (muted) and up to 5 upcoming learnables as chips. Tap a chip to switch video. Failure degrades to the plain card — it never starts a real lesson just to preview.

## Tuesday 16 June 2026

**[Community Courses] Search community wordlists.**
Community wordlists get a proper browse/search dashboard, with a collapsible header.

**[Android] [Plans] Plans page driven from the API.**
Payments / plans use the API response rather than a fully hardcoded page, so prices and plans can change without an app release.

## Thursday 11 June 2026

**[Android] [Learning] Report an issue.**
Learners can report a problem from the learning experience (same idea as web’s session-header report button).

**[Android] Dark mode fix.**
Dark mode on the new surfaces is corrected.

## Tuesday 3 June 2026

**[Android] [Learning] “Actually, I was right”.**
After a wrong answer, learners can mark that they were actually right. Copy is localised.

## Monday 2 June 2026

**[Android] Dashboard spring cleaning.**
New Home / Explore (and related) screens: AI Buddies card, Explore tab fixes, navigation and reload behaviour. This is the Android side of the dashboard rearrange.

## Sunday 1 June 2026

**[Android] Error bottom sheet.**
A proper error bottom sheet when something fails to load, instead of a dead screen.

## Thursday 29 May 2026

**[Android] Crash fix.**
Stability fix on the new dashboard / loading path.

## Wednesday 7 May 2026

**[Android] Stale language pair in the database.**
The app could keep a leftover language pair in local storage and show the wrong course. That stale value is cleared / refreshed.