import { type GetServerSidePropsContext } from "next";
import { ReactElement, useEffect } from "react";
import AccountLayout from "~/components/AccountLayout";
import { Booking } from "~/components/Booking";
import RootLayout from "~/components/RootLayout";
import { NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useErrorToast, useSuccessToast } from "~/components/ToastContext";


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
    const toastSuccess = useSuccessToast();
    const toastError = useErrorToast();
    const router = useRouter();
    const { status = "default", scheduleId = "default"} = router.query;

    useEffect(() => {
        if (status === "success" && scheduleId) {
            toastSuccess("Payment successful! Your booking has been made!")
        }
        if (status === "canceled" && scheduleId) {
            toastError("Payment cancelled. Please re-select your booking and try again.")
        }
    }, [status, scheduleId])

    return(
        <>
            <Booking />
        </>
    );
};

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
