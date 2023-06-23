import Link from "next/link";
import RootLayout from "~/components/RootLayout";
import AccountLayout from "~/components/AccountLayout";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from 'react';
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
            <p>Welcome to the account index page!</p>
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
