import React, { useState } from "react";
import { signIn } from "next-auth/react";

const RegisterCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [recorded, setRecorded] = useState(false);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const callbackUrl =
    process.env.NODE_ENV === "production"
      ? "https://spray-track-app.vercel.app/paddock"
      : "http://localhost:3000/paddock";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      companyName: capitalizeFirstLetter(companyName),
      adminName: capitalizeFirstLetter(adminName),
      adminEmail: adminEmail,
    };

    const result = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (result.status === 201) {
      setRecorded(true);
    } else {
      if (result.status === 400) {
        alert("Company already registered with this email");
      } else {
        alert("Error registering company");
      }
    }
  };

  return (
    <div>
      {!recorded ? (
        <>
          <p>
            You are not authorised to view this page. Contact your company
            administrator or register your company below to use the application
          </p>
          <form onSubmit={handleSubmit}>
            <label>
              Company Name:
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Administrator Name:
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Administrator Email:
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </label>
            <br />
            <button onClick={handleSubmit}>Submit</button>
          </form>
        </>
      ) : (
        <>
          <p>Company registered successfully</p>
          <button
            onClick={() => signIn("google", { callbackUrl: callbackUrl })}
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );
};

export default RegisterCompany;
