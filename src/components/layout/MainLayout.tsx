import { ReactNode, useState } from 'react';
import { SideNavBar } from './SideNavBar';
import { TopNavBar } from './TopNavBar';
import { Footer } from './Footer';

export function MainLayout({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
      <SideNavBar />
      <main className="ml-[320px] min-h-screen flex flex-col">
        <TopNavBar searchValue={search} onSearchChange={setSearch} />
        <div className="pt-24 px-gutter pb-12 flex flex-col gap-stack-lg max-w-[1400px]">
          {import.meta.env.VITE_USE_MOCK_API === 'true' && (
            <div className="bg-warning-container text-warning rounded-lg px-4 py-2 text-label-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">science</span>
            </div>
          )}
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
