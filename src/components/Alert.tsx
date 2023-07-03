
interface AlertProps {
    text: string
}

export const Alert: React.FC<AlertProps> = ({ text }) => {
    return(
        <p className="text-md text-white font-semibold relative w-full rounded-lg border-2 p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11">
            {text}
        </p>
    );
}
