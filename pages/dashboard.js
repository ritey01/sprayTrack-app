import prisma from "../lib/prisma";

export async function getServerSideProps() {
  // Fetch all SprayEvents and include related data from Paddock, Crop, SprayMix, and Company
  const sprayEvents = await prisma.sprayEvent.findMany({
    include: {
      paddock: true,
      crop: true,
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
  });

  //   Convert createdAt field to string
  const sprayEventsWithCreatedAtAsString = sprayEvents.map((sprayEvent) => {
    return {
      ...sprayEvent,
      createdAt: sprayEvent.createdAt.toString(),
    };
  });

  return {
    props: {
      sprayEvents: sprayEventsWithCreatedAtAsString,
    },
  };
}

export default function SprayEventDashboard({ sprayEvents }) {
  return (
    <div>
      <h1>Spray Events</h1>
      {sprayEvents.length == 0 ? (
        <p>No spraying events recorded</p>
      ) : (
        <>
          {/* This would be for mobile only */}
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Paddock</th>
                <th>Crop</th>
                <th>Spray Mix</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {sprayEvents.map((sprayEvent) => (
                <tr key={sprayEvent.id}>
                  <td>{sprayEvent.date}</td>
                  <td>{sprayEvent.paddock.name}</td>
                  <td>{sprayEvent.crop.name}</td>
                  <td>{sprayEvent.sprayMix.title}</td>

                  <td>{sprayEvent.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Create another with all the details of SprayEvent displayed for desktop */}
        </>
      )}
    </div>
  );
}
