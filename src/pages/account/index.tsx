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
            <Link href="/account/billing">Go to Billing</Link>
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
