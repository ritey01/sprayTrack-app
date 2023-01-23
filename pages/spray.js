import React, { useState, useContext } from "react";
import Link from "next/link";
import styles from "../styles/Spray.module.css";
import SprayContext from "../context/sprayEvent";
import standard from "../styles/Standard.module.css";
import prisma from "../lib/prisma";
import Error from "./_error";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps({ req, res }) {
  const sprayMixes = await prisma.SprayList.findMany({
    include: { sprays: { include: { sprays: true, rates: true } } },
  });

  const sprayList = sprayMixes.map((sprayMix) => {
    return {
      id: sprayMix.id,
      name: sprayMix.title,
      sprays: sprayMix.sprays.map((spray) => {
        return {
          id: spray.sprayId,
          name: spray.sprays.name,
          rate: spray.rates.rate,
          unit: spray.rates.metric,
        };
      }),
    };
  });

  const errorCode = res.statusCode > 200 ? res.statusCode : false;

  if (res.status < 300) {
    refreshData();
  }

  return {
    props: { sprayList, errorCode },
  };
}

const Spray = ({ sprayList, errorCode }) => {
  console.log(sprayList);
  const [spray, setSpray] = useState();
  const [isActive, setIsActive] = useState();
  const [error, setError] = useState(false);
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const handlePaddockClick = (index) => {
    setSpray(sprayList[index]);
    setError(false);
    setIsActive(index);
  };

  return (
    <div>
      <h1 className={standard.title}>Choose a spray</h1>
      <div className={styles.button}>
        <Link
          href={`/make-spray`}
          className={standard.addingButton}
          //resets sprayEvent to null
          onClick={() => (sprayEvent.sprayMix.mixs.length = 0)}
        >
          {" "}
          <FontAwesomeIcon icon={faPlus} />
          Add Spray
        </Link>
      </div>

      <ul className={`${styles.card} ${standard.cardBackground}`}>
        {sprayList.map((spray, index) => (
          <li
            className={styles.sprayCard}
            key={index}
            value={spray}
            style={{
              backgroundColor:
                isActive == index ? "rgb(30, 173, 113, 0.18)" : "#ffff",
              width: isActive == index ? "90%" : "80%",
              color: isActive == index ? "#ffff" : "black",
              border: isActive == index ? "3px solid rgb(30, 173, 113)" : null,
            }}
            onClick={() => {
              handlePaddockClick(index);
            }}
          >
            {spray.name}

            <ul className={styles.sprays}>
              {spray.sprays.map((mix, index) => {
                console.log(spray);
                return (
                  <>
                    <li
                      className={styles.sprayDisplay}
                      key={index}
                      style={{
                        color: isActive >= 0 ? "#ffff" : "black",
                      }}
                    >
                      <p>{mix.name}</p>
                      <p>
                        {mix.rate} {mix.unit} / hectare
                      </p>
                    </li>
                  </>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
      {error && <p className={styles.errorMessage}>Please select a spray</p>}
      <div className={standard.styledNext}>
        <Link href={`/date`} className={standard.next}>
          Back
        </Link>
        {isActive >= 0 ? (
          <Link
            onClick={() => {
              setSprayEvent({ ...sprayEvent, sprayMix: spray });
            }}
            href={`/spray-details`}
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
