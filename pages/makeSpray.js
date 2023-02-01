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
  let sprayList;
  let errorCode = false;

  try {
    sprayList = await prisma.sprays.findMany();
    console.log("😡", sprayList);
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
    sprayList = [];
  }

  return {
    props: { sprayList, errorCode },
  };
}

export default function MakeSpray({ sprayList, errorCode }) {
  const [sprayType, setSprayType] = useState("");
  const [isActive, setIsActive] = useState();
  const [id, setId] = useState("");
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);
  const [message, setMessage] = useState(false);

  //console.log(sprayEvent);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const handlePaddockClick = (index) => {
    setSprayType(sprayList[index]);
  };

  const dataSetter = () => {
    const newSprayEvent = { ...sprayEvent };
    const index = newSprayEvent.sprayMix.mixs.length;
    newSprayEvent.sprayMix.mixs[index] = { spray: sprayType };
    setSprayEvent(newSprayEvent);
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
        {sprayList.map((spray, index) => (
          <li
            className={styles.spray}
            key={index}
            value={spray}
            style={{
              backgroundColor:
                isActive == index ? "rgb(30, 173, 113, 0.18)" : "#ffff",
              width: isActive == index ? "90%" : "80%",
            }}
            onClick={() => {
              setIsActive(index);
              handlePaddockClick(index);
              setId(spray.id);
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
            {spray.name}
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
