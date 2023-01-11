import { PrismaClient } from "@prisma/client";
import React, { useState, useContext } from "react";
import Link from "next/link";
// import prisma from "../lib/prisma";
import standard from "../styles/Standard.module.css";
import AddButton from "../components/AddButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const crops = await prisma.crops.findMany();

  return {
    props: {
      crops,
      //   paddock: JSON.parse(JSON.stringify(paddocks)),
    },
  };
}

export default function Crops(props) {
  const [cropType, setCropType] = useState("");
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);

  return (
    <div>
      <h1 className={standard.title}>Select a crop</h1>
      <AddButton name={"Add Crop"} link={`/create-crop`} />
      <ItemList props={props.crops} name={"crops"} setProp={setCropType} />

      <div className={standard.styledNext}>
        <Link href={`/paddock`} className={standard.next}>
          Back
        </Link>
        <Link
          onClick={() => {
            setSprayEvent({ ...sprayEvent, crop: cropType });
          }}
          href={`/date`}
          className={standard.next}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
