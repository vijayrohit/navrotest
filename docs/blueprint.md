# **App Name**: Forever Linked

## Core Features:

- Live Stream Player: Display a central, responsive video player that streams the wedding live or shows a holding card with the couple's names when the stream isn't live. Ensure it is optimized for mobile viewing.
- Interactive Reactions: Enable guests to send live, animated reactions (emojis) that float on the screen for all viewers to see. Optimize for mobile.
- Confetti Bomb: Implement a 'Confetti Bomb' button that triggers a full-screen confetti animation for all viewers, with a cooldown to prevent spamming. Optimize for mobile viewing.
- Live Chat: Provide a simple, real-time chat box for guests to send messages and interact, auto-scrolling to the latest message. Optimize for mobile viewing.
- Secure Admin Access: Require username/password to access admin panel, hardcoded (constant string) inside of the source code, with simple 'Invalid credentials' message on failure.
- Admin Dashboard: Provide a simple admin interface at /theadminbro to paste and update the live stream URL, which updates the guest view in real-time using Firestore.

## Style Guidelines:

- Primary color: Lavender (#E6E6FA) to evoke a sense of calm and romance.
- Background color: Off-White (#F8F8FF) for a clean and elegant feel.
- Accent color: Rose Gold (#B76E79) for interactive elements and highlights, providing a touch of sophistication and warmth.
- Headline font: 'Lora' (serif) for major headings like the couple's names, providing an elegant touch. Note: currently only Google Fonts are supported.
- Body font: 'Open Sans' (sans-serif) for chat, buttons, and labels, ensuring clean legibility. Note: currently only Google Fonts are supported.
- Use elegant and joyful icons related to wedding celebrations (e.g., hearts, rings, champagne flutes) for reactions and interactive elements.
- Implement gentle, varied floating paths for reaction emojis, along with a vibrant and satisfying confetti animation for the 'Confetti Bomb' feature.
- Prioritize a single-column layout for optimal mobile viewing experience.
- Ensure all elements are responsive and adapt to different screen sizes and orientations.
