# MOM Frontend Project Memory

## Project Overview
- Next.js app for pregnancy health management (MOM孕期助手)
- Uses Tailwind CSS with custom design tokens in `tailwind.config.ts`
- Primary color: `#e87c3e` (DEFAULT), `#FF8C42` (600)
- Gold color: `#E8A020` with `gold-50: #fffbec`

## Key Components
- `TabBar` at `src/components/layout/TabBar.tsx` - 'use client', uses `usePathname`
- `NavBar` at `src/components/layout/NavBar.tsx` - accepts `backHref` (string), NOT `onBack` prop
- `DateWheelPicker` at `src/components/ui/DateWheelPicker.tsx` - wheel date picker with year/month/day
- `InviteBanner` at `src/components/business/InviteBanner.tsx` - purple gradient invite banner
- `ProfileMenuExtras` at `src/components/business/ProfileMenuExtras.tsx` - membership menu items

## Known Pre-existing Issues
- `src/app/assistant/report-upload/page.tsx` line 65: TS error - `.icon` property doesn't exist on type

## Navigation Patterns
- Use `Link` component for navigation, not `router.push`
- All pages use 'use client' directive when they need interactivity
- Client components (TabBar) can be imported into any page component
