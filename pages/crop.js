import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import prisma from "../lib/prisma";
import standard from "../styles/Standard.module.css";
import AddItemButton from "../components/AddItemButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";
import AccessDenied from "../components/accessDenied";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  let crops;
  let errorCode = false;
  const session = await getServerSession(context.req, context.res, authOptions);
  const companyId = session.user.companyId;

  try {
    crops = await prisma.crops.findMany({
      where: {
        companyId: companyId,
      },
    });

    errorCode = context.res.statusCode > 200 ? context.res.statusCode : false;

    if (context.res.status < 300) {
      refreshData();
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code);
    } else {
      console.error(error);
    }
    context.res.statusCode = 500;
    errorCode = context.res.statusCode;
    crops = [];
  }

  return {
    props: {
      crops,
      errorCode,
      session,
    },
  };
}

export default function Crops({ crops, errorCode }) {
  const [cropId, setCropId] = useState("");
  const [cropList, setCropList] = useState(crops);
  const [name, setName] = useState("");
  const { event } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [message, setMessage] = useState(false);
  const { data: session } = useSession();

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  //Deletes a crop from the Crop Table if not recorded sprayEvent else changes is_displayed
  const deleteItem = async (id) => {
    try {
      await fetch(`/api/crop/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const updatedCrops = cropList.filter((crop) => crop.id !== id);

      setCropList(updatedCrops);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {session ? (
        <div>
          <h1 className={standard.title}>Select a crop</h1>
          <AddItemButton name={"Add Crop"} link={`/addCrop`} />
          <ItemList
            props={cropList}
            name={"crops"}
            setProp={setCropId}
            setName={setName}
          />

          {message && <p className={standard.error}>Please select a crop</p>}
          <div className={standard.styledNext}>
            <Link href={`/paddock`} className={standard.next}>
              Back
            </Link>

            {cropId ? (
              <>
                <button
                  className={standard.deleteButton}
                  onClick={() => deleteItem(cropId)}
                >
                  Delete
                </button>

                <Link
                  onClick={() => {
                    setSprayEvent({
                      ...sprayEvent,
                      cropId: cropId,
                      crop: name,
                    });
                  }}
                  href={`/date`}
                  className={standard.next}
                >
                  Next
                </Link>
              </>
            ) : (
              <>
                <div className={standard.messageDisplay}></div>
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
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
