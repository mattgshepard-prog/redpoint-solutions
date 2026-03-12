import './globals.css';

export const metadata = {
  title: 'Redpoint Solutions | Sell Your Colorado Home Fast — Any Situation, Any Condition',
  description: 'Inherited a house? Going through divorce? Facing tax liens or code violations? Need to move fast? We help Denver metro homeowners understand their options and sell on their timeline. Zero fees, zero pressure.',
  keywords: 'sell house fast Denver, inherited house Colorado, sell house divorce Denver, tax lien help Colorado, code violations Denver, cash home buyer Denver, we buy houses Denver',
  openGraph: {
    title: 'Redpoint Solutions | Your House Is a Problem. Let\'s Solve It Together.',
    description: 'We help Denver metro homeowners in tough situations understand their options. Inherited property, divorce, tax liens, code violations, forced moves. Zero fees, zero pressure.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Redpoint Solutions',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
