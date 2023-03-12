import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Spray.module.css";
import SprayContext from "../context/sprayEvent";
import standard from "../styles/Standard.module.css";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import prisma from "../lib/prisma";
import Error from "./_error";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps({ req, res }) {
  let sprayList;
  let errorCode = false;
  try {
    //Make a call to sprayMixes table and include the spray table
    const sprayMixes = await prisma.SprayMix.findMany({
      include: {
        sprays: {
          include: {
            spray: {
              include: {
                sprayName: true,
              },
            },
          },
        },
      },
    });
    // console.log("🤬", sprayMixes);
    // console.log(JSON.stringify(sprayMixes));
    errorCode = res.statusCode > 200 ? res.statusCode : false;

    //Allows the new item added to be seen without pyhsically refreshing the page
    if (res.status < 300) {
      refreshData();
    }

    //needs to be stringified and parsed to be able to be passed as props as has a nested array
    return {
      props: { sprayMix: JSON.parse(JSON.stringify(sprayMixes)), errorCode },
      // props: { sprayMix: sprayMixes, errorCode },
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code);
    } else {
      console.error(error);
    }
    res.statusCode = 500;
    errorCode = res.statusCode;
    return {
      // think it needs to be sprays: [] to match the props in the component
      props: { sprayMix: [], errorCode },
    };
  }
}

const Spray = ({ sprayMix, errorCode }) => {
  const { event, mix } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [sprayMixState, setSprayMixState] = mix;
  const [spray, setSpray] = useState();
  const [isActive, setIsActive] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("spray", spray);
  }, [spray]);
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  //Needs to be a display hide instead of delete
  const deletePost = async (id) => {
    try {
      await fetch(`/api/spray/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      refreshData();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSprayMixClick = (index) => {
    setSpray(sprayMix[index]);
    setError(false);
    setIsActive(index);
  };

  return (
    <div>
      <h1 className={standard.title}>Select a spray</h1>
      <div className={styles.button}>
        <Link
          href={`/makeSpray`}
          className={standard.addingButton}
          //resets sprayMix initial state to null so dont get empty fields in array
          onClick={() => (sprayMixState.sprays.length = 0)}
        >
          {" "}
          <FontAwesomeIcon icon={faPlus} />
          Add Spray
        </Link>
      </div>

      <ul className={`${styles.card} ${standard.cardBackground}`}>
        {/* Checks if there are any sprays in the sprayMix array fetched from the database */}
        {/* {sprayMix.sprays.length == 0 && <p>No sprays created yet</p>} */}
        {sprayMix.length === 0 && <p>No sprays created yet</p>}
        {/* Displays sprays fetched from sprayMix database */}
        {sprayMix.map((spray, index) => (
          <li
            className={styles.sprayCard}
            key={index}
            value={spray}
            style={{
              backgroundColor:
                isActive == index ? "rgb(30, 173, 113, 0.28)" : "#ffff",
              width: isActive == index ? "90%" : "80%",
              //   color: isActive == index ? "#ffff" : "black",
              border: isActive == index ? "3px solid rgb(30, 173, 113)" : null,
            }}
            onClick={() => {
              handleSprayMixClick(index);
            }}
          >
            {spray.title}
            {/* This will probable error not sure of what is returned on the sprayMix */}
            {spray.sprays.length === 0 ? (
              <p>No sprays found</p>
            ) : (
              <ul className={styles.sprays}>
                {spray.sprays.map((mix) => {
                  return (
                    <>
                      <li
                        className={styles.sprayDisplay}
                        key={mix.id}
                        style={
                          {
                            // color: isActive >= 0 ? "#ffff" : "black",
                          }
                        }
                      >
                        {/* could be sprayName */}
                        <p>{mix.spray.sprayName.name}</p>
                        <p>
                          {mix.spray.rate} {mix.spray.unit} / hectare
                        </p>
                      </li>
                    </>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {error && <p className={styles.errorMessage}>Please select a spray</p>}
      <div className={standard.styledNext}>
        <Link href={`/date`} className={standard.next}>
          Back
        </Link>
        {/* {spray && (
          <button
            className={standard.deleteButton}
            onClick={() => deletePost(id)}
          >
            Delete
          </button>
        )} */}
        {isActive >= 0 ? (
          <Link
            onClick={() => {
              //need to sort this out
              setSprayEvent({
                ...sprayEvent,
                sprayMix: {
                  title: spray.title,
                  sprayMixId: spray.id,
                  sprays: spray.sprays.map((spray) => ({
                    sprayId: spray.id,
                    sprayName: spray.spray.sprayName.name,
                    rate: spray.spray.rate,
                    unit: spray.spray.unit,
                  })),
                },
              });
            }}
            href={`/sprayDetails`}
            className={standard.next}
          >
            Add
          </Link>
        ) : (
          <button
            onClick={() => {
              setError(true);
            }}
            className={styles.inactiveBtn}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default Spray;
