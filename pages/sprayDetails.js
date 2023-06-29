import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import standard from "../styles/Standard.module.css";
import styles from "../styles/SprayDetails.module.css";
import Link from "next/link";
import SprayContext from "../context/sprayEvent";
import AccessDenied from "../components/accessDenied";

const SprayDetails = () => {
  const [comment, setComment] = useState("");
  const { event, mix } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [sprayMixMulti, setSprayMixMulti] = mix;
  const [emptyFields, setEmptyFields] = useState([]);
  const { data: session } = useSession();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  console.log("✅", sprayEvent);
  console.log("🔥", sprayMixMulti);

  //Checks if all fields are filled in
  const validateState = (state) => {
    setEmptyFields([]);
    const fieldsToCheck = ["date", "paddock", "crop", "sprayMix"];
    fieldsToCheck.forEach((field) => {
      const value = state[field];
      if (
        !value ||
        (Array.isArray(value) && !value.length) ||
        (field === "sprayMix" && value.sprays.length === 0)
      ) {
        emptyFields.push(field.charAt(0).toUpperCase() + field.slice(1));
      }
    });
  };

  const resetMultiMix = () => {
    setSprayMixMulti({
      sprays: [],
    });
  };

  const submitSpray = async (sprayEvent) => {
    //this also needs to add the list of spraymixes from state to the sprayevent
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
      resetMultiMix();
      return true;
    } else {
      return false;
    }
  };

  //Controls routing with the editing from this page so after edit user can come back here
  const handleEdit = (endpoint) => {
    router.push({
      pathname: endpoint,
      query: { from: "/sprayDetails" },
    });
  };

  const handleDelete = (index) => {
    console.log("⬅️", sprayMixMulti, index);
    //delete the sprayMix at the index from the sprayMixMulti array state
    const updatedSprayMixMulti = {
      ...sprayMixMulti,
      sprays: sprayMixMulti.sprays.filter((spray, i) => i !== index),
    };
    setSprayMixMulti(updatedSprayMixMulti);
  };

  const handleClick = async (sprayEvent) => {
    //Add sprayMixes to sprayEvent
    sprayEvent.sprayMix = sprayMixMulti;
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
      setSubmitting(true);
      //show spinner

      const submit = await submitSpray(sprayEvent);
      setSubmitting(false); //hide spinner

      if (submit) {
        setSuccess(true);

        //resets sprayEvent after submit
        setSprayEvent({
          paddockId: null,
          paddock: "",
          cropId: null,
          crop: "",
          date: "",
          sprayMix: [],
          // sprayMix: {
          //   sprayMixId: null,
          //   title: "",
          //   sprays: [{ sprayId: null, sprayName: "", rate: 0, unit: "" }],
          // },
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

  if (session && success) {
    return (
      <>
        <div>
          <h1>Spray event saved</h1>
          <Link
            href={`/paddock`}
            className={standard.next}
            onClick={() => resetMultiMix()}
          >
            Start again
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <>
        {session && !success ? (
          <div className={`${standard.cardBackground} ${styles.detailsCard}`}>
            <p className={styles.labels}> Date</p>

            <p className={styles.sprayDetails}>
              {/* Checks if date else returns message */}
              {sprayEvent.date ? sprayEvent.date : "No date entered"}
              <button
                className={styles.editBtn}
                onClick={() => handleEdit("/date")}
              >
                Edit
              </button>
            </p>

            <p className={styles.labels}> Paddock</p>
            <p className={styles.sprayDetails}>
              {/* Checks if a paddock entered else returns a message */}
              {sprayEvent.paddock ? sprayEvent.paddock : "No paddock entered"}
              <button
                className={styles.editBtn}
                onClick={() => handleEdit("/paddock")}
              >
                Edit
              </button>
            </p>

            <p className={styles.labels}> Crop</p>
            <p className={styles.sprayDetails}>
              {/* Checks if a crop entered else returns a message */}
              {sprayEvent.crop ? sprayEvent.crop : "No crop entered"}
              <button
                className={styles.editBtn}
                onClick={() => handleEdit("/crop")}
              >
                Edit
              </button>
            </p>

            <p className={styles.labels}>Spray</p>
            <div className={styles.sprayMixCard}>
              <div className={styles.sprayTitleDisplay}>
                <Link href={`/spray`} className={styles.editBtn}>
                  Edit
                </Link>
              </div>

              {/* Checks if a spray is entered else returns a message */}
              {/* need to add button here next, then sort adding the sprayMix to the sprayMixesList state array */}
              {sprayMixMulti.sprays.length == 0 ? (
                <p>No spray entered</p>
              ) : (
                <ul className={styles.sprayList}>
                  {sprayMixMulti.sprays.map((mix, index1) => {
                    let titleRendered = false;

                    return mix.sprays.map((spray, index) => {
                      return (
                        <>
                          {!titleRendered ? (
                            <div
                              className={styles.sprayMixTitleCont}
                              key={index}
                            >
                              <p className={styles.mixTitle}>{mix.title}</p>{" "}
                              <button
                                className={standard.deleteButton}
                                onClick={() => handleDelete(index1)}
                              >
                                Delete
                              </button>
                            </div>
                          ) : null}
                          {(titleRendered = true)}
                          <li className={styles.sprayType}>
                            <p className={styles.sprayName}>
                              {spray.spray.sprayName.name}
                            </p>
                            <p>
                              {spray.spray.rate} {spray.spray.unit} /ha
                            </p>
                            <div className={styles.line}></div>
                          </li>
                        </>
                      );
                    });
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
                disabled={submitting}
              >
                {submitting ? (
                  <BeatLoader size={8} color={"#ffffff"} />
                ) : (
                  "Submit"
                )}
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
  }
};
export default SprayDetails;
