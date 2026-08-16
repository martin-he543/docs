# iOS daily notes (11 May – 10 August 2026)

User-facing work on `Memrise-iOS` (`origin/develop`), newest first. Dependency bumps, translation dumps, Fastlane/GHA/CircleCI-only work, and analytics-only instrumentation are omitted. Copy a day’s `##` block as needed.

---

## Monday 10 August 2026

**[iOS] Force update works again.**
The force-update prompt had been disabled. Learners on a too-old build are asked to update again.

## Wednesday 5 August 2026

**[iOS] Set a password if you signed in with SSO.**
Settings → Change Password now checks whether the account already has a password (`has_password_set`). SSO accounts that never set one get a set-password form (no old password). Everyone else still gets the usual change-password flow.

**[iOS] Removed the 2024 “check out your proficiency” tooltip.**
The legacy “check out your proficiency level” dashboard interruption for the pre–My Progress cohort is gone.

## Friday 31 July 2026

**[iOS] Push and in-app messaging move to Customer.io.**
Customer.io is wired for push and identify (EU). Braze is then fully removed now that the contract has ended — Customer.io is the CRM/push provider. Campaigns that used to key off Braze client events need to live on the new stack.

## Friday 17 July 2026

**[iOS] Removed “Let’s get started”.**
The post-onboarding wordlist welcome popup for from-scratch learners is gone. Those users land on the dashboard. (The separate “Let’s start with this experience” screen is untouched.)

**[iOS] Immerse: switch YouTube vs Memrise video.**
Immerse gets a filter to switch between YouTube-hosted and Memrise-hosted videos.

## Thursday 16 July 2026

**[iOS] More 2024 intro tooltips removed.**
Gone: “Introducing My Activities” and “Introducing points and levels”.

## Wednesday 15 July 2026

**[iOS] [Learning] `l` and `I` are distinct again.**
The lookalike map had folded Latin `l` into `I`, which (with case-insensitive scoring) made French `mal` pass for `mai`. That pair is dropped. Other lookalikes are unchanged.

## Tuesday 14 July 2026

**[Community Courses] Community wordlists promo sheet removed.**
The one-time “community wordlists” bottom sheet is gone. The real community wordlists feature is unchanged.

## Monday 13 July 2026

**[iOS] Spring-cleaning dashboard is the dashboard.**
The feature flag that gated the spring-clean redesign is removed — everyone gets the new layout.

**[iOS] [Learning] Lookalike characters no longer fail typing / tapping.**
If you type 一 vs ー, or a Cyrillic/Greek letter that looks identical to Latin, both answers go through a shared confusable map before scoring. Multiple choice is unchanged. Same map as web and Android.

## Monday 6 July 2026

**[iOS] Progress reporting.**
Progress on iOS was wrong / missing in places; it now reports correctly.

## Wednesday 1 July 2026

**[iOS] [Plans] Flash sale plans page.**
Flash-sale plans get a timer, banner text from config, and the normal plans page can use the same template language. Debug sign-in helpers for this flow land the same day (not shown to learners).

## Thursday 25 June 2026

**[iOS] [Plans] Plans page design pass.**
Plans page updated to the current growth design.

## Wednesday 24 June 2026

**[iOS] [Plans] Flash sale page type, plus template copy.**
A dedicated flash-sale plans page (still being iterated), and support for template language so banner/headline copy can come from config rather than a hard-coded string. Trial templates are dropped.

**[Community Courses] Community wordlists stay in sync if you go Pro.**
The community wordlists screen observes Pro status, so locked / unlocked state updates if you subscribe without leaving the screen. Wordlist preview glitches on this flow are fixed.

## Tuesday 23 June 2026

**[iOS] Next-lesson card: video with a local, plus progress.**
On the current-wordlist Continue learning card (Big5 Home):

- Progress row: “N words learnt • M left to learn” plus a thin bar (hidden if the list is empty)
- Next session: up to 5 upcoming learnables that have a presentation video, as chips over a muted looping player
- Tap anywhere on the video to unmute; pause when scrolled off-screen or backgrounded
- Chromeless player (no iOS transport controls flashing)

Preview is a read of the learn-session endpoint — it does not start a real lesson.

**[Community Courses] Browse community wordlists.**
A dedicated Community Wordlists screen: search, alphabetical order, larger cards (not the tiny ones), no random shuffle of the list.

## Monday 22 June 2026

**[Community Courses] Community wordlists on iPhone SE and iPad.**
Layout works on small phones (iPhone SE portrait was using the “regular” size class and breaking). Descriptions hide on small screens. Content aligns on iPad.

## Thursday 18 June 2026

**[iOS] Nuggets.**
Nuggets land on iOS (short learning bites / extras in the app).

**[iOS] Pre-conversation copy can wrap.**
Text on the pre-mission / pre-conversation screen can use multiple lines instead of truncating. A banner on that surface is removed.

## Wednesday 17 June 2026

**[iOS] Conversations: topic, Conversation of the day, speaking first.**
Conversation cards show the **topic** instead of an unexplained Chat vs Mission label. Filtering is by topic. Conversation of the day is surfaced. Speaking is more prominent on the pre-start mission screen.

## Tuesday 16 June 2026

**[iOS] Product switcher moved to Settings.**
The JTBD / product picker is no longer in the dashboard header. You’ll find it in Settings.

**[iOS] [Onboarding] New users skip product selection.**
After signup or sign-in, learners go straight into language learning. They no longer choose Memrise / Exam Prep / Podchats on the way in. Switching product is still in Settings.

**[iOS] [Plans] Plans page driven from the API.**
Plans (and the dashboard banner) come from `POST /v1/marketing/plans_page/config/` with `platform: "ios"`, so variants, page type, and banner text can change without an app release.

## Sunday 8 June 2026

**[iOS] Dashboard redesign (behind a flag).**
New dashboard layout for new users, gated by a feature flag. (The flag comes off on 13 July — then it is the default.)

**[iOS] YouTube playback: a real error sheet (flagged off).**
If an Immerse YouTube embed fails for a recoverable reason (HTML5 / not embeddable — often VPN or signed-out YouTube), learners get a **Video Playback Error** sheet:

- Check you are logged into YouTube on this device
- VPNs can break playback — try turning one off
- **Open YouTube** / **Cancel**

Unrecoverable errors still toast and dismiss. Default **off** until the flag is on.

## Thursday 29 May 2026

**[iOS] Start session on a wordlist actually starts.**
The start-session button on a wordlist could fail / get interrupted. It starts the session again.

## Tuesday 27 May 2026

**[iOS] Always have a wordlist.**
If the backend does not return an active wordlist, iOS now activates the personal wordlist so Home is not stuck in an empty state.

## Sunday 11 May 2026

**[iOS] App Store review prompt.**
Learners can be asked to rate the app on the App Store (system review prompt).