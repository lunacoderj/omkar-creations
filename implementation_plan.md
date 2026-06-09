# Structured Layouts and Skeleton Loading Implementation Plan

This plan aims to restructure the application's layout to be more professional, structured, and consistent. We will introduce reusable UI primitive components for Cards and Skeletons, and refactor existing components to utilize these new primitives, providing a seamless loading experience.

## User Review Required

> [!IMPORTANT]
> Please review the proposed new UI components and the components that will be modified. Are there any other specific components you want updated that are not listed here?

## Proposed Changes

### UI Primitives (New Components)

We will introduce a `ui` folder for reusable generic UI components to improve the architecture.

#### [NEW] `src/components/ui/Card.js`
A reusable base card component providing a consistent, structured container with glassmorphic and hover effects. It will accept `className` and `variant` props to allow for flexible usage.

#### [NEW] `src/components/ui/Skeleton.js`
A primitive skeleton loader component with a pulsing animation to be used as a building block for more complex loading states.

#### [NEW] `src/components/public/ReelCardSkeleton.js`
A specialized skeleton component that perfectly matches the aspect ratio (`9/16`) and layout of the `ReelCard` component.

---

### Refactoring Existing Components

#### [MODIFY] `src/components/public/FeaturedReels.js`
- Replace the inline loading `div` with the new `ReelCardSkeleton` component.
- Extract the inline reel card UI and replace it with the `ReelCard` component to ensure consistency between the homepage and the Reels page.

#### [MODIFY] `src/app/reels/ReelsGrid.js`
- Replace the generic loading `div` array with the new `ReelCardSkeleton` component for a more polished loading state.

#### [MODIFY] `src/components/public/ReelCard.js`
- Ensure the card uses a consistent structure. Currently, it has a custom 3D hover effect. We'll make sure the underlying container aligns with the new structural aesthetics.

#### [MODIFY] `src/components/public/AboutWork.js`
- Wrap the 4 "What I Do" service blocks in the new `Card` component to provide structured, clear boundaries for each service rather than floating content.

#### [MODIFY] `src/components/public/Hero.js`
- Refactor the "Stats" row at the bottom of the Hero section to use a minimal version of the `Card` component, giving the stats a grounded, professional structure instead of floating text.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- We will verify the changes locally using the Next.js dev server.
- Review the `FeaturedReels` and `ReelsGrid` components to ensure the skeleton loaders appear correctly during the simulated data fetch.
- Verify that `AboutWork` and `Hero` stats row look visually structured and responsive across different screen sizes.
