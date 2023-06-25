import { useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { v4 as uuidv4 } from "uuid";
import { renderToString } from "react-dom/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import Error from "./_error";
import AccessDenied from "../components/accessDenied";
import { authOptions } from "./api/auth/[...nextauth]";
import styles from "../styles/Dashboard.module.css";
import prisma from "../lib/prisma";

export async function getServerSideProps(context) {
  let errorCode;
  let sprayEvents;
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      props: {},
    };
  }
  const companyId = session.user.companyId;
  // Fetch all SprayEvents and include related data from Paddock, Crop, SprayMix, and Company

  try {
    sprayEvents = await prisma.sprayEvent.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        paddock: true,
        crop: true,
        sprayMix: {
          include: {
            sprayMix: {
              include: {
                sprays: {
                  include: {
                    spray: {
                      include: {
                        sprayName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    errorCode = context.res.statusCode > 200 ? context.res.statusCode : false;
    //   Convert createdAt field to string
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code);
    } else {
      console.error(error);
    }
    context.res.statusCode = 500;
    errorCode = context.res.statusCode;
    sprayEvents = [];
  }

  const sprayEventsWithCreatedAtAsString = sprayEvents.map((sprayEvent) => {
    return {
      ...sprayEvent,
      createdAt: sprayEvent.createdAt.toString(),
    };
  });

  return {
    props: {
      sprayEvents: sprayEventsWithCreatedAtAsString,
      errorCode,
      session,
    },
  };
}

export default function SprayEventDashboard({ sprayEvents, errorCode }) {
  const { data: session } = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [paddockList, setPaddockList] = useState([]);
  const [selectedPaddock, setSelectedPaddock] = useState("");
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log(sprayEvents);

  useEffect(() => {
    // Extract all paddock names from sprayEvents and add them to paddockList
    const paddockNames = sprayEvents.map(
      (sprayEvent) => sprayEvent.paddock.name
    );
    setPaddockList(paddockNames);
  }, [sprayEvents]);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  // Filter the sprayEvents array to only include events with the selected paddock
  const filteredSprayEvents = selectedPaddock
    ? sprayEvents.filter(
        (sprayEvent) => sprayEvent.paddock.name === selectedPaddock
      )
    : sprayEvents;

  // Filter the sprayEvents array to only include events with the selected row
  const selectedSprayEvent = sprayEvents.find(
    (sprayEvent) => sprayEvent.id === selectedRow
  );

  const handleDownload = () => {
    const doc = new jsPDF();
    const element = document.querySelector("table");
    const options = {
      margin: { top: 20 },
      html2canvas: { scale: 0.5 },
      useCORS: true,
    };
    doc.autoTable({
      html: element,
      startY: 20,
      styles: {
        cellWidth: "wrap",
      },
    });
    doc.save("table.pdf");
  };

  const handleRowClick = (rowId) => {
    const selectedSprayEvent = sprayEvents.find(
      (sprayEvent) => sprayEvent.id === rowId
    );
    const text = renderToString(
      <>
        <p>Date: {selectedSprayEvent.date}</p>
        <p>Paddock: {selectedSprayEvent.paddock.name}</p>
        <p>Crop: {selectedSprayEvent.crop.name}</p>
        <p>Created By: {selectedSprayEvent.createdBy}</p>
        <p>Spray Mix:</p>
        {selectedSprayEvent.sprayMix.map((mix) => (
          <p key={mix.sprayMix.title}>
            {mix.sprayMix.title}:{" "}
            {mix.sprayMix.sprays
              .map(
                (spray) =>
                  `${spray.spray.sprayName.name} (${spray.spray.rate} ${spray.spray.unit})`
              )
              .join(", ")}
          </p>
        ))}
      </>
    );

    Swal.fire({
      title: "Selected Spray Event",
      html: text,
    });
  };

  return (
    <>
      {session ? (
        <div>
          <h1>Spray Events</h1>
          {sprayEvents.length == 0 ? (
            <p>No spraying events recorded</p>
          ) : (
            <>
              <button onClick={handleDownload} className={styles.downloadBtn}>
                Download
              </button>
              {/* Add a dropdown box with all paddock names */}
              <div className={styles.selectContainer}>
                <label htmlFor="paddock-select">Select a paddock:</label>
                <select
                  id="paddock-select"
                  value={selectedPaddock}
                  onChange={(event) => {
                    const paddockName = event.target.value;
                    setSelectedPaddock(paddockName);
                  }}
                >
                  <option value="">--All Paddocks--</option>
                  {paddockList.map((paddockName) => (
                    <option key={paddockName} value={paddockName}>
                      {paddockName}
                    </option>
                  ))}
                </select>
              </div>

              {/* This would be for mobile only */}
              {screenWidth < 1000 && (
                <div>
                  <table className={styles.tableDisplay}>
                    <thead>
                      <tr className={styles.borderDisplay}>
                        <th>Select</th>
                        <th>Date</th>
                        <th>Paddock</th>
                        <th>Crop</th>
                        <th>Created By</th>
                        <th>Spray Mix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSprayEvents.map((sprayEvent) => (
                        <tr
                          key={sprayEvent.id}
                          className={styles.borderDisplay}
                        >
                          <td>
                            <input
                              type="radio"
                              name="selectedRow"
                              value={sprayEvent.id}
                              checked={selectedRow === sprayEvent.id}
                              onChange={() => handleRowClick(sprayEvent.id)}
                            />
                          </td>
                          <td>{sprayEvent.date}</td>
                          <td>{sprayEvent.paddock.name}</td>
                          <td>{sprayEvent.crop.name}</td>
                          <td>{sprayEvent.createdBy}</td>
                          <td>
                            <table>
                              <tbody>
                                {sprayEvent.sprayMix.map((mix) => (
                                  <tr key={uuidv4()} className="noBorder">
                                    <td>{mix.sprayMix.title}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* This would be for desktop only so only render if screen width is > 1000px*/}
              {screenWidth >= 1000 && (
                <div className={styles.desktopContainer}>
                  <table className={styles.tableDisplay}>
                    <thead>
                      <tr className={styles.borderDisplay}>
                        <th>Select</th>
                        <th>Date</th>
                        <th>Paddock</th>
                        <th>Crop</th>
                        <th>Created By</th>
                        <th>Spray Mix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSprayEvents.map((sprayEvent) => (
                        <tr
                          key={sprayEvent.id}
                          className={styles.borderDisplay}
                        >
                          <td>
                            <input
                              type="radio"
                              name="selectedRow"
                              value={sprayEvent.id}
                              checked={selectedRow === sprayEvent.id}
                              onChange={() => setSelectedRow(sprayEvent.id)}
                            />
                          </td>
                          <td>{sprayEvent.date}</td>
                          <td>{sprayEvent.paddock.name}</td>
                          <td>{sprayEvent.crop.name}</td>
                          <td>{sprayEvent.createdBy}</td>
                          <td>
                            <table>
                              <tbody>
                                {sprayEvent.sprayMix.map((mix) =>
                                  mix.sprayMix.sprays.map((spray, index) => (
                                    <>
                                      <tr key={uuidv4()} className="noBorder">
                                        {index === 0 && (
                                          <td className={styles.mixTitle}>
                                            {mix.sprayMix.title}
                                            <br />
                                          </td>
                                        )}
                                      </tr>

                                      <tr key={uuidv4()} className="noBorder">
                                        <td>{spray.spray.sprayName.name} </td>

                                        <td>{spray.spray.rate}</td>
                                        <td>
                                          {spray.spray.unit}
                                          <br />
                                        </td>
                                      </tr>
                                    </>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
