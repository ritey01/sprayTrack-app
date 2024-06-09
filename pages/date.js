import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styles from "../styles/Date.module.css";
import standard from "../styles/Standard.module.css";
import dateCreate from "../components/dateCreate";
import SprayContext from "../context/sprayEvent";
import AccessDenied from "../components/accessDenied";

export default function DateTime() {
  const router = useRouter();
  const [isActive, setIsActive] = useState();
  const [time, setTime] = useState("");
  const { event } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [message, setMessage] = useState(false);
  const { data: session } = useSession();

  const handleDateClick = (e) => {
    if (e) {
      setTime(dateCreate(e));
    } else {
      setTime(dateCreate());
    }
  };

  function dataSetter() {
    setSprayEvent({ ...sprayEvent, date: time });
    //if user has come from sprayDetails page then push back to that page else push to crop page
    const lastLocation = router.query.from;
    if (lastLocation == "/sprayDetails") {
      router.push(lastLocation);
    } else {
      router.push("/spray");
    }
  }

  return (
    <>
      {session ? (
        <div className={styles.date}>
          <h1 className={standard.title} data-testid="spray-date">
            Spray Date
          </h1>
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
                    handleDateClick(e.target.value);
                  }}
                />
              </div>
            </form>
          </div>
          {message && <p className={standard.error}>Please select a date</p>}
          <div className={standard.styledNext}>
            <Link href={`/crop`} className={standard.next}>
              Back
            </Link>

            {time ? (
              <button
                href={``}
                className={standard.next}
                onClick={() => {
                  dataSetter();
                }}
              >
                Next
              </button>
            ) : (
              <div className={standard.messageDisplay}>
                <button
                  href={``}
                  className={standard.disabledNext}
                  onClick={() => {
                    setMessage(true);
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
