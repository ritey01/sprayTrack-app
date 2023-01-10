import { PrismaClient } from "@prisma/client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Paddock.module.css";
import standard from "../styles/Standard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddButton from "../components/AddButton";
import ItemList from "../components/ItemList";

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const paddocks = await prisma.paddock.findMany();

  return {
    props: {
      paddocks,
      //   paddock: JSON.parse(JSON.stringify(paddocks)),
    },
  };
}

export default function Paddock(props) {
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState();

  //   const handlePaddockClick = (index) => {
  //     setLocation(paddocks[index].paddockName);
  //   };

  return (
    <div>
      <h1 className={standard.title}>Select a paddock</h1>
      <AddButton name={"Add Paddock"} link={`/create-paddock`} />
      <ItemList props={props} name={"paddocks"} setLocation={setLocation} />

      {/* <ul className={`${styles.paddockCard} ${standard.cardBackground}`}>
        {props.paddocks.length == 0 && <p>No paddocks created</p>}
        {props.paddocks.map((paddock, index) => (
          <li
            className={styles.paddock}
            key={paddock.id}
            value={paddock.name}
            style={{
              backgroundColor:
                isActive == index ? "rgb(30, 173, 113, 0.18)" : "#ffff",
              width: isActive == index ? "90%" : "80%",
            }}
            onClick={() => {
              setIsActive(index);
              handlePaddockClick(index);
            }}
          >
            {isActive == index && (
              <span style={{ color: "#ffff" }}>
                <FontAwesomeIcon
                  className={standard.tick}
                  icon={faCheck}
                  border
                />
              </span>
            )}
            {paddock.name}
          </li>
        ))}
      </ul> */}
      <div className={standard.styledNext}>
        <Link
          //   onClick={() => {
          //     setSprayEvent({ ...sprayEvent, paddock: location });
          //   }}
          href={`/crop`}
          className={standard.next}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
