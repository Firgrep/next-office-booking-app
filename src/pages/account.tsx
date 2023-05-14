import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

const Account: NextPage = () => {
    const { data: sessionData } = useSession();
    const router = useRouter();

    if(!sessionData) {
        console.log("redirecting...")
        router.push("/login")
        return <h3>Redirecting...</h3>;
    }

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
