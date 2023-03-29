import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import { router } from "next/router";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import styles from "../styles/MakeSpray.module.css";
import standard from "../styles/Standard.module.css";
import SprayContext from "../context/sprayEvent";
import prisma from "../lib/prisma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps({ req, res }) {
  let sprayNames;
  let errorCode = false;

  try {
    sprayNames = await prisma.sprayName.findMany();

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
    sprayNames = [];
  }

  return {
    props: { sprayNames, errorCode },
  };
}

export default function MakeSpray({ sprayNames, errorCode }) {
  const [sprayTypeId, setSprayTypeId] = useState("");
  const [isActive, setIsActive] = useState();
  const [sprayName, setSprayName] = useState("");
  const { event, mix } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [sprayMix, setSprayMix] = mix;
  const [message, setMessage] = useState(false);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const handleSprayClick = (index) => {
    setSprayTypeId(sprayNames[index].id);
    setSprayName(sprayNames[index].name);
  };

  const dataSetter = () => {
    const newSprayMix = { ...sprayMix }; //comes from context as initial state
    const index = newSprayMix.sprays.length;
    //add id as this is mapped to the sprayName table from sprayMix
    newSprayMix.sprays[index] = {
      sprayId: sprayTypeId,
      sprayName: sprayName,
    };
    //sets global state for sprayMix
    setSprayMix(newSprayMix);
  };

  return (
    <div>
      <h1 className={standard.title}>Choose a spray</h1>
      <div className={styles.button}>
        <Link href={`/addSpray`} className={standard.addingButton}>
          {" "}
          <FontAwesomeIcon icon={faPlus} />
          Add spray name
        </Link>
      </div>

      <ul className={`${styles.card} ${standard.cardBackground}`}>
        {sprayNames.length == 0 && <p>No sprays created yet</p>}
        {sprayNames.map((name, index) => (
          <li
            className={styles.spray}
            key={index}
            value={name}
            style={{
              backgroundColor:
                isActive == index ? "rgb(30, 173, 113, 0.18)" : "#ffff",
              width: isActive == index ? "90%" : "80%",
            }}
            onClick={() => {
              setIsActive(index);
              handleSprayClick(index);
            }}
          >
            {isActive == index && (
              <span style={{ color: "#ffff" }}>
                <FontAwesomeIcon
                  className={styles.tick}
                  icon={faCheck}
                  border
                />
              </span>
            )}
            {name.name}
          </li>
        ))}
      </ul>
      <div className={standard.styledNext}>
        <Link href={`/spray`} className={standard.next}>
          Back
        </Link>
        <Link
          href={`/sprayRate`}
          className={standard.next}
          onClick={() => dataSetter()}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
