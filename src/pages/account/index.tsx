import RootLayout from "~/components/RootLayout";
import AccountLayout from "~/components/AccountLayout";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from 'react';
import { type GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from '~/server/auth';
import { UserBookings } from "~/components/UserBookings";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { siteConfig } from "~/constants/client/site";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

const Account: NextPageWithLayout = () => {
    const session = useSession();

    return(
        <>
            <Head>
            <title>Account</title>
            <meta name="description" content={`User account for ${siteConfig.companyName}`}/>
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex w-full flex-start flex-col">
                <h2 className="text-4xl font-bold text-custom-black">Dashboard</h2>
                <p className="text-xl text-custom-brown">View and manage your bookings.</p>
            </div>
            {session.data && 
            session.data.user.name && 
            <p className="text-3xl text-slate-800 font-medium">
                Welcome {session.data.user.name}
            </p>}
            <UserBookings />

            <div className="bg-white shadow-xl rounded-md p-4">
                <p className="text-xl">Well, hello there! 👋 Want to try out the booking system? 🎮</p>
                <ul className="list-disc p-6">
                    <li>Navigate to booking.</li>
                    <li>And follow the wizard there to book some rooms!</li>
                    <li>Use a test card with <code className="bg-gray-200 p-1">4242 4242 4242 4242</code> and any name and three-digit security code.</li>
                    <li>More details about testing cards <a className="text-blue-500 underline underline-offset-1 hover:text-red-500 duration-1000" href="https://stripe.com/docs/testing">here</a>.</li>
                    <li>Hint: you can upgrade your account on the billing page to see how the various services work. Use the same test card.</li>
                </ul> 
            </div>
        </>
    )
}

Account.getLayout = function getLayout(page: ReactElement) {
    return (
        <RootLayout>
            <AccountLayout>
                {page}
            </AccountLayout>
        </RootLayout>
    );
};

export default Account;
