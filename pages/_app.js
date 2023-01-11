import React, { useState } from "react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { SprayProvider } from "../context/sprayEvent";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  // const [sprayEvent, setSprayEvent] = useState({
  //   paddock: "",
  //   crop: "",
  //   date: "",
  //   sprayMix: { name: "", mixs: [] },
  // });
  // console.log("🚀", sprayEvent);
  return (
    <Layout>
      <SprayProvider>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </SprayProvider>
    </Layout>
  );
}
