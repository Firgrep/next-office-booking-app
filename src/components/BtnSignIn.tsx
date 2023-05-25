import { signIn } from "next-auth/react";
import React from "react";

export const BtnSignIn: React.FC = () => {

    return (
        <>
            <button
                className="rounded-full bg-black/10 px-10 py-3 font-semibold text-red no-underline transition hover:bg-white/20"
                onClick={() => void signIn()}
            >
                Sign In
            </button>
        </>
    )
};
