import './globals.css';

export const metadata = {
  title: 'Redpoint Home Solutions | Sell Your Colorado Home Fast — Any Situation, Any Condition',
  description: 'Inherited a house? Going through divorce? Facing tax liens or code violations? Need to move fast? We help Denver metro homeowners understand their options and sell on their timeline. Zero fees, zero pressure.',
  keywords: 'sell house fast Denver, inherited house Colorado, sell house divorce Denver, tax lien help Colorado, code violations Denver, cash home buyer Denver, we buy houses Denver',
  openGraph: {
    title: 'Redpoint Home Solutions | Your House Is a Problem. Let\'s Solve It Together.',
    description: 'We help Denver metro homeowners in tough situations understand their options. Inherited property, divorce, tax liens, code violations, forced moves. Zero fees, zero pressure.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Redpoint Home Solutions',
  },
};

const ADA_GLOBAL_CSS = `
  /* Skip-to-content link — hidden until focused */
  .skip-to-main {
    position: absolute;
    left: -9999px;
    top: 0;
    z-index: 99999;
    padding: 12px 20px;
    background: var(--warm);
    color: var(--bg);
    font-family: 'DM Sans', -apple-system, sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    border-radius: 0 0 6px 0;
  }
  .skip-to-main:focus {
    left: 0;
    top: 0;
    outline: 3px solid var(--cream);
    outline-offset: 2px;
  }
  /* Global visible focus ring for keyboard users */
  *:focus-visible {
    outline: 2px solid var(--warm);
    outline-offset: 2px;
    border-radius: 2px;
  }
  /* Suppress focus outline for mouse users on controls with their own affordance */
  button:focus:not(:focus-visible),
  a:focus:not(:focus-visible) {
    outline: none;
  }
  /* Reduced motion — respect user preference */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
  /* Screen-reader-only utility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <style dangerouslySetInnerHTML={{ __html: ADA_GLOBAL_CSS }} />
      </head>
      <body>
        <a href="#main-content" className="skip-to-main">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
