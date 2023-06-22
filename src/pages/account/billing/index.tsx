import { type GetServerSidePropsContext } from "next";
import { ReactElement, useEffect, useState } from "react";
import Layout from "~/components/Layout";
import { NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { Billing } from "~/components/Billing";
import { 
    BillingProvider, 
    useBillingDisabledUpdate, 
    useBillingQueryInterval, 
    useBillingQueryIntervalUpdate 
} from "~/components/BillingContext";


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

/**
 * * Layout function for BillingPage includes Billing Ctx Provider. See bottom of file.
 */
const BillingPage: NextPageWithLayout = () => {
    // const [ getUserSubPlanQueryIntervalMs, setGetUserSubPlanQueryIntervalMs ] = useState<number | false>(false);
    const billingQueryInterval = useBillingQueryInterval();
    const setBillingQueryInterval = useBillingQueryIntervalUpdate();
    const [ userSubPlanQueryRetries, setUserSubPlanQueryRetries ] = useState<number>(0);
    // TODO remove after testing
    // const utils = api.useContext();
    const setBillingDisabled = useBillingDisabledUpdate();

    const { 
        data: userSubscriptionPlan, 
        isLoading: userSubscriptionPlanLoading, 
        isError: userSubscriptionPlanError 
    } = api.stripe.getUserSubscriptionPlan.useQuery(undefined, {

        // Query will begin to refetch once interval value set to other than false.
        // This will first be triggered when a user hits an update component nested below.
        refetchInterval: billingQueryInterval,
        onSuccess: (newData) => {

            // After 60 attempts, terminate the process. 
            if (userSubPlanQueryRetries > 60) {
                // TODO fire off some sort of error message or notification to the front, asking the user to do a manual refresh?
                setBillingQueryInterval(false);
                setUserSubPlanQueryRetries(0);
                return;
            }

            // If/when an update component  triggers refetch, on each succcesful query the incoming sub plan
            // is checked against the existing in state. If webhook and db were successful, there should be a new
            // sub plan, at which point it differs from the one in state and this re-renders the page and kicks off 
            // the code below: setting the interval to false (turning it off) and replacing the sub plan in the state 
            // with the new one, allowing the user to update sub plan again to another.  
            if (JSON.stringify(newData) !== JSON.stringify(userSubscriptionPlan)) {
                setBillingQueryInterval(false);
                setUserSubPlanQueryRetries(0);
                // TODO after thorough testing, remove below
                // utils.stripe.getUserSubscriptionPlan.invalidate();
                // utils.stripe.checkUserStripeCancellation.invalidate();
                return;
            }

            // The refetch has no new sub plan from the db, so it continues based on the interval. But only count this if refetch is active. 
            if (billingQueryInterval !== false) {
                setUserSubPlanQueryRetries(prevCount => prevCount + 1)
            }
        },
    });

    // TODO fix to cover all sub types
    const { 
        data: isCanceled, 
        isLoading: stripeIsCancelledLoading, 
        isError: stripeIsCancelledError 
    } = api.stripe.checkUserStripeCancellation.useQuery(
        {
            stripeSubscriptionId: userSubscriptionPlan?.stripeSubscriptionId
        }
    );

    function isNumber(value: number | false): value is number {
        return typeof value === "number";
    }

    useEffect(() => {
        // Ctx Control for page interactions. During updates, buttons should be disabled.
        if (isNumber(billingQueryInterval) && billingQueryInterval > 0) {
            setBillingDisabled(true);
        } else {
            setBillingDisabled(false);
        }
    }, [billingQueryInterval]);

    // RENDERS
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
                />
            )}
        </>
    );
};

BillingPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BillingProvider>
            <Layout>
                {page}
            </Layout>
        </BillingProvider>
    );
};

export default BillingPage;
