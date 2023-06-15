import { type GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import { Booking } from "~/components/Booking";
import Layout from "~/components/Layout";
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
        <Layout>
            {page}
        </Layout>
    );
};

export default BookingPage;
