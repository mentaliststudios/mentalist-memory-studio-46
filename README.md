# Mentalist Memory Studio (46)

MENTALIST — PHASE 1.1: VISUAL FOUNDATION & APPLICATION ARCHITECTURE

Act as a senior frontend engineer, product designer, UI/UX architect, and software architect.

Your task is to build or refine the visual and structural foundation of MENTALIST, a premium, playful, interactive memory-training application.

This prompt REPLACES the previous visual direction.

If an existing Mentalist project is already present, inspect it first and preserve useful working architecture, routes, components, and code. Do not unnecessarily rebuild working functionality.

The new visual direction is mandatory.

---

1. PRODUCT VISION

Mentalist is a specialized memory and memorization application.

Its purpose is to help users:

- Memorize information.
- Build Memory Palaces.
- Learn memorization techniques.
- Create visual associations.
- Practice active recall.
- Train different memory skills.
- Monitor their practice and performance.

Mentalist should make memory training enjoyable, approachable, and engaging.

It must NOT look like a generic study application, an Anki clone, a generic chatbot, or a collection of disconnected games.

The product should have its own recognizable identity.

Tagline:

"Make your memory extraordinary."

2. NEW VISUAL DIRECTION

The previous predominantly dark visual direction is no longer the desired default.

Create a design system based on:

Clean + Playful + Premium + Gamified.

The visual experience should feel:

- Friendly.
- Creative.
- Intelligent.
- Colorful but controlled.
- Approachable.
- Modern.
- Interactive.
- Refined.
- Motivating.

Use Duolingo as inspiration for its friendly and engaging learning experience, NOT as a template to copy.

Do not copy its mascot, branding, proprietary illustrations, or exact layouts.

Combine the friendliness of a gamified learning application with the clarity and quality of a premium SaaS product.

3. COLOR SYSTEM

Use a predominantly LIGHT interface.

Suggested design palette:

Primary background: #F8F7FF
Main surface: #FFFFFF
Secondary surface: #F1EDFF
Soft lavender: #E9DEFF
Primary violet: #8055E8
Secondary violet: #A78BFA
Dark text: #27213A
Secondary text: #77738A
Border: #EAE6F2
Mint: #BDEFD8
Soft yellow: #FFE5A8
Soft pink: #FFC9D8

Use colors consistently through design tokens.

Guidelines:

- White and very light lavender should dominate the interface.
- Violet should establish brand identity.
- Mint, yellow, and pink should provide occasional visual accents.
- Text must maintain strong readability.
- Do not use every accent color simultaneously.
- Avoid excessive gradients.
- Avoid excessive shadows.
- Avoid neon effects.
- Avoid dark backgrounds as the primary interface.
- A future optional dark mode is not part of this phase.

4. VISUAL PERSONALITY

Make the application visually distinctive.

Use:

- Rounded but sophisticated cards.
- Friendly icons.
- Soft illustrated details.
- Clear typography.
- Spacious layouts.
- Subtle transitions.
- Small visual rewards.
- Attractive progress indicators.
- Carefully designed empty states.
- Friendly microcopy.

Avoid:

- Childish cartoon aesthetics.
- Excessively playful typography.
- Too many floating decorations.
- Excessive emojis.
- Excessive pill-shaped containers.
- Random illustrations.
- Generic template layouts.
- Overloaded dashboards.

The product must remain credible as a professional application.

5. OPTIONAL BRAND MASCOT DIRECTION

The brand may eventually have a small original mascot associated with memory, imagination, or mental training.

For this phase:

- Do not spend time building a complex mascot system.
- Do not copy existing mascots.
- If a small illustrative character is useful, make it original and visually consistent.
- A mascot must never interfere with the application's usability.

The product identity should work even without a mascot.

6. TECHNOLOGY AND ARCHITECTURE

Respect the existing project configuration.

Preferred technologies:

- React.
- TypeScript.
- Tailwind CSS.
- Existing shadcn/ui components where appropriate.
- Lucide icons.
- Existing routing solution.

Avoid unnecessary dependencies.

Keep the architecture modular and maintainable.

Suggested structure:

src/
components/
layout/
navigation/
dashboard/
ui/
pages/
Dashboard.tsx
MemoryPalace.tsx
Techniques.tsx
Training.tsx
Assistant.tsx
Progress.tsx
hooks/
lib/
config/
types/
styles/

Adapt to the existing project structure instead of duplicating files.

7. APPLICATION NAVIGATION

Create a shared application shell.

DESKTOP:

A clean sidebar on the left containing:

- Mentalist logo or wordmark.
- Dashboard.
- Memory Palace.
- Techniques.
- Training.
- AI Assistant.
- Progress.

Use friendly, consistent Lucide icons.

The selected navigation item should have a soft violet background and clear visual distinction.

The sidebar should feel light, modern, and integrated with the interface.

MOBILE:

Create a responsive bottom navigation with the six primary sections.

Ensure:

- Sufficient touch targets.
- Clear active states.
- No overlapping content.
- Good readability.
- Appropriate spacing.
- Smooth navigation.

Adapt naturally to tablet and intermediate screen sizes.

8. ROUTES

Configure:

/dashboard
/memory-palace
/techniques
/training
/assistant
/progress

The root route should consistently open the Dashboard.

All navigation items must work.

Use shared layouts and avoid duplicate pages.

9. DASHBOARD

Create an engaging and welcoming Dashboard.

It should immediately communicate the purpose of Mentalist.

Include:

Welcome area

"Welcome back"

"Ready to make your memory stronger?"

Do not invent the user's name.

Daily motivation

Create a tasteful section introducing the concept of daily memory practice.

Do not create fake achievements or claim completed activities.

Quick actions

- Create a Memory Palace.
- Start Memory Training.
- Explore Techniques.

Each action must navigate to its appropriate section.

Practice overview

Prepare visual areas for:

- Practice sessions.
- Review tasks.
- Training time.
- Current streak.

For new users, show helpful empty states.

Do not display fabricated numbers.

Recent activity

Use a friendly empty state:

"No memories created yet."

"Start your first practice session and your journey will appear here."

Recommended starting point

Create an attractive introductory section that guides beginners toward Memory Palace and basic memory techniques.

The Dashboard should feel alive without relying on fabricated user information.

10. MEMORY PALACE

Create the visual foundation for the Memory Palace.

This feature is central to Mentalist.

Use an imaginative, friendly, illustrated visual language.

Include:

- Page title.
- Brief explanation of the Method of Loci.
- Create Palace entry point.
- Empty state.
- Visual area for future palace templates.
- Preview cards for possible environments.

Environment examples:

- Bedroom.
- Living Room.
- Kitchen.
- Office.
- Hallway.

The visual presentation should make the user curious to explore and create their own mental spaces.

Use soft illustrations and tasteful visual details.

Do not implement 3D.

Do not implement the complete editor or database persistence yet.

11. MEMORY TECHNIQUES

Create a clean and attractive techniques library.

Include:

- Memory Palace.
- Visual Association.
- Mnemonics.
- Acronyms.
- Chunking.
- Number Memorization Systems.
- First-Letter Method.
- Active Recall.

Each technique should have:

- Name.
- Short description.
- Appropriate icon or illustration.
- Clear visual hierarchy.
- Future tutorial entry point.

Use distinct but consistent visual accents.

Do not make the entire page a repetitive grid of identical generic cards.

12. MEMORY TRAINING

Create a friendly training hub.

Initial categories:

1. Visual Memory.
2. Sequence Memory.
3. Word Memory.
4. Association Challenge.

Each category should have:

- Distinct visual identity.
- Brief explanation.
- Clear entry point.
- Space for future difficulty levels.

Use a gamified visual language without implementing fake exercises or scores.

Make the page feel interactive and motivating.

13. AI MEMORY ASSISTANT

Create the interface for a specialized memory assistant.

Title:

"AI Memory Assistant"

Supporting text:

"Turn information into memorable associations."

Include suggested prompts:

- Help me memorize the planets.
- Create a mnemonic for this information.
- Turn this text into memorable associations.
- Help me build a Memory Palace.

The interface should feel friendly, intelligent, and specialized.

Do not create fake AI responses.

Do not integrate paid APIs.

Clearly identify that the assistant is being prepared if the actual generation system is not implemented.

14. PROGRESS

Create a clean and motivating progress page.

Prepare areas for:

- Practice history.
- Training sessions.
- Accuracy by exercise type.
- Training time.
- Review activity.
- Practice frequency.
- Streak.

Use visually attractive progress components.

Do not generate fake charts or statistics.

For a new user, use friendly empty states explaining that real statistics will appear after practice.

15. GAMIFICATION DESIGN LANGUAGE

Establish a visual foundation for future gamification.

Potential future elements include:

- Daily goals.
- Streaks.
- Experience points.
- Levels.
- Achievements.
- Progress milestones.
- Friendly feedback.
- Training completion animations.

For this phase, these are visual design references only.

Do not implement an artificial scoring system or fabricate achievements.

Use subtle gamified visual details where they improve the experience.

The application should motivate users without becoming distracting or childish.

16. DESIGN COMPONENTS

Build reusable components where appropriate:

- ApplicationSidebar.
- MobileBottomNavigation.
- PageHeader.
- SectionHeader.
- EmptyState.
- QuickAction.
- FeatureCard.
- ProgressIndicator.
- NavigationItem.
- IllustrationContainer.

Use consistent design tokens, spacing, typography, borders, and radii.

17. RESPONSIVENESS AND ACCESSIBILITY

Test and optimize:

- 1440px desktop.
- 1024px tablet.
- 768px tablet/mobile transition.
- 390px mobile.
- 360px mobile.

Avoid horizontal overflow.

Ensure:

- Semantic HTML.
- Keyboard navigation.
- Accessible labels.
- Good contrast.
- Visible focus states.
- Readable typography.
- Appropriate touch targets.

18. BACKEND PREPARATION

Supabase will be integrated in Phase 2.

Do not:

- Connect Supabase now.
- Create database tables.
- Implement authentication.
- Introduce paid services.
- Expose secrets.
- Create fake integrations.

Keep the frontend ready for future backend integration.

19. STRICT SCOPE

Do not implement:

- Payment systems.
- Subscription checkout.
- Paid APIs.
- 3D Memory Palace.
- Complex memory games.
- Real AI generation.
- Database persistence.
- Authentication.
- Fake statistics.
- Unapproved functionality.

Preserve existing working functionality.

Do not unnecessarily replace existing architecture.

20. QUALITY ASSURANCE

Before completion:

1. Check all routes.
2. Check desktop navigation.
3. Check mobile navigation.
4. Verify responsive behavior.
5. Check TypeScript errors.
6. Check console errors.
7. Check imports.
8. Check component duplication.
9. Check interactive elements.
10. Check content overflow.
11. Check visual consistency.
12. Verify the interface is predominantly light.
13. Verify the interface does not look excessively childish.
14. Verify that no invented statistics are presented.
15. Verify no paid services were integrated.

Do not claim a test passed unless it was actually performed.

21. COMPLETION REPORT

Report:

- Implemented pages.
- Created components.
- Configured routes.
- Design system and color tokens.
- Responsive improvements.
- Existing files modified.
- Dependencies added.
- Errors and warnings.
- Features left for future phases.
- Whether Supabase was connected.
- Whether paid services were introduced.

Do not start Phase 2.

Wait for further instructions.

FINAL OBJECTIVE:

Build a distinctive, clean, playful, premium, and responsive visual foundation for Mentalist.

The application should make memory training feel enjoyable and approachable while maintaining the quality and credibility of a professional software product.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1eca0e54-68d6-4468-8e8b-3118fadb17fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
