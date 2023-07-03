import { signIn, signOut, useSession } from "next-auth/react";
import { BtnAccount } from "../components/BtnAccount";
import Link from "next/link";


export const NavbarMain: React.FC = () => {
    const { data: sessionData } = useSession();

    return (
        <header className="container bg-red-500">
            <div className="flex h-20 items-center justify-between py-6">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/">
                        <p>LOGO</p>
                    </Link>
                    <p>Item 1</p>
                    <p>Item 2</p>
                </div>
                <nav className="flex gap-6 items-center">
                    <p className="text-center text-2xl text-white">
                        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
                    </p>
                    {sessionData && <BtnAccount />}
                    <button
                        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                        onClick={sessionData ? () => void signOut() : () => void signIn()}
                    >
                        {sessionData ? "Sign out" : "Sign in"}
                    </button>
                </nav>
            </div>
        </header>
    );
};
