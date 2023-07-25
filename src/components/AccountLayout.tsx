import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter } from "next/router";
import { ICON_SIZE_SM } from "~/constants/client/site";

interface AccountLayoutProps {
    children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
    const iconButtonPaddingLeft = 10 // Tailwind numbers
    const router = useRouter();

    return(
        <div className="container grid flex-1 gap-12 pt-12 md:grid-cols-[200px_1fr]">
            <aside className="hidden w-[200px] flex-col md:flex">
                <ul className="flex flex-col gap-4">
                    <li>
                        <Link href="/account">
                            <button className={`btn btn-block shadow-lg no-animation justify-start pl-${iconButtonPaddingLeft} ${router.pathname == "/account" ? "btn-active" : ""}`}>
                                <img 
                                    src="/static/svg/home-svgrepo-com.svg" 
                                    alt="home icon"
                                    style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                ></img>
                                Dashboard
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/account/booking">
                            <button className={`btn btn-block shadow-md no-animation justify-start pl-${iconButtonPaddingLeft} ${router.pathname == "/account/booking" ? "btn-active" : ""}`}>
                                <img 
                                    src="/static/svg/calendar-new-svgrepo-com.svg" 
                                    alt="calendar icon"
                                    style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                ></img>
                                Booking
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/account/billing">
                            <button className={`btn btn-block shadow-lg no-animation justify-start pl-${iconButtonPaddingLeft} ${router.pathname == "/account/billing" ? "btn-active" : ""}`}>
                                <img 
                                    src="/static/svg/file-invoice-dollar-solid-svgrepo-com.svg" 
                                    alt="billing icon"
                                    style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                ></img>
                                Billing
                            </button>
                        </Link>
                    </li>
                    <li>
                        {/* <Link href=""> // TODO */}
                            <button className={`btn btn-disabled btn-block shadow-md no-animation justify-start pl-${iconButtonPaddingLeft} ${router.pathname == "/account/settings" ? "btn-active" : ""}`}>
                                <img 
                                    src="/static/svg/settings-2-svgrepo-com.svg" 
                                    alt="settings icon"
                                    style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                ></img>
                                Settings
                            </button>
                        {/* </Link> */}
                    </li>
                </ul>
            </aside>
            <section className="container flex flex-col items-center gap-12 p-0">
                { children }
            </section>
        </div>
    );
}
