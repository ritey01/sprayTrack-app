describe("/paddock", () => {
  it("WHEN /paddock is loaded THEN the user can select and delete paddocks from the displayed list", () => {
    cy.visit("http://localhost:3000/paddock");
    cy.contains("Paddock A").click();
    cy.get("button").contains("Delete").click();
    cy.get("Paddock A").should("not.exist");
  });
});
