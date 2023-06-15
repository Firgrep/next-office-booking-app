import { useSession } from 'next-auth/react';
import Link from "next/link";
import { BtnSignIn } from "~/components/BtnSignIn";
import Layout from "~/components/Layout";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from 'react';
import { Booking } from '~/components/Booking';
import { api } from '~/utils/api';
import { type GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from '~/server/auth';


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
};

const Account: NextPageWithLayout = () => {

    return(
        <>
            <Link href="/account/booking">
                <button className="btn">Go to Booking</button>
            </Link>
            <Link href="/account/billing">
                <button className="btn">Go to Billing</button>
            </Link>
        </>
    )
}

Account.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    );
};

export default Account;
