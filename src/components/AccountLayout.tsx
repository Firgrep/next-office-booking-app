import Link from "next/link";
import { ReactNode } from "react";


interface AccountLayoutProps {
    children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {

    return(
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
            <aside className="hidden w-[200px] flex-col md:flex">
                <Link href="/account">
                    <button className="btn">Index</button>
                </Link>
                <Link href="/account/booking">
                    <button className="btn">Booking</button>
                </Link>
                <Link href="/account/billing">
                    <button className="btn">Billing</button>
                </Link>
            </aside>
            <section className="container flex flex-col items-center justify-center gap-12 p-0">
                { children }
            </section>
        </div>
    );
};
