import { type Session } from "next-auth";
import { type NextPage } from "next";
import { type AppProps } from "next/app";
import { type ReactElement, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";

// STYLES - globals.css  always goes on top
import "~/styles/globals.css";
import "~/styles/Calendar.css";
import "~/styles/Data-title.css";
import "~/styles/Site-utils.css";
import "react-toastify/dist/ReactToastify.css";


// RootLayout Setup for Nextjs Pages Router. See https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts 
export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout<P = NonNullable<unknown>> = AppProps & {
  Component: NextPageWithLayout<P>;
};

const MyApp: React.FC<AppPropsWithLayout<{ session: Session | null }>> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
