import Head from "next/head";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from 'react';
import { Alert } from "~/components/Alert";
import RootLayout from "~/components/RootLayout";
import { siteConfig } from "~/constants/client/site";
import { Fade } from "react-awesome-reveal";
import { CardProduct } from "~/components/CardProduct";


const Pricing: NextPageWithLayout = () => {

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
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
                <p className="text-lg text-gray-500 px-4">Need a place to work? A space to hold a meeting? Don't worry, {siteConfig.companyName} has got you covered!</p>
                <div className="mt-16 mb-32 flex flex-col justify-center items-center">
                    {/* Card */}
                    <Fade
                        delay={500}
                        triggerOnce={true}
                    >
                        <CardProduct 
                            title="PRO Plan"
                            description="For serious office workers"
                            imgUrl={siteConfig.imgUrls.conferenceRoom}
                            badgeText="BEST DEAL"
                            bulletPoints={["Superfast!", "For hardworking workers only!", "Mega ez!"]}
                            priceTag="30"
                            wider={true}
                        />
                    </Fade>
                </div>
                <div className="p-8 mb-16">
                    <Alert text="Looking for something else? We have extensively tailored our offerings to fit exactly what you need." />
                </div>
                <div className="flex flex-wrap gap-8">
                    <Fade
                        delay={400}
                        triggerOnce={true}
                        className="flex grow items-stretch justify-center"
                    >
                        <CardProduct 
                            title="Conference+ Plan"
                            description="For serious office workers"
                            imgUrl={siteConfig.imgUrls.conferenceRoom}
                            bulletPoints={["Superfast!", "For hardworking workers only!", "Mega ez!"]}
                            priceTag="25"
                        />
                    </Fade>
                    <Fade
                        delay={800}
                        triggerOnce={true}
                        className="flex grow items-stretch justify-center"
                    >
                        <CardProduct 
                            title="Phone Booth+ Plan"
                            description="For serious office workers"
                            imgUrl={siteConfig.imgUrls.conferenceRoom}
                            bulletPoints={["For hardworking workers only!", "Mega ez!"]}
                            priceTag="25"
                        />
                    </Fade>
                    <Fade
                        delay={1200}
                        triggerOnce={true}
                        className="flex grow items-stretch justify-center"
                    >
                        <CardProduct 
                            title="Basic Plan"
                            description="For serious office workers"
                            imgUrl={siteConfig.imgUrls.conferenceRoom}
                            bulletPoints={["For hardworking workers only!", "Mega ez!"]}
                            priceTag="10"
                        />
                    </Fade>
                    <Fade
                        delay={1600}
                        triggerOnce={true}
                        className="flex grow items-stretch justify-center"
                    >
                        <CardProduct 
                            title="FlexPay Plan"
                            description="Most flexible workers"
                            imgUrl={siteConfig.imgUrls.conferenceRoom}
                            bulletPoints={["Purchase only what you need!", "Mega ez!"]}
                            priceTag="0"
                            priceDescription="Individual purchases."
                            purchaseBtnDescription="Sign Up"
                        />
                    </Fade>
                </div>
                <Alert text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}/>
                

            </div>
            
        </div>
        <div style={{height: "500px"}}></div>
        
        

        


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
