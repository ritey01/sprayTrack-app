import React, { useState, useContext } from "react";
import Link from "next/link";
import styles from "../styles/Spray.module.css";
import SprayContext from "../context/sprayEvent";
import standard from "../styles/Standard.module.css";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import prisma from "../lib/prisma";
import Error from "./_error";
import AccessDenied from "../components/accessDenied";
import { authOptions } from "./api/auth/[...nextauth]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps(context) {
  let errorCode = false;
  const session = await getServerSession(context.req, context.res, authOptions);
  const companyId = session.user.companyId;

  try {
    //Make a call to sprayMixes table and include the spray table
    const sprayMixes = await prisma.SprayMix.findMany({
      where: {
        companyId: companyId,
      },
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

    errorCode = context.res.statusCode > 200 ? context.res.statusCode : false;

    //Allows the new item added to be seen without physically refreshing the page
    if (context.res.status < 300) {
      refreshData();
    }

    //needs to be stringified and parsed to be able to be passed as props as has a nested array
    return {
      props: {
        sprayMix: JSON.parse(JSON.stringify(sprayMixes)),
        errorCode,
        session,
      },
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code);
    } else {
      console.error(error);
    }
    context.res.statusCode = 500;
    errorCode = context.res.statusCode;
    //Not sure if this is right? Check paddocks.js
    return {
      props: { sprayMix: [], errorCode },
    };
  }
}

const Spray = ({ sprayMix, errorCode }) => {
  const { event, mix } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [sprayMixState, setSprayMixState] = mix;
  const [spray, setSpray] = useState();
  const [sprayMixList, setSprayMixList] = useState(sprayMix);
  const [isActive, setIsActive] = useState();
  const [error, setError] = useState(false);
  const { data: session } = useSession();

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  //Deletes a sprayMix from the sprayMix Table if not recorded in sprayEvent else changes is_displayed
  const deletePost = async (id) => {
    try {
      await fetch(`/api/spray/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const updatedSprayMix = sprayMixList.filter(
        (sprayMix) => sprayMix.id !== id
      );

      setSprayMixList(updatedSprayMix);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSprayMixClick = (index) => {
    setSpray(sprayMix[index]);
    setError(false);
    setIsActive(index);
  };

  const setSprayData = async () => {
    //copy sprayMixState array and add selected sprayMix to the array

    const newSprayState = [...sprayMixState];
    console.log(newSprayState);
    newSprayState.push(spray);
    setSprayMixState(newSprayState);
  };

  return (
    <>
      {session ? (
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
              Spray
            </Link>
          </div>

          <ul className={`${styles.card} ${standard.cardBackground}`}>
            {/* Checks if there are any sprays in the sprayMix array fetched from the database */}

            {sprayMixList.length === 0 && <p>No sprays created yet</p>}
            {/* Displays sprays fetched from sprayMix database */}

            {sprayMixList.map(
              (spray, index) =>
                spray.is_displayed && (
                  <li
                    className={styles.sprayCard}
                    key={spray.id}
                    value={spray}
                    style={{
                      background:
                        isActive == index
                          ? "linear-gradient(315deg, #26bbac,#bcfb69 )"
                          : " #ffff",
                      width: isActive == index ? "90%" : "80%",
                      border: isActive == index ? null : "1px solid #26bbac",
                    }}
                    onClick={() => {
                      handleSprayMixClick(index);
                    }}
                  >
                    {spray.title}

                    {spray.sprays.length === 0 ? (
                      <p>No sprays found</p>
                    ) : (
                      <ul className={styles.sprays}>
                        <hr
                          style={{
                            borderTop:
                              isActive == sprayMixList.indexOf(spray)
                                ? "1px solid #ffff"
                                : "1px solid #545454",
                          }}
                        />
                        {spray.sprays.map((mix) => {
                          return (
                            <>
                              <li className={styles.sprayDisplay} key={mix.id}>
                                <p>{mix.spray.sprayName.name}</p>
                                <p className={styles.sprayName}>
                                  {mix.spray.rate} {mix.spray.unit} / hectare
                                </p>
                              </li>
                            </>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                )
            )}
          </ul>
          {error && (
            <p className={styles.errorMessage}>Please select a spray</p>
          )}
          <div className={standard.styledNext}>
            <Link href={`/date`} className={standard.next}>
              Back
            </Link>
            {spray && (
              <button
                className={standard.deleteButton}
                onClick={() => deletePost(spray.id)}
              >
                Delete
              </button>
            )}
            {isActive >= 0 ? (
              <Link
                onClick={
                  () => {
                    setSprayData();
                  }
                  // setSprayData()
                  // setSprayEvent((sprayEvent) => {
                  //   const newSprayMix = [...sprayEvent.sprayMix];
                  //   newSprayMix.push(spray.id);
                  //   return { ...sprayEvent, sprayMix: newSprayMix };
                  // });
                }
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
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default Spray;
