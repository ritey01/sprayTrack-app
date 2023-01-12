import { PrismaClient } from "@prisma/client";
import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import standard from "../styles/Standard.module.css";
import AddItemButton from "../components/AddItemButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const paddocks = await prisma.paddock.findMany();
  const errorCode = paddocks.status > 200 ? paddocks.status : false;

  return {
    props: { paddocks, errorCode },
  };
}

export default function Paddock({ paddocks, errorCode }) {
  const [location, setLocation] = useState("");
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <div>
      <h1 className={standard.title}>Select a paddock</h1>
      <AddItemButton name={"Add Paddock"} link={`/addPaddock`} />

      <ItemList props={paddocks} name={"paddocks"} setProp={setLocation} />

      <div className={standard.styledNext}>
        {location ? (
          <Link
            onClick={() => {
              setSprayEvent({ ...sprayEvent, paddock: location });
            }}
            href={`/crop`}
            className={standard.next}
          >
            Next
          </Link>
        ) : (
          <button href={``} className={standard.disabledNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
