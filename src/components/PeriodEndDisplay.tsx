import { formatDate } from "~/utils/utils";

interface PeriodEndDisplayProps {
    isCanceled: boolean;
    stripeCurrentPeriodEnd: number | undefined;
}

export const PeriodEndDisplay: React.FC<PeriodEndDisplayProps> = ({isCanceled, stripeCurrentPeriodEnd}) => {

    return (
        <p className="rounded-full text-xs font-medium">
        {isCanceled 
            ? "Your plan will be canceled on "
            : "Your plan renews on "}
        {formatDate(stripeCurrentPeriodEnd)}.
        </p>
    );
};