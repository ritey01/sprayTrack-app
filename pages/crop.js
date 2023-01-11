import { PrismaClient } from "@prisma/client";
import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
// import prisma from "../lib/prisma";
import standard from "../styles/Standard.module.css";
import AddButton from "../components/AddButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const crops = await prisma.crops.findMany();
  const errorCode = crops.status > 200 ? crops.status : false;
  return {
    props: {
      crops,
      errorCode,
    },
  };
}

export default function Crops({ crops, errorCode }) {
  const [cropType, setCropType] = useState("");
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <div>
      <h1 className={standard.title}>Select a crop</h1>
      <AddButton name={"Add Crop"} link={`/create-crop`} />
      <ItemList props={crops} name={"crops"} setProp={setCropType} />

      <div className={standard.styledNext}>
        <Link href={`/paddock`} className={standard.next}>
          Back
        </Link>

        {cropType ? (
          <Link
            onClick={() => {
              setSprayEvent({ ...sprayEvent, crop: cropType });
            }}
            href={`/date`}
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
