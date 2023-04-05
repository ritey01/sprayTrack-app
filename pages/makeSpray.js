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
    const newSprayMix = { ...sprayMix };
    const index = newSprayMix.sprays.length;
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
          Spray name
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
              background:
                isActive == index
                  ? "linear-gradient(315deg, #26bbac,#bcfb69 )"
                  : "",
              width: isActive == index ? "90%" : "80%",
              border: isActive == index ? "none" : " 1px solid #26bbac",
            }}
            onClick={() => {
              setIsActive(index);
              handleSprayClick(index);
            }}
          >
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
