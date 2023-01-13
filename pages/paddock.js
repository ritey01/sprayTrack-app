import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import standard from "../styles/Standard.module.css";
import AddItemButton from "../components/AddItemButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";
import prisma from "../lib/prisma";
import { router } from "next/router";

export async function getServerSideProps() {
  const paddocks = await prisma.paddock.findMany();
  const errorCode = paddocks.status > 200 ? paddocks.status : false;

  return {
    props: { paddocks, errorCode },
  };
}

export default function Paddock({ paddocks, errorCode }) {
  const [location, setLocation] = useState("");
  const [id, setId] = useState("");
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const deletePost = async id => {
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
      <h1 className={standard.title}>Select a paddock</h1>
      <AddItemButton name={"Add Paddock"} link={`/addPaddock`} />

      <ItemList
        props={paddocks}
        name={"paddocks"}
        setProp={setLocation}
        setId={setId}
      />

      <div className={standard.styledNext}>
        {location ? (
          <>
            <button
              className={standard.deleteButton}
              onClick={() => deletePost(id)}
            >
              Delete
            </button>

            <Link
              onClick={() => {
                setSprayEvent({ ...sprayEvent, paddock: location });
              }}
              href={`/crop`}
              className={standard.next}
            >
              Add
            </Link>
          </>
        ) : (
          <button href={``} className={standard.disabledNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
