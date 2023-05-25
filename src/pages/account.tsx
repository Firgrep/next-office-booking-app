import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import Link from "next/link";
import { BtnSignIn } from "~/components/BtnSignIn";

// import { useRouter } from "next/router";
// import { useEffect } from 'react';


const Account: NextPage = () => {
    const { data: sessionData } = useSession();
    // const router = useRouter();

    if(!sessionData) {
        return (
            <article>
                <Link href="/">BACK</Link>
                <p>You need to be signed in to view this page</p>
                <BtnSignIn></BtnSignIn> 
            </article>
        )
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
