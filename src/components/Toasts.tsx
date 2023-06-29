import { toast } from 'react-toastify';


export const showErrorToast = (text?: string) => {
    text 
    ? toast.error(`${text}`)
    : toast.error("Oops! Something went wrong. Try refreshing the page.");
};

export const showSuccessToast = (text?: string) => {
    text
    ? toast.success(`${text}`)
    : toast.success("Success!");
}

export const showSubscriptionUpdateSuccessToast = () => toast.success(
    "Success! Your subscription has been updated."
);

export const showInfoToast = (text?: string) => {
    text
    ? toast.info(`${text}`)
    : toast.info("Done!");
}
