import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import standard from "../styles/Standard.module.css";
import AddItemButton from "../components/AddItemButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";
import prisma from "../lib/prisma";
import { router } from "next/router";

//Allows a added paddock to be displayed on the paddock page
const refreshData = () => {
  router.replace(router.asPath);
};

export async function getServerSideProps({ req, res }) {
  const paddocks = await prisma.paddock.findMany();

  const errorCode = res.statusCode > 200 ? res.statusCode : false;

  if (res.status < 300) {
    refreshData();
  }

  return {
    props: { paddocks, errorCode },
  };
}

export default function Paddock({ paddocks, errorCode }) {
  const [location, setLocation] = useState("");
  const [id, setId] = useState("");
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);
  const [message, setMessage] = useState(false);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const deletePost = async (id) => {
    try {
      await fetch(`/api/paddock/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      refreshData();
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
          <div className={standard.messageDisplay}>
            {message && (
              <p className={standard.error}>Please select a paddock</p>
            )}
            <button
              href={``}
              className={standard.disabledNext}
              onClick={() => {
                console.log("Please select a paddock");
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
