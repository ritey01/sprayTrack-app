import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import standard from "../styles/Standard.module.css";
import styles from "../styles/SprayDetails.module.css";
import Link from "next/link";
import SprayContext from "../context/sprayEvent";
import AccessDenied from "../components/accessDenied";

const SprayDetails = () => {
  const [comment, setComment] = useState("");
  const { event } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [emptyFields, setEmptyFields] = useState([]);
  const { data: session } = useSession();

  //Checks if all fields are filled in
  const validateState = (state) => {
    setEmptyFields([]);
    const fieldsToCheck = ["date", "paddock", "crop", "sprayMix"];
    fieldsToCheck.forEach((field) => {
      const value = state[field];
      if (!value || (Array.isArray(value) && !value.length)) {
        emptyFields.push(field.charAt(0).toUpperCase() + field.slice(1));
      }
    });
  };

  const submitSpray = async (sprayEvent) => {
    const body = {
      ...sprayEvent,
      comment: comment,
      createdBy: session.user.name,
    };
    const result = await fetch(`/api/spray/postSprayEvent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (result.status === 201) {
      return true;
    } else {
      return false;
    }
  };

  const handleClick = async (sprayEvent) => {
    validateState(sprayEvent);
    if (emptyFields.length) {
      let message;
      if (emptyFields.length === 1) {
        message = `Please enter ${emptyFields[0]} details`;
      } else if (emptyFields.length === 2) {
        message = `Please enter ${emptyFields[0]} and ${emptyFields[1]} details`;
      } else {
        const lastField = emptyFields.pop();
        const otherFields = emptyFields.join(", ");
        message = `Please enter ${otherFields}, and ${lastField} details`;
      }
      Swal.fire({
        text: message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "rgb(6, 214, 160)",
        confirmButtonAriaLabel: "Ok",
      });
    } else {
      const submit = await submitSpray(sprayEvent);
      console.log(submit);
      if (submit) {
        Swal.fire({
          text: "Spray event saved",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "rgb(6, 214, 160)",
          confirmButtonAriaLabel: "Ok",
        });
        //resets sprayEvent after submit
        setSprayEvent({
          paddockId: null,
          paddock: "",
          cropId: null,
          crop: "",
          date: "",
          sprayMix: {
            sprayMixId: null,
            title: "",
            sprays: [{ sprayId: null, sprayName: "", rate: 0, unit: "" }],
          },
        });
        setComment("");
      } else {
        Swal.fire({
          text: "Error saving spray event",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "rgb(6, 214, 160)",
          confirmButtonAriaLabel: "Ok",
        });
      }
    }
  };

  return (
    <>
      {session ? (
        <div className={`${standard.cardBackground} ${styles.detailsCard}`}>
          <p className={styles.labels}> Date</p>

          <p className={styles.sprayDetails}>
            {/* Checks if date else returns message */}
            {sprayEvent.date ? sprayEvent.date : "No date entered"}
            <Link href={`/date`} className={styles.editBtn}>
              Edit
            </Link>
          </p>

          <p className={styles.labels}> Paddock</p>
          <p className={styles.sprayDetails}>
            {/* Checks if a paddock entered else returns a message */}
            {sprayEvent.paddock ? sprayEvent.paddock : "No paddock entered"}
            <Link href={`/paddock`} className={styles.editBtn}>
              Edit
            </Link>
          </p>

          <p className={styles.labels}> Crop</p>
          <p className={styles.sprayDetails}>
            {/* Checks if a crop entered else returns a message */}
            {sprayEvent.crop ? sprayEvent.crop : "No crop entered"}
            <Link href={`/crop`} className={styles.editBtn}>
              Edit
            </Link>
          </p>

          <p className={styles.labels}>Spray</p>
          <div className={styles.sprayMixCard}>
            <div className={styles.sprayTitleDisplay}>
              <p>{sprayEvent.sprayMix.title}</p>
              <Link href={`/spray`} className={styles.editBtn}>
                Edit
              </Link>
            </div>

            {/* Checks if a spray is entered else returns a message */}

            {sprayEvent.sprayMix.sprays.length == 0 ? (
              <p>No spray entered</p>
            ) : (
              <ul className={styles.sprayList}>
                {sprayEvent.sprayMix.sprays.map((spray) => {
                  return (
                    <li className={styles.sprayType} key={spray.sprayId}>
                      <p className={styles.sprayName}>{spray.sprayName}</p>

                      <p>
                        {spray.rate} {spray.unit} per hectares
                      </p>
                      <div className={styles.line}></div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <form>
            <div className={styles.commentContainer}>
              <label htmlFor="comment">Comments:</label>
              <div className={styles.commentInput}>
                <input
                  className={styles.commentInputValue}
                  id="commentValue"
                  type="string"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
          </form>

          <div>
            {emptyFields.length > 0
              ? console.log("empty fields", emptyFields)
              : null}
          </div>
          <div className={standard.styledNext}>
            <Link href={`/spray`} className={styles.submitBtn}>
              Back
            </Link>
            <button
              onClick={() => handleClick(sprayEvent)}
              className={styles.submitBtn}
            >
              Submit
            </button>
          </div>
          <Link href={`/paddock`} className={standard.next}>
            Start again
          </Link>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default SprayDetails;
