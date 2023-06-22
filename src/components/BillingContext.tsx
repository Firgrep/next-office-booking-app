import { type ReactNode, createContext, useContext, useState } from "react";


const BillingDisabledCtx = createContext<boolean>(false);
const ToggleBillingDisabledCtx = createContext<React.Dispatch<React.SetStateAction<boolean>>>(() => {});
const QueryIntervalMsCtx = createContext<number | false>(false);
const UpdateQueryIntervalMsCtx = createContext<React.Dispatch<React.SetStateAction<number | false>>>(() => {});

/**
 * Hook to access the current billing disabled state.
 * @returns {boolean} - The current billing disabled state.
 */
export function useBillingDisabled(): boolean {
    return useContext(BillingDisabledCtx);
}

/**
 * Hook to update the billing disabled state.
 * @param {boolean} newDisabledState - The new billing disabled state.
 */
export function useBillingDisabledUpdate() {
    return useContext(ToggleBillingDisabledCtx);
}

/**
 * Hook to access the current billing query interval state.
 * @returns {number | false} - The current billing query interval in milliseconds, or `false` if the interval is disabled.
 */
export function useBillingQueryInterval(): number | false {
    return useContext(QueryIntervalMsCtx);
}

/**
 * Hook to update the billing query interval state.
 * @param {number | false} newInterval - The new billing query interval in milliseconds, or `false` to disable the interval.
 */
export function useBillingQueryIntervalUpdate() {
    return useContext(UpdateQueryIntervalMsCtx);
}

/**
 * Provides context variables and functions related to billing.
 * Usage via hooks:
 * @function useBillingDisabled - Hook to access the current billing disabled state.
 * @function useBillingDisabledUpdate - Hook to update the billing disabled state.
 * @function useBillingQueryInterval - Hook to access the current billing query interval.
 * @function useBillingQueryIntervalUpdate - Hook to update the billing query interval.
 */
export const BillingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ disabled, setDisabled ] = useState<boolean>(false);
    const [ queryIntervalMs, setQueryIntervalMs ] = useState<number | false>(false);

    return(
        <BillingDisabledCtx.Provider value={disabled}>
            <ToggleBillingDisabledCtx.Provider value={setDisabled}>
                <QueryIntervalMsCtx.Provider value={queryIntervalMs}>
                    <UpdateQueryIntervalMsCtx.Provider value={setQueryIntervalMs}>
                        { children }
                    </UpdateQueryIntervalMsCtx.Provider>
                </QueryIntervalMsCtx.Provider>
            </ToggleBillingDisabledCtx.Provider>
        </BillingDisabledCtx.Provider>
    );
};
