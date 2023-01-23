import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import styles from "../styles/Date.module.css";
import standard from "../styles/Standard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import dateCreate from "../components/DateCreate";
import SprayContext from "../context/sprayEvent";

export default function DateTime() {
  const [isActive, setIsActive] = useState();
  const [time, setTime] = useState(dateCreate());
  const { sprayEvent, setSprayEvent } = useContext(SprayContext);

  const handleDateClick = () => {
    setTime(dateCreate());
  };

  return (
    <div className={styles.date}>
      <h1 className={standard.title}>Spray Date</h1>
      <div className={`${standard.cardBackground} ${styles.dateCard}`}>
        <p
          className={styles.nowDate}
          value={time}
          style={{
            backgroundColor:
              isActive == "now" ? "rgb(30, 173, 113, 0.18)" : "#ffff",
            width: isActive == "now" ? "90%" : "80%",
          }}
          onClick={() => {
            setIsActive("now");
            handleDateClick();
          }}
        >
          {isActive == "now" && (
            <span style={{ color: "#ffff" }}>
              <FontAwesomeIcon className={styles.tick} icon={faCheck} border />
            </span>
          )}
          Now
        </p>
        <form
          className={styles.nowDate}
          style={{
            backgroundColor:
              isActive == "later" ? "rgb(30, 173, 113, 0.18)" : "#ffff",
            width: isActive == "later" ? "90%" : "80%",
          }}
          onClick={() => {
            setIsActive("later");
          }}
        >
          <div className={styles.datePick}>
            <div>
              {isActive == "later" && (
                <span style={{ color: "#ffff" }}>
                  <FontAwesomeIcon
                    className={styles.tick}
                    icon={faCheck}
                    border
                  />
                </span>
              )}
            </div>
            <div className={styles.chooseDate}>
              <label htmlFor="date">Choose date</label>
              <input
                className={styles.dateInput}
                id="date"
                type="date"
                required
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                }}
              />
            </div>
          </div>
        </form>
      </div>
      <div className={standard.styledNext}>
        <Link href={`/crop`} className={standard.next}>
          Back
        </Link>
        <Link
          onClick={() => {
            setSprayEvent({ ...sprayEvent, date: time }),
              console.log(sprayEvent);
          }}
          href={`/spray`}
          className={standard.next}
        >
          Add
        </Link>
      </div>
    </div>
  );
}
