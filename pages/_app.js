import React, { useState, useEffect } from "react";
import Router from "next/router";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import Loader from "../components/loader";
import { SprayProvider } from "../context/sprayEvent";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
    });
    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);

  return (
    <SessionProvider session={session}>
      <Layout>
        <SprayProvider>
          <div className={inter.className}>
            {isLoading ? <Loader /> : <Component {...pageProps} />}
          </div>
        </SprayProvider>
      </Layout>
    </SessionProvider>
  );
}
