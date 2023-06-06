import React, { ReactNode } from 'react';
import { NavbarMain } from './NavbarMain';
import { Footer } from './Footer';

interface LayoutProps {
    children: ReactNode;
}
 
export default function Layout({ children }: LayoutProps) {
    return (
        <div>
            <NavbarMain />
                <main>{children}</main>
            <Footer />
        </div>
    );
}
