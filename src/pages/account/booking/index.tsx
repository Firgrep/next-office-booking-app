import { type GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import AccountLayout from "~/components/AccountLayout";
import { Booking } from "~/components/Booking";
import RootLayout from "~/components/RootLayout";
import { NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";


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

const BookingPage: NextPageWithLayout = () => {

    return(
        <>
            <Booking />
        </>
    )
}

BookingPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <RootLayout>
            <AccountLayout>
                {page}
            </AccountLayout>
        </RootLayout>
    );
};

export default BookingPage;
