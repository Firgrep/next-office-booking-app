import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { BtnSignIn } from "~/components/BtnSignIn";
import { ReactElement } from "react";
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

const Billing: NextPageWithLayout = () => {
    const { data: userSubscriptionData } = api.subscription.getUserSubscriptionPlan.useQuery(undefined, {refetchOnWindowFocus: false,});
    const { data: isCanceled } = api.subscription.checkUserStripeCancellation.useQuery(
        {
            isPro: userSubscriptionData?.isPro, 
            stripeSubscriptionId: userSubscriptionData?.stripeCustomerId
        },
        {
            refetchOnWindowFocus: false,
        }
    );
        
    console.log(isCanceled);

    return(
        <>
            <p>Billing page</p>
            <p className="text-black">{userSubscriptionData?.description}</p>
            
        </>
    );
};

Billing.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    );
};

export default Billing;
