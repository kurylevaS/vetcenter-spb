import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Заявки',
};

export default function InternalLeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
