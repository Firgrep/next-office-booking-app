import { signIn, signOut, useSession } from "next-auth/react";
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
                    {(
                        sessionData
                    ) ? (
                        <div className="dropdown dropdown-bottom dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle">
                                <div className="avatar">
                                    <div className="w-12 rounded-full">
                                        <img src={sessionData?.user.image ?? "/avatar_placeholder.png"} />
                                    </div>
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 drop-shadow-2xl">
                                <li><a className="fake-disabled text-lg pb-0">{sessionData && sessionData.user?.name}</a></li>
                                <li><a className="fake-disabled">{sessionData && sessionData.user?.email}</a></li>
                                <li className="border-t my-1"></li>
                                <li><Link href="/account">Dashboard</Link></li> 
                                <li><Link href="/account/booking">Booking</Link></li> 
                                <li><Link href="/account/billing">Billing</Link></li>
                                <li className="border-t my-1"></li>
                                <li><button onClick={() => void signOut()}>Sign Out</button></li>
                            </ul>
                        </div>
                    ) : (
                        <button
                            className="btn"
                            onClick={() => void signIn()}
                        >
                            Login
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};
