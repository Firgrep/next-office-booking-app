import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { BtnSignIn } from "~/components/BtnSignIn";
import { ReactElement } from "react";
import Layout from "~/components/Layout";
import { NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { BillingForm } from "~/components/BillingForm";


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
    const { 
        data: userSubscriptionPlan, 
        isLoading: userSubscriptionPlanLoading, 
        isError: userSubscriptionPlanError 
    } = api.stripe.getUserSubscriptionPlan.useQuery(
        undefined, {refetchOnWindowFocus: false,});

    const { 
        data: isCanceled, 
        isLoading: stripeIsCancelledLoading, 
        isError: stripeIsCancelledError 
    } = api.stripe.checkUserStripeCancellation.useQuery(
        {
            isPro: userSubscriptionPlan?.isPro, 
            stripeSubscriptionId: userSubscriptionPlan?.stripeCustomerId
        },
        {
            refetchOnWindowFocus: false,
        }
    );
        
    console.log("is cancelled?: ", isCanceled);

    if (userSubscriptionPlanError || stripeIsCancelledError) {
        return(
            <div>
                <h3>Page error</h3>
            </div>
        )
    }

    
    return(
        <section>
            
            
            <p>Billing page</p>
            <p className="text-black">{userSubscriptionPlan?.description}</p>
            {userSubscriptionPlanLoading && (
                <h1>Loading user data...</h1>
            )}
            {userSubscriptionPlan &&
            typeof isCanceled === "boolean" && (
                <BillingForm 
                    userSubscriptionPlan={{
                        ...userSubscriptionPlan,
                        isCanceled
                    }}
                />
            )}
        </section>
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
