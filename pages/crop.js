import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import { router } from "next/router";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import prisma from "../lib/prisma";
import standard from "../styles/Standard.module.css";
import AddItemButton from "../components/AddItemButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";

export async function getServerSideProps({ req, res }) {
  let crops;
  let errorCode = false;

  try {
    crops = await prisma.crops.findMany();
    errorCode = res.statusCode > 200 ? res.statusCode : false;

    if (res.status < 300) {
      refreshData();
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code);
    } else {
      console.error(error);
    }
    res.statusCode = 500;
    errorCode = res.statusCode;
    crops = [];
  }

  // if (errorCode === false && crops.length === 0) {
  //   return {
  //     props: {
  //       crops: [],
  //       errorCode,
  //     },
  //   };
  // }

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
  const [message, setMessage] = useState(false);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const deleteItem = async (id) => {
    try {
      await fetch(`/api/crop/${id}`, {
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
      <ItemList
        props={crops}
        name={"crops"}
        setProp={setCropType}
        setId={setId}
      />

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
            </Link>
          </>
        ) : (
          <>
            <div className={standard.messageDisplay}>
              {message && (
                <p className={standard.error}>Please select a crop</p>
              )}
            </div>
            <button
              href={``}
              className={standard.disabledNext}
              onClick={() => {
                setMessage(true);
              }}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
