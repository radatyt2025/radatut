import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Rada Tut',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint voluptatem, repellat a assumenda quasi et mollitia unde architecto molestiae delectus, dolore nulla, vero exercitationem enim? Enim autem vitae consequatur hic.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
