import Head from "next/head";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from 'react';
import { Alert } from "~/components/Alert";
import RootLayout from "~/components/RootLayout";
import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { siteConfig } from "~/constants/client/site";
import { CardOfferings } from "~/components/CardOfferings";


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Prefetches the auth session to avoid janky login UI
  const session = await getServerAuthSession(ctx);

  return {
    props: { session },
  };
}

const Home: NextPageWithLayout = () => {

  return (
    <>
      <Head>
        <title>{siteConfig.companyName}</title>
        <meta name="description" content={siteConfig.webpageTagline} />
        <meta property="og:title" content={siteConfig.companyName} />
        <meta property="og:description" content={siteConfig.webpageTagline} />
        <meta property="og:image" content={siteConfig.webImg} />
        <meta property="og:url" content={siteConfig.webUrl} />
        <meta name="author" content={siteConfig.siteAuthor} />
        <meta name="date" content={siteConfig.siteDate} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="spacer layer1 3xl:mb-[-5%]">
        <div className="container flex items-end md:items-center justify-center md:justify-start gap-12 px-4 pt-1 md:pt-2">
          <div className="bg-white rounded-md shadow-xl p-4 z-index-20 absolute w-64 sm:w-96">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-8xl font-bold tracking-tight text-custom-brown">
              {siteConfig.companyName}
            </h1>
            <p className="text-custom-black text-md sm:text-lg lg:text-2xl">
              Centrally located in your city. Explore memberships and move-in ready offices for individuals or companies of all sizes.
            </p>
          </div>
          <div className="w-full  md:w-[75rem] md:ml-64">
            <img 
              src="/static/images/conference-room.jpg"
              alt="conference room"
              className="object-cover w-full h-auto rounded-xl shadow-xl"
            ></img>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="text-3xl font-bold">What are you looking for?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

          <CardOfferings
            title="Communal Work Space"
            text="This is a demo, consectetur adipiscing elit."
          />
          <CardOfferings
            title="Meeting Room"
            text="This is a demo, consectetur adipiscing elit."
          />
          <CardOfferings
            title="Phone Booth"
            text="This is a demo, consectetur adipiscing elit."
          />
          <CardOfferings
            title="Personalized"
            text="This is a demo, lorem, consectetur adipiscing elit."
          />

        </div>
      </div>


      <div className="flex flex-col justify-center items-center spacer layer3 md:-translate-y-32 mb-32 sm:mb-16 md:mb-0">
        <h1 className="text-center text-white text-2xl md:text-[3rem] xl:text-[4rem] font-extrabold translate-y-[65px] md:font-extrabold translate-y-28">Looking for a great place to work?</h1>
        <div className="translate-y-32 flex gap-2 sm:gap-12 md:gap-24 md:translate-y-36 md:text-2xl text-md text-custom-brown">
          <p className="bg-slate-100 p-4 rounded-md shadow-xl font-bold">Central</p>
          <p className="bg-slate-100 p-4 rounded-md shadow-xl font-bold">Flexible</p>
          <p className="bg-slate-100 p-4 rounded-md shadow-xl font-bold">Convenient</p>
        </div>
      </div>

        
      <div className="spacer layer4 flex flex-col justify-center items-center h-[750px] sm:h-[500px]">
        <div className="flex flex-col md:flex-row items-center justify-center container gap-16" style={{transform: "rotateX(180deg)"}}>
          <div className="bg-white shadow-xl rounded-md p-4">
            <p className="text-xl">Want to try the booking system? 🎮</p>
            <ul className="list-disc p-6">
              <li>Sign in on the top right with any of the currently accepted providers.</li>
              <li>Once you have succesfully signed in, a new menu is available when you click your picture/icon.</li>
              <li>Navigate to the dashboard or booking.</li>
              <li>And follow the wizard there to book some rooms! Use the <a className="text-blue-500 underline underline-offset-1 hover:text-red-500 duration-1000" href="https://stripe.com/docs/testing">test card details</a>.</li>
              <li>Hint: you can upgrade your account on the billing page to see how the various services work.</li>
            </ul> 
          </div>
          <div className="hidden lg:flex">
            <img 
              src={siteConfig.imgUrls.conferenceRoom}
              alt="conference room image"
              className="object-cover w-full h-auto rounded-2xl shadow-xl"
            /> 
          </div>
           
        </div>
      </div>

      <div className="w-full bg-custom-yellow py-20">
        <div className="h-300 container">
          <Alert dark={true} text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}/>
        </div>
      </div>

      <div className="custom-shape-divider-top-1689603545">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="shape-fill"></path>
          <path d="M1200 0L0 103.52V120H1200V0z" fill="#863a12"></path>    
        </svg>
      </div>

      <div className="w-full bg-custom-brown py-20">
        <div className="h-300 container">
          <Alert text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}/>
        </div>
      </div>

      <div className="spacer layer5 h-[750px] sm:h-[500px]">
        <div className="flex flex-col md:flex-row items-center justify-center container gap-16">
          <div className="w-[20rem] md:w-[200rem]">
            <img 
              src={siteConfig.imgUrls.conferenceRoom}
              alt="conference room image"
              className="object-cover w-full h-auto rounded-2xl shadow-xl"
            /> 
          </div>
          <div className="bg-white shadow-xl rounded-md p-4">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </div>  
      
      <div className="container flex flex-col items-center justify-center gap-12 px-16 py-16">
        <Alert dark={true} text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}/>
                       
      </div>


      <div className="spacer layer2"></div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <RootLayout>
      {page}
    </RootLayout>
  );
};

export default Home;
