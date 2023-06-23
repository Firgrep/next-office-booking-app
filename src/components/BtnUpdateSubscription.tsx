import { api } from "~/utils/api";
import { useBillingDisabled, useBillingQueryIntervalUpdate } from "./BillingContext";
import { UpdateSubTier } from "../constants/client/subscriptionTiers";


interface BtnUpdateSubscriptionProps {
    subTierToUpdate: UpdateSubTier
    btnText: string
}

export const BtnUpdateSubscription: React.FC<BtnUpdateSubscriptionProps> = ({
    subTierToUpdate, 
    btnText, 
}) => {
    const setBillingQueryInterval = useBillingQueryIntervalUpdate();
    const { isLoading: updateIsLoading, mutateAsync: updateSubscriptionProcedure } = api.stripe.updateSubscription.useMutation({
        onSuccess() {
            setBillingQueryInterval(1000);
        }
    });

    const btnDisabled = useBillingDisabled();

    return (
        <button
            className="btn"
            onClick={async () => {
                await updateSubscriptionProcedure({subUpdate: subTierToUpdate});
            }}
            disabled={updateIsLoading || btnDisabled}
        >
            {btnDisabled 
                ? <><span className="loading loading-bars loading-md"></span><span>&nbsp;Processing...</span></>
                : `${btnText} ${subTierToUpdate}`}
        </button>
    );
};
