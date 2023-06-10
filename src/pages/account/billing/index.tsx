import { ReactElement } from "react";
import Layout from "~/components/Layout";
import { NextPageWithLayout } from "~/pages/_app";


const Billing: NextPageWithLayout = () => {
    // const router = useRouter();

    // if(!sessionData) {
    //     return (
    //         <article className="bg-white flex flex-col items-center justify-center p-4">
    //             <Link href="/" className="text-blue-500 hover:underline">BACK</Link>
    //             <p>You need to be signed in to view this page</p>
    //             <BtnSignIn></BtnSignIn> 
    //         </article>
    //     )
    // }

    return(
        <>
            <p>Billing page</p>
        </>
    )
}

Billing.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    );
};

export default Billing;
