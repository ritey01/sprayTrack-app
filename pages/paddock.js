import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; // need to change this to Prisma.PrismaClientKnownRequestError tp prevent future errors
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import standard from "../styles/Standard.module.css";
import AddItemButton from "../components/AddItemButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";
import AccessDenied from "../components/accessDenied";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/prisma";
import NotAuthorised from "../components/NotAuthorised";

export async function getServerSideProps(context) {
  let paddocks;
  let errorCode = false;
  const session = await getServerSession(context.req, context.res, authOptions);
  const companyId = session.user.companyId;

  //fetches all the paddocks from Paddock Table
  try {
    paddocks = await prisma.paddock.findMany({
      where: {
        companyId: companyId,
      },
    });

    errorCode = context.res.statusCode > 200 ? context.res.statusCode : false;

    if (context.res.status < 300) {
      refreshData();
    }

    if (context.res.status === 404) {
      return <NotAuthorised />;
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code);
    } else {
      console.error(error);
    }

    context.res.statusCode = 500;
    errorCode = context.res.statusCode;
    paddocks = [];
  }

  return {
    props: {
      paddocks,
      errorCode,
      session,
    },
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
  const { data: session } = useSession();

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
      setLocationId(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {session ? (
        <div>
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
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
