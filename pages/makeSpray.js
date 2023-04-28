import React, { useState, useContext } from "react";
import Error from "./_error";
import Link from "next/link";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/MakeSpray.module.css";
import standard from "../styles/Standard.module.css";
import SprayContext from "../context/sprayEvent";
import AccessDenied from "../components/accessDenied";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/prisma";

export async function getServerSideProps(context) {
  let sprayNames;
  let errorCode = false;
  const session = await getServerSession(context.req, context.res, authOptions);
  const companyId = session.user.companyId;

  try {
    sprayNames = await prisma.sprayName.findMany({
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
    errorCode = res.statusCode;
    sprayNames = [];
  }

  return {
    props: {
      sprayNames,
      errorCode,
      session,
    },
  };
}

export default function MakeSpray({ sprayNames, errorCode }) {
  const [sprayTypeId, setSprayTypeId] = useState("");
  const [isActive, setIsActive] = useState();
  const [sprayName, setSprayName] = useState("");
  const [sprayList, setSprayList] = useState(sprayNames);
  const { mix } = useContext(SprayContext);
  const [sprayMix, setSprayMix] = mix;
  const [message, setMessage] = useState(false);
  const { data: session } = useSession();

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const handleSprayClick = (index) => {
    setSprayTypeId(sprayNames[index].id);
    setSprayName(sprayNames[index].name);
  };

  const dataSetter = () => {
    const newSprayMix = { ...sprayMix };

    if (newSprayMix.sprays.length === 0) {
      //create a new object within sprays list with sprayId and sprayName
      newSprayMix.sprays[0] = {
        sprayId: sprayTypeId,
        sprayName: sprayName,
      };
    } else {
      const index = newSprayMix.sprays.length;
      newSprayMix.sprays[index] = {
        sprayId: sprayTypeId,
        sprayName: sprayName,
      };
    }

    //sets global state for sprayMix
    setSprayMix(newSprayMix);
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`/api/sprayName/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const updatedSprayNames = sprayNames.filter(
        (sprayName) => sprayName.id !== id
      );

      setSprayList(updatedSprayNames);
      setSprayTypeId(null);
    } catch (error) {
      console.log("error", error);
    }
  };
  console.log("😈", sprayMix);
  return (
    <>
      {session ? (
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
            {sprayList.length == 0 && <p>No sprays created yet</p>}
            {sprayList.map((name, index) => (
              <li
                className={styles.spray}
                key={index}
                value={name}
                style={{
                  background:
                    isActive == index
                      ? "linear-gradient(315deg, #26bbac,#bcfb69 )"
                      : "#ffff",
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

            {sprayTypeId ? (
              <>
                <button
                  className={standard.deleteButton}
                  onClick={() => deleteItem(sprayTypeId)}
                >
                  Delete
                </button>
                <Link
                  href={`/sprayRate`}
                  className={standard.next}
                  onClick={() => dataSetter()}
                >
                  Next
                </Link>{" "}
              </>
            ) : (
              <Link
                href={`/sprayRate`}
                className={standard.next}
                onClick={() => dataSetter()}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
