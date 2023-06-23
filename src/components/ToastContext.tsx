import React, { type ReactNode, createContext, useContext } from "react";
import { 
    showGenericErrorToast,
    showGenericSuccessToast,
    showSubscriptionUpdateSuccessToast,
} from "./Toasts";

const GenericErrorToastCtx = createContext<() => void>(() => {});
const GenericSuccessToastCtx = createContext<() => void>(() => {});
const SubscriptionUpdateSuccessToastCtx = createContext<() => void>(() => {});

/**
 * Call to send generic error notification.
 */
export function useErrorToast() {
    return useContext(GenericErrorToastCtx);
};

/**
 * Call to send generic success notification.
 */
export function useSuccessToast() {
    return useContext(GenericSuccessToastCtx);
};

/**
 * Call to send subscription update success notification.
 */
export function useSubUpdateSuccessToast() {
    return useContext(SubscriptionUpdateSuccessToastCtx);
}

/**
 * Context provider for all toasts. For global toast settings, see ToastContainer in RootLayout.
 * Usage via hooks:
 * @function useErrorToast() - Hook to access generic error notification toast.
 * @function useSuccessToast() - Hook to access generic success notificatiion toast. 
 * @function useSubUpdateSuccessToast() - Hook to access subscription update sucess notification toast.
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    return(
        <GenericErrorToastCtx.Provider value={showGenericErrorToast}>
            <GenericSuccessToastCtx.Provider value={showGenericSuccessToast}>
                <SubscriptionUpdateSuccessToastCtx.Provider value={showSubscriptionUpdateSuccessToast}>
                    { children }
                </SubscriptionUpdateSuccessToastCtx.Provider>
            </GenericSuccessToastCtx.Provider>
        </GenericErrorToastCtx.Provider>
    );
};
