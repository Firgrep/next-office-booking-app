import Head from "next/head";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from 'react';
import { Alert } from "~/components/Alert";
import RootLayout from "~/components/RootLayout";
import { COMPANY_NAME, ICON_SIZE_SM } from "~/constants/client/site";


const Pricing: NextPageWithLayout = () => {

  return (
    <>
        <Head>
            <title>Pricing</title>
            <meta name="description" content="// TODO" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="bg-gradient-to-b from-blue-700 from-10% via-sky-500 via-30% via-emerald-500 to-75% rounded-t-2xl">
            <div className="flex flex-col justify-center items-center">
                <p className="mt-20 text-yellow-500 text-md">Pricing Plans</p>
                <h1 className="mt-10 px-4 text-2xl font-bold tracking-tight text-white leading-loose sm:text-[3rem]">
                    Invest in fuss-free, <span className="text-slate-500">quality</span> office space
                </h1>
                <p className="text-lg text-gray-500 px-4">Need a place to work? A space to hold a meeting? Don't worry, {COMPANY_NAME} has got you covered!</p>
                <div className="mt-16 mb-16 flex flex-col justify-center items-center">
                    {/* Card */}
                    <div className="card w-72 sm:w-96 bg-base-100 border-2 border-red-500 shadow-[0px_0px_24px_8px_rgba(255,_215,_0,_0.4)]">
                        <figure><img src="https://storage.cloud.google.com/rokni-office-media/conference-room.jpg?authuser=3" alt="conference room"></img></figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                PRO Plan
                                <div className="badge badge-secondary">BEST DEAL</div>    
                            </h2>
                            <p>For serious office workers.</p>
                            <span className="border-t my-1"></span>
                            <ul className="flex flex-col gap-4">
                                <li className="flex">
                                    <img 
                                        src="/svg/check-svgrepo-com.svg" 
                                        alt="check"
                                        style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                    ></img>
                                    <span className="text-gray-500">Stuff</span>
                                </li>
                                <li className="flex">
                                    <img 
                                        src="/svg/check-svgrepo-com.svg" 
                                        alt="check"
                                        style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                    ></img>
                                    <span className="text-gray-500">More Stuff</span>
                                </li>
                                <li className="flex">
                                    <img 
                                        src="/svg/check-svgrepo-com.svg" 
                                        alt="check"
                                        style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                    ></img>
                                    <span className="text-gray-500">Even More!</span>
                                </li>
                            </ul>
                            <div className="bg-red-500 rounded-md p-4">
                                <p>More stuff!!!</p>
                            </div>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>

                <Alert text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}/>
            </div>
        </div>
        

        


        
        </>
    );
};

Pricing.getLayout = function getLayout(page: ReactElement) {
  return (
    <RootLayout>
      {page}
    </RootLayout>
  );
};

export default Pricing;
