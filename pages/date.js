import React, { useState, useContext } from "react";
import Link from "next/link";
import styles from "../styles/Date.module.css";
import standard from "../styles/Standard.module.css";
import dateCreate from "../components/dateCreate";
import SprayContext from "../context/sprayEvent";

export default function DateTime() {
  const [isActive, setIsActive] = useState();
  const [time, setTime] = useState(dateCreate());
  const { event } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;

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
            background:
              isActive == "now"
                ? "linear-gradient(315deg, #26bbac,#bcfb69 )"
                : "",
            width: isActive == "now" ? "90%" : "80%",
          }}
          onClick={() => {
            setIsActive("now");
            handleDateClick();
          }}
        >
          Now
        </p>
        <form
          className={styles.nowDate}
          style={{
            background:
              isActive == "later"
                ? "linear-gradient(315deg, #26bbac,#bcfb69 )"
                : "",
            width: isActive == "later" ? "90%" : "80%",
          }}
          onClick={() => {
            setIsActive("later");
          }}
        >
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
        </form>
      </div>
      <div className={standard.styledNext}>
        <Link href={`/crop`} className={standard.next}>
          Back
        </Link>
        <Link
          onClick={() => {
            setSprayEvent({ ...sprayEvent, date: time });
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
