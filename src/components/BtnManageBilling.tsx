import { api } from "~/utils/api";
import { useBillingDisabled } from "./BillingContext";


export const BtnManageBilling: React.FC = () => {
    const { isLoading: billingIsLoading, mutateAsync: manageBillingProcedure } = api.stripe.createBillingSession.useMutation();
    const btnDisabled = useBillingDisabled();

    return(
        <button
            className="btn btn-md btn-accent"
            onClick={async () => {
                const { url } = await manageBillingProcedure();
                if (!url) {
                    return console.log("Error: no URL");
                }
                if (url) {
                    window.location.href = url;
                }
            }}
            disabled={billingIsLoading || btnDisabled}
        >
            Manage Billing
        </button>
    );
};
