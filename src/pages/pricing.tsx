import Head from "next/head";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from 'react';
import { Alert } from "~/components/Alert";
import RootLayout from "~/components/RootLayout";
import { siteConfig } from "~/constants/client/site";
import { Fade } from "react-awesome-reveal";
import { CardProduct } from "~/components/CardProduct";
import { cardsConfig } from "~/constants/client/cards";


const Pricing: NextPageWithLayout = () => {

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
        <Head>
            <title>Pricing</title>
            <meta name="description" content={`Pricing options for ${siteConfig.companyName}`}/>
            <link rel="icon" href="/favicon.ico" />
        </Head>
                        
        <div className="bg-gradient-to-b from-custom-black from-10% via-custom-brown via-30% via-custom-yellow to-75% rounded-t-2xl">
            <div className="flex flex-col justify-center items-center">
                <p className="mt-20 text-custom-pink text-md">Pricing Plans</p>
                <h1 className="mt-10 px-4 text-2xl font-bold tracking-tight text-slate-100 leading-loose sm:text-[3rem]">
                    Invest in fuss-free, <span className="text-slate-800 rounded-md bg-gradient-to-r from-pink-500 to-yellow-500 px-2 pb-1">quality</span> office space
                </h1>
                <p className="text-lg text-custom-lightpink px-4">Need a place to work? A space to hold a meeting? Don&apos;t worry, {siteConfig.companyName} has got you covered!</p>
                <div className="mt-16 mb-32 flex flex-col justify-center items-center">
                    {/* Card */}
                    <Fade
                        delay={500}
                        triggerOnce={true}
                    >
                        <CardProduct 
                            data={cardsConfig.pro}
                            wider={true}
                        />
                    </Fade>
                </div>
                <div className="p-8 mb-16">
                    <Alert dark={true} text="Looking for something else? We have extensively tailored our offerings to fit exactly what you need." />
                </div>
                <div className="flex flex-wrap gap-8 mb-36">
                    <Fade
                        delay={400}
                        triggerOnce={true}
                        className="flex grow items-stretch justify-center"
                    >
                        <CardProduct data={cardsConfig.conference} />
                    </Fade>
                    <Fade
                        delay={800}
                        triggerOnce={true}
                        className="flex grow items-stretch justify-center"
                    >
                        <CardProduct data={cardsConfig.phone} />
                    </Fade>
                    <Fade
                        delay={1200}
                        triggerOnce={true}
                        className="flex grow items-stretch justify-center"
                    >
                        <CardProduct data={cardsConfig.basic} />
                    </Fade>
                    <Fade
                        delay={1600}
                        triggerOnce={true}
                        className="flex grow items-stretch justify-center"
                    >
                        <CardProduct data={cardsConfig.flexpay} />
                    </Fade>
                </div>
                <div className="p-4 md:p-36">
                    <Alert dark={true} text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}/>

                </div>

            </div>
            
        </div>
        <div className="h-64"></div>
        </div>
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
