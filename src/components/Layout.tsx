import React, { ReactNode } from 'react';
import { NavbarMain } from './NavbarMain';
import { Footer } from './Footer';

interface LayoutProps {
    children: ReactNode;
}

// old color values: #2e026d #15162c

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col">
            <NavbarMain />
                <main className="flex flex-col min-h-screen items-center bg-gradient-to-b from-[#e2e8f0] to-[#334155]">
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                        {children}
                    </div>
                </main>
            <Footer />
        </div>
    );
};
