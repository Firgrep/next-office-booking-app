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
