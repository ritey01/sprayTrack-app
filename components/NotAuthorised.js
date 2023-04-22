import React, { useState } from "react";

const NotAuthorised = () => {
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
      alert("Company registered successfully");
    } else {
      alert("Error registering company");
    }
  };

  return (
    <div>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NotAuthorised;
