import { PrismaClient } from "@prisma/client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import standard from "../styles/Standard.module.css";
import AddButton from "../components/AddButton";
import ItemList from "../components/ItemList";
import SprayContext from "../context/sprayEvent";

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const paddocks = await prisma.paddock.findMany();
  const errorCode = paddocks.ok ? false : paddocks.statusCode;

  if (errorCode) {
    res.statusCode = errorCode;
  }
  console.log(errorCode);
  return {
    props: { paddocks },
  };
}

export default function Paddock(props) {
  const [location, setLocation] = useState("");
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);

  return (
    <div>
      <h1 className={standard.title}>Select a paddock</h1>
      <AddButton name={"Add Paddock"} link={`/create-paddock`} />
      {/* {props.errorCode && <p>Failed to load paddocks</p>} */}
      <ItemList
        props={props.paddocks}
        name={"paddocks"}
        setProp={setLocation}
      />

      <div className={standard.styledNext}>
        <Link
          onClick={() => {
            setSprayEvent({ ...sprayEvent, paddock: location });
          }}
          href={`/crop`}
          className={standard.next}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
