# Design System Documentation: High-End Editorial

## 1. Overview & Creative North Star

### The Creative North Star: "The Kinetic Archive"
This design system is built upon the concept of **The Kinetic Archive**. It treats the digital interface not as a flat screen, but as a vast, pressurized void where information is presented with the precision of a high-end editorial lookbook and the velocity of modern aerospace technology. 

By drawing inspiration from the mathematical rigor of Linear and the fluid luminance of Stripe, we move away from "standard" UI. We embrace **Intentional Asymmetry**—where large-scale typography creates a heavy visual anchor, allowing UI elements to float with breathing room that feels expensive. We break the template look by prioritizing tonal depth over structural lines, creating a rhythmic flow that guides the eye through light and shadow rather than boxes and borders.

---

## 2. Colors & Surface Logic

The color palette is rooted in a "Deep Space" philosophy. We use dark tones not merely for aesthetics, but to create a vacuum where our electric accents can truly vibrate.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. 
Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` (#1B1B20) section should sit directly against a `surface` (#131318) background to create a soft, sophisticated edge. If you feel the need to "box" something, use white space or a subtle tonal shift instead.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of obsidian glass.
- **Base Layer:** `background` (#131318) for the main canvas.
- **Nesting Logic:** Use `surface_container_lowest` (#0E0E13) for recessed areas (like sidebars or footers) and `surface_container_high` (#2A292F) for elevated interactive elements.
- **Glassmorphism:** For floating menus or navigation bars, use `surface` (#131318) at 70% opacity with a `20px` backdrop-blur. This ensures the layout feels integrated and "liquid" rather than static.

### The "Glass & Gradient" Rule
To achieve a signature look, use the **Electric Indigo-to-Cyan Gradient** (#6366F1 to #06B6D4) sparingly but impactfully. 
- **Signature Textures:** Apply this gradient to primary CTAs, progress bars, or as a subtle "glow" behind hero images. 
- **Luminance:** Always pair the gradient with a high-blur "aura" (shadow) of the same color at 15% opacity to simulate light emission.

---

## 3. Typography: Editorial Authority

The typography scale is designed to create a "Pulse." We pair the mechanical, tech-forward nature of **Space Grotesk** with the Swiss-inspired utility of **Inter**.

- **Display & Headlines (Space Grotesk Bold):** These are your "Vocal" elements. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an authoritative, editorial feel. These should often be the largest elements on the page, pushing the boundaries of the grid.
- **Body & Titles (Inter):** These are your "Functional" elements. Inter provides the legibility required for complex data. 
- **The Hierarchy Strategy:** Contrast is king. Pair a massive `display-md` headline with a tiny, all-caps `label-md` in `on_surface_variant` (#C7C4D7) to create a high-fashion, premium information density.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than traditional structural lines or heavy shadows.

### The Layering Principle
Depth is achieved by stacking the surface-container tiers. 
- **Recession:** Place a `surface_container_lowest` card on a `surface` background to suggest it is "cut out" of the interface.
- **Lift:** Place a `surface_container_highest` element over a `surface_container_low` to suggest it is physically closer to the user.

### Ambient Shadows & Ghost Borders
- **Ambient Shadows:** When a "floating" effect is required (e.g., a modal), use a shadow with a `60px` blur and `8%` opacity. The shadow color must be tinted with the `primary` (#C0C1FF) token to maintain the "Deep Space" atmosphere.
- **The Ghost Border:** If a border is absolutely necessary for accessibility, it must be a **Ghost Border**: use the `outline_variant` (#464554) at 20% opacity. **Forbid 100% opaque, high-contrast borders.**

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (#6366F1 to #06B6D4) with `on_primary_fixed` text. Radius: `md` (0.375rem).
- **Secondary:** Semi-transparent `surface_bright` (#39383E) with a Ghost Border.
- **Tertiary:** Pure text using `primary_fixed_dim` (#C0C1FF) with a hover state that increases the background opacity to 5%.

### Input Fields
- **State Logic:** Default state has no border, only a `surface_container_highest` background. On focus, apply a `1px` Ghost Border using the `secondary` (#4CD7F6) color at 40% opacity and a subtle outer glow.
- **Typography:** Labels use `label-md` in `on_surface_variant`.

### Cards & Lists
- **Forbid Dividers:** Do not use lines to separate list items. Use `24px` of vertical white space or alternate background tones (`surface_container_low` vs `surface_container_lowest`).
- **Interaction:** Cards should have a subtle scale-up effect (1.02x) on hover, shifting the background from `surface_container_low` to `surface_container_high`.

### Chips & Badges
- **Style:** Small, `full` (9999px) radius. Use `surface_container_highest` with `label-sm` text. They should look like precision-milled components.

---

## 6. Do's and Don'ts

### Do:
- **Do** embrace extreme negative space. Let the "Deep Space" background breathe.
- **Do** use intentional asymmetry—align a headline to the left and a CTA to the far right to create a sophisticated, non-template layout.
- **Do** use `primary_fixed_dim` for icons to give them a premium, metallic sheen.

### Don't:
- **Don't** use pure white (#FFFFFF). Always use `on_surface` (#E4E1E9) for text to prevent eye strain and maintain the premium dark aesthetic.
- **Don't** use standard 1px borders or dividers. If the layout feels messy, use more spacing, not more lines.
- **Don't** use serifs. This design system is strictly tech-forward and architectural.
- **Don't** use "flat" buttons. Always apply a subtle 0.5px "top-light" (a very faint highlight on the top edge) to simulate a physical, machined surface.