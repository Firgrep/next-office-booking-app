import { NextApiRequest, type GetServerSidePropsContext, NextApiResponse } from "next";
import { ReactElement, useEffect, useRef } from "react";
import AccountLayout from "~/components/AccountLayout";
import { Booking } from "~/components/Booking";
import RootLayout from "~/components/RootLayout";
import { NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useErrorToast, useInfoToast, useSuccessToast } from "~/components/ToastContext";
import { createServerSideHelpers } from "@trpc/react-query/server"
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { createSSGContext } from "~/server/api/trpc";

import { prisma } from "~/server/db";
import { stripe } from "~/server/stripe/stripeClient";

import { type PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";
import type Stripe from "stripe";
import { createStripeSessionResume, forceSessionExpire } from "~/server/stripe/stripeServerSideHandlers";
import Link from "next/link";


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

    const status = ctx.query?.status;

    // TODO
    // const opts = {
    //     session: session,
    //     req: ctx.req as NextApiRequest,
    //     res: ctx.res as NextApiResponse,
    // }
    // const ssg = createServerSideHelpers({
    //     router: appRouter,
    //     ctx: createSSGContext(opts),
    //     transformer: superjson,
    // });

    // const cleanupCancellation = async ({
    //     session,
    //     prisma,
    //     stripe,
    // }: {
    //     session: Session,
    //     prisma: PrismaClient,
    //     stripe: Stripe,
    // }) => {
    //     const pendingStripeSession = await prisma.pendingStripeSession.findFirst({
    //         where: {
    //             userId: session.user.id
    //         },
    //     })
    //     if (!pendingStripeSession) {
    //         throw new Error("Expected pending session entry...");
    //     }
    
    //     // Manually expire Stripe Session
    //     await stripe.checkout.sessions.expire(
    //         pendingStripeSession.stripeSession
    //     );
    
    //     // Delete pending session entry and booking
    //     await prisma.pendingStripeSession.delete({
    //         where: {
    //             id: pendingStripeSession.id,
    //         },
    //     });
    //     await prisma.booking.delete({
    //         where: {
    //             id: pendingStripeSession.bookingId,
    //         },
    //     });
    //     console.log("SERVERSIDE PROPS CLEANUP DONE");
    // };

    if (status === "success") {
        return {
            redirect: {
                destination: "/account/booking?status=success_completed",
                permanent: false,
            },
        };
    }
    if (status === "canceled") {
        await forceSessionExpire({ session, prisma, stripe});
        return {
            redirect: {
                destination: "/account/booking?status=cancellation_completed",
                permanent: false,
            },
        };
    }

    const result = await createStripeSessionResume({session, prisma, stripe});
    return {
        props: result,
    };
};

interface BookingPageProps {
    url?: undefined | null | string;
    cancelUrl?: undefined | null | string;
}
const BookingPage: NextPageWithLayout<BookingPageProps> = (props) => {
    const { url, cancelUrl } = props;
    const toastSuccess = useSuccessToast();
    const toastError = useErrorToast();
    const toastInfo = useInfoToast();
    const router = useRouter();
    const { status = "default" } = router.query;
    const effectCalled = useRef<boolean>(false);

    useEffect(() => {
        if (effectCalled.current) return;
        if (status === "success_completed") {
            toastSuccess("Payment successful! Your booking has been made!")
            effectCalled.current = true;
        }
        if (status === "cancellation_completed") {
            toastInfo("Your booking was successfully cancelled.")
            effectCalled.current = true;
        }
    }, [status])

    if (url && cancelUrl) {
        return(
            <>
                <p>Pending Booking Session</p>
                <Link href={url}><button className="btn">Click to resume</button></Link>
                <Link href={cancelUrl}><button className="btn btn-neutral">Cancel</button></Link>
            </>
        );
    }

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
