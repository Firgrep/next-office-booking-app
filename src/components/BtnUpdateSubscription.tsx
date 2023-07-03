import { api } from "~/utils/api";
import { useBillingDisabled, useBillingQueryIntervalUpdate } from "./BillingContext";
import { UpdateSubTier } from "../constants/client/subscriptionTiers";
import { useErrorToast } from "./ToastContext";


interface BtnUpdateSubscriptionProps {
    subTierToUpdate: UpdateSubTier
    btnText: string
}

export const BtnUpdateSubscription: React.FC<BtnUpdateSubscriptionProps> = ({
    subTierToUpdate, 
    btnText, 
}) => {
    const setBillingQueryInterval = useBillingQueryIntervalUpdate();
    const errorToast = useErrorToast();
    const { isLoading: updateIsLoading, mutateAsync: updateSubscriptionProcedure } = api.stripe.updateSubscription.useMutation({
        onSuccess() {
            setBillingQueryInterval(1000);
        }
    });

    const btnDisabled = useBillingDisabled();

    const handleClick = async () => {
        try {
            await updateSubscriptionProcedure({subUpdate: subTierToUpdate});
        } catch (e) {
            if (e instanceof Error) {
                console.log(e);
                errorToast(`Oops, something went wrong. ${e.message}`)
            }
        }
    }

    return (
        <button
            className="btn"
            onClick={handleClick}
            disabled={updateIsLoading || btnDisabled}
        >
            {btnDisabled 
                ? <><span className="loading loading-bars loading-md"></span><span>&nbsp;Processing...</span></>
                : `${btnText} ${subTierToUpdate}`}
        </button>
    );
};
