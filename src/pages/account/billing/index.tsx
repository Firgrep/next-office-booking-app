import { type GetServerSidePropsContext } from "next";
import { ReactElement, useState } from "react";
import Layout from "~/components/Layout";
import { NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { Billing } from "~/components/Billing";


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

const BillingPage: NextPageWithLayout = () => {
    const [ getUserSubPlanQueryIntervalMs, setGetUserSubPlanQueryIntervalMs ] = useState<number | false>(false);
    const [ userSubscriptionPlanCopy, setUserSubscriptionPlanCopy ] = useState<object>({});
    const [ userSubPlanQueryRetries, setUserSubPlanQueryRetries ] = useState<number>(0);
    const utils = api.useContext();
    const { 
        data: userSubscriptionPlan, 
        isLoading: userSubscriptionPlanLoading, 
        isError: userSubscriptionPlanError 
    } = api.stripe.getUserSubscriptionPlan.useQuery(undefined, {

        // Query will begin to refetch once interval value set to other than false.
        // This will first be triggered when a user hits an update component nested below.
        refetchInterval: getUserSubPlanQueryIntervalMs,
        onSuccess: () => {

            // On first render, a copy of the sub plan will be set to state.
            if (userSubscriptionPlanCopy && Object.keys(userSubscriptionPlanCopy).length === 0) {
                console.log("setting the first user sub plan to state");
                setUserSubscriptionPlanCopy(userSubscriptionPlan);
                return;
            }

            // After 60 attempts, terminate the process. 
            if (userSubPlanQueryRetries > 60) {
                setGetUserSubPlanQueryIntervalMs(false);
                setUserSubPlanQueryRetries(0);
                return;
            }

            // If/when an update component  triggers refetch, on each succcesful query the incoming sub plan
            // is checked against the existing in state. If webhook and db were successful, there should be a new
            // sub plan, at which point it differs from the one in state and this re-renders the page and kicks off 
            // the code below: setting the interval to false (turning it off) and replacing the sub plan in the state 
            // with the new one, allowing the user to update sub plan again to another.  
            if (JSON.stringify(userSubscriptionPlanCopy) !== JSON.stringify(userSubscriptionPlan)) {
                console.log("setting interval to false...");
                setGetUserSubPlanQueryIntervalMs(false);
                setUserSubPlanQueryRetries(0);
                setUserSubscriptionPlanCopy(userSubscriptionPlan);
                utils.stripe.getUserSubscriptionPlan.invalidate();
                utils.stripe.checkUserStripeCancellation.invalidate();
                return;
            }

            // The refetch has no new sub plan from the db, so it continues based on the interval. But only count this if refetch is active. 
            if (getUserSubPlanQueryIntervalMs !== false) {
                setUserSubPlanQueryRetries(prevCount => prevCount + 1)
                console.log(`no change ... count: ${userSubPlanQueryRetries}`)
            }
            console.log("loop complete")
        },
    });

    // TODO fix to cover all sub types
    const { 
        data: isCanceled, 
        isLoading: stripeIsCancelledLoading, 
        isError: stripeIsCancelledError 
    } = api.stripe.checkUserStripeCancellation.useQuery(
        {
            isPro: userSubscriptionPlan?.isPro, 
            stripeSubscriptionId: userSubscriptionPlan?.stripeSubscriptionId
        }
    );

    function isNumber(value: number | false): value is number {
        return typeof value === "number";
    }

    const btnDisabled: boolean = isNumber(getUserSubPlanQueryIntervalMs) && getUserSubPlanQueryIntervalMs > 0;
        
    if (userSubscriptionPlanError || stripeIsCancelledError) {
        return(
            <div>
                <h3>Page error</h3>
            </div>
        )
    }
    
    return(
        <>
            <h2>Billing page</h2>
            <p className="text-black">{userSubscriptionPlan?.description}</p>
            {userSubscriptionPlanLoading && (
                <h1>Loading user data...</h1>
            )}
            {userSubscriptionPlan &&
            typeof isCanceled === "boolean" && (
                <Billing 
                    userSubscriptionPlan={{
                        ...userSubscriptionPlan,
                        isCanceled
                    }}
                    setGetUserSubPlanQueryIntervalMs={setGetUserSubPlanQueryIntervalMs}
                    btnDisabled={btnDisabled}
                />
            )}
        </>
    );
};

BillingPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    );
};

export default BillingPage;
