import React, { type ReactNode, createContext, useContext } from "react";
import { 
    showErrorToast,
    showSuccessToast,
    showSubscriptionUpdateSuccessToast,
    showInfoToast,
} from "./Toasts";

const ErrorToastCtx = createContext<(text?: string) => void>(() => {});
const SuccessToastCtx = createContext<(text?: string) => void>(() => {});
const InfoToastCtx = createContext<(text?: string) => void>(() => {});
const SubscriptionUpdateSuccessToastCtx = createContext<() => void>(() => {});

/**
 * Call to send generic error notification.
 * @param text - Optional string for custom message.
 */
export function useErrorToast() {
    return useContext(ErrorToastCtx);
};

/**
 * Call to send generic success notification.
 * @param text - Optional string for custom message.
 */
export function useSuccessToast() {
    return useContext(SuccessToastCtx);
};

/**
 * Call to send generic info notification.
 * @param text - Optional string for custom message.
 */
export function useInfoToast() {
    return useContext(InfoToastCtx);
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
 * @function useErrorToast() - Hook to access error notification toast.
 * @function useSuccessToast() - Hook to access success notificatiion toast. 
 * @function useInfoToast() - Hook to access info notification toast.
 * @function useSubUpdateSuccessToast() - Hook to access subscription update sucess notification toast.
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    return(
        <ErrorToastCtx.Provider value={showErrorToast}>
            <SuccessToastCtx.Provider value={showSuccessToast}>
                <SubscriptionUpdateSuccessToastCtx.Provider value={showSubscriptionUpdateSuccessToast}>
                    <InfoToastCtx.Provider value={showInfoToast}>
                        { children }
                    </InfoToastCtx.Provider>
                </SubscriptionUpdateSuccessToastCtx.Provider>
            </SuccessToastCtx.Provider>
        </ErrorToastCtx.Provider>
    );
};
