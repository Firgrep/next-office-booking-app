import { useSession } from 'next-auth/react';
import Link from "next/link";
import { BtnSignIn } from "~/components/BtnSignIn";
import Layout from "~/components/Layout";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from 'react';
// import { useRouter } from "next/router";
// import { useEffect } from 'react';


const Account: NextPageWithLayout = () => {
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

Account.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    );
};

export default Account;
