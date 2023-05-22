import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { useEffect } from 'react';

const Account: NextPage = () => {
    const { data: sessionData } = useSession();
    const router = useRouter();

    useEffect(() => {
        if(!sessionData) {
            console.log("redirecting...");
            // The code below uses IIFE (Immediately Invoked Function Expression)
            // to create an async context. This is to handle the TypeScript handle
            // promises error. But this did not resolve the issue.
            // (async () => {
            //     await router.push("/login");
            // })();

            router.push("/login")
                .then(() => {
                    console.log("navigation handled");
                })
                .catch((error) => {
                    console.error("Error during navigation redirect", error);
                })
        }
    }, [sessionData])
    

    return(
        <>
        
            <main>
                <p>
                    Welcome to the account page
                </p>
            </main>
        </>
    )
}

export default Account;
