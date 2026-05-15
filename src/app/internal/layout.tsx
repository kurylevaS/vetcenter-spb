import type { Metadata } from 'next';

/** Общие правила для /internal/* (заявки, push и т.д.) */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
