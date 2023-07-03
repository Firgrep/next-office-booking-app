import { api } from "~/utils/api";
import { useBillingDisabled } from "./BillingContext";
import { type SubTier } from "../constants/client/subscriptionTiers";


interface BtnSubscriptionCheckoutProps {
    subTier: SubTier
}

export const BtnSubscriptionCheckout: React.FC<BtnSubscriptionCheckoutProps> = ({ subTier }) => {
    const utils = api.useContext();
    const { isLoading: checkoutIsLoading, mutateAsync: checkoutSubscriptionProcedure } = api.stripe.createSubscriptionCheckoutSession.useMutation({
        onSuccess() {
            void utils.stripe.getUserSubscriptionPlan.invalidate();
            void utils.stripe.checkUserStripeCancellation.invalidate();
        }
    });

    const btnDisabled = useBillingDisabled();

    const handleClick = async () => {
        const { url } = await checkoutSubscriptionProcedure({subTier: subTier});
        if (!url) {
            return console.log("Error: no URL");
        }
        if (url) {
            window.location.href = url;
        }
    }

    return(
        <button
            className="btn btn-md bg-green-500"
            onClick={handleClick}
            disabled={checkoutIsLoading || btnDisabled}
        >
            Purchase {subTier}
        </button>
    );
};
