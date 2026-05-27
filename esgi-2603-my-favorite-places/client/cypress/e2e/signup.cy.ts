describe("Signup", () => {
  it("crée un compte avec succès", () => {
    cy.visit("/signup");

    cy.get('input[name="email"]').type(`test-${Date.now()}@test.com`);
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.contains("User created, you can signin");
  });
});
