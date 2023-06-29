import React, { useState, useContext, useEffect } from "react";
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
        is_displayed: true,
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
  const { mix, event } = useContext(SprayContext);
  const [multiMixState, setMultiMixState] = mix;
  const [sprayEvent, setSprayEvent] = event;
  const [spray, setSpray] = useState();
  const [sprayMixList, setSprayMixList] = useState(sprayMix);
  const [isActive, setIsActive] = useState();
  const [error, setError] = useState(false);
  const [sprayNames, setSprayNames] = useState([]);
  const [selectedSprayName, setSelectedSprayName] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const sortedSprayMixList = sprayMixList.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setSprayMixList(sortedSprayMixList);

    const uniqueSprayNames = [
      ...new Set(
        sprayMixList.flatMap((sprayMix) =>
          sprayMix.sprays.map((spray) => spray.spray.sprayName.name)
        )
      ),
    ];

    setSprayNames(uniqueSprayNames);
  }, [sprayMixList]);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const filteredSprays = selectedSprayName
    ? sprayMixList.filter(
        (sprayMix) =>
          sprayMix.sprays[0].spray.sprayName.name == selectedSprayName
      )
    : sprayMixList;

  //

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

  const handleSprayMixClick = (index, id) => {
    const selectedSprayIndex = sprayMixList.findIndex(
      (spray) => spray.id === id
    );
    setSpray(sprayMixList[selectedSprayIndex]);
    setError(false);
    setIsActive(index);
  };

  const setSprayData = async () => {
    //copy sprayMixState array and add selected sprayMix to the array

    const newSprayState = {
      ...multiMixState,
      // sprays: [...multiMixState.sprays, spray],
    };
    newSprayState.sprays.push(spray);

    setMultiMixState(newSprayState);
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
              // onClick={() => (multiMixState.sprays.length = 0)}
            >
              {" "}
              <FontAwesomeIcon icon={faPlus} />
              Spray
            </Link>
          </div>
          {/* create a dropdown for filtering the sprayMixList by spray name */}
          <div className={styles.dropdown}>
            <label htmlFor="spray-select">Filter by:</label>
            <select
              className={styles.dropdownContent}
              id="sprayName-select"
              value={selectedSprayName}
              onChange={(e) => {
                setSelectedSprayName(e.target.value);
                setIsActive(null);
              }}
            >
              <option value="">All spray names</option>
              {sprayNames.map((sprayName, index) => (
                <option key={index} value={sprayName}>
                  {sprayName}
                </option>
              ))}
            </select>
          </div>

          <ul className={`${styles.card} ${standard.cardBackground}`}>
            {/* Checks if there are any sprays in the sprayMixList array where sprays fetched from the database */}

            {sprayMixList.length === 0 && <p>No sprays created yet</p>}
            {/* Displays sprays fetched from sprayMix database */}

            {filteredSprays.map(
              (spray, index) =>
                spray.is_displayed && (
                  <li
                    className={styles.sprayCard}
                    key={index}
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
                      handleSprayMixClick(index, spray.id);
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
                onClick={() => {
                  setSprayData();
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
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default Spray;
