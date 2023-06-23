import { toast } from 'react-toastify';


export const showGenericErrorToast = () => toast.error(
    "Oops! Something went wrong. Try refreshing the page."
);

export const showGenericSuccessToast = () => toast.success(
    "Success!"
);

export const showSubscriptionUpdateSuccessToast = () => toast.success(
    "Success! Your subscription has been updated."
);
