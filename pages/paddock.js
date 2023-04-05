import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import standard from "../styles/Standard.module.css";
import AddItemButton from "../components/AddItemButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";
import prisma from "../lib/prisma";
import { router } from "next/router";

//Allows an added paddock to be displayed on the paddock page
const refreshData = () => {
  router.replace(router.asPath);
};

export async function getServerSideProps({ req, res }) {
  let paddocks;
  let errorCode = false;
  //Check user is logged in first before fetching paddocks from Paddock Table

  //fetches all the paddocks from Paddock Table
  try {
    paddocks = await prisma.paddock.findMany();
    errorCode = res.statusCode > 200 ? res.statusCode : false;
    console.log(errorCode);
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
    paddocks = [];
  }

  return {
    props: { paddocks, errorCode },
  };
}

export default function Paddock({ paddocks, errorCode }) {
  const { event } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [locationId, setLocationId] = useState();
  const [name, setName] = useState("");
  const [paddockList, setPaddockList] = useState(paddocks);
  console.log("paddockList", paddockList);
  const [message, setMessage] = useState(false);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  //Deletes a paddock from the Paddock Table if not recorded sprayEvent else changes is_displayed
  const deletePost = async (id) => {
    try {
      await fetch(`/api/paddock/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const updatedPaddocks = paddockList.filter(
        (paddock) => paddock.id !== id
      );

      setPaddockList(updatedPaddocks);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className={standard.addContainer}>
      <h1 className={standard.title}>Select a paddock</h1>
      <AddItemButton name={" Paddock"} link={`/addPaddock`} />

      <ItemList
        props={paddockList}
        name={"paddocks"}
        setProp={setLocationId}
        setName={setName}
      />

      {message && <p className={standard.error}>Please select a paddock</p>}
      <div className={standard.styledNext}>
        {locationId ? (
          <>
            <button
              className={standard.deleteButton}
              onClick={() => deletePost(locationId)}
            >
              Delete
            </button>

            <Link
              onClick={() => {
                setSprayEvent({
                  ...sprayEvent,
                  paddockId: locationId,
                  paddock: name,
                });
              }}
              href={`/crop`}
              className={standard.next}
            >
              Add
            </Link>
          </>
        ) : (
          <div className={standard.messageDisplay}>
            <button
              href={``}
              className={standard.disabledNext}
              onClick={() => {
                setMessage(true);
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
