
interface AlertProps {
    text: string
    dark?: boolean
}

export const Alert: React.FC<AlertProps> = ({ text, dark }) => {
    return(
        <p className={`text-md ${dark ? "border-slate-700 text-slate-800" : "border-slate-100 text-slate-100"} font-semibold relative w-full rounded-lg border-2 p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11`}>
            {text}
        </p>
    );
}
