import React, { type ReactNode } from 'react';
import { NavbarMain } from './NavbarMain';
import { Footer } from './Footer';
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from './ToastContext';


interface RootLayoutProps {
    children: ReactNode;
}

// old color values: #2e026d #15162c

function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="flex flex-col">
            <ToastProvider>
                <NavbarMain />
                    <main className="flex flex-col min-h-screen items-center bg-gradient-to-b from-[#e2e8f0] to-[#334155]">
                        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
                            {children}
                        </div>
                    </main>
                <Footer />
            </ToastProvider>
            <ToastContainer 
                position="bottom-right"
            />
        </div>
    );
}

export default RootLayout;
