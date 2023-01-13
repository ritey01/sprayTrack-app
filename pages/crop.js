import { PrismaClient } from "@prisma/client";
import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
// import prisma from "../lib/prisma";
import standard from "../styles/Standard.module.css";
import AddItemButton from "../components/AddItemButton";
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
   const [id, setId] = useState("");
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const deleteItem = async id => {
    try {
      await fetch(`/api/paddock/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      
       await router.replace(router.asPath);
      
    } catch (error) {
     
      console.log("error", error);
    }
  };

  return (
    <div>
      <h1 className={standard.title}>Select a crop</h1>
      <AddItemButton name={"Add Crop"} link={`/addCrop`} />
      <ItemList props={crops} name={"crops"} setProp={setCropType} setId={setId}/>

      <div className={standard.styledNext}>
        <Link href={`/paddock`} className={standard.next}>
          Back
        </Link>

        {cropType ? (
          <>
          <button
              className={standard.deleteButton}
              onClick={() => deleteItem(id)}
            >
              Delete
            </button>

          <Link
            onClick={() => {
              setSprayEvent({ ...sprayEvent, crop: cropType });
            }}
            href={`/date`}
            className={standard.next}
          >
            Next
          </Link></>
        ) : (
          <button href={``} className={standard.disabledNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
