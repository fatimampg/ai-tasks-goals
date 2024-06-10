/// <reference types="cypress" />

const user = {
  email: "testUser@email.com",
  password: "passwordtest",
  name: "userTest",
};

describe("Sign In", () => {
  beforeEach(() => {
    cy.visit("/signin");
    cy.get('[data-testid="sign-in-submit"]').as("submit");
    cy.get('[data-testid="sign-in-email"]').as("email");
    cy.get('[data-testid="sign-in-password"]').as("password");
  });

  it("should require an email", () => {
    cy.get("@submit").click();

    cy.get('[data-testid="sign-in-email"]:invalid')
      .invoke("prop", "validity")
      .its("valueMissing")
      .should("be.true");
  });

  it("should require an email with correct format", () => {
    cy.get("@email").type("noemail");
    cy.get("@submit").click();

    cy.get('[data-testid="sign-in-email"]:invalid')
      .invoke("prop", "validity")
      .its("typeMismatch")
      .should("be.true");
  });

  it("should require a password", () => {
    cy.get("@email").type(user.email);
    cy.get("@submit").click();

    cy.get('[data-testid="sign-in-password"]:invalid')
      .invoke("prop", "validity")
      .its("valueMissing")
      .should("be.true");
  });

  it("should show 'Not registered' toast message when user is not valid", () => {
    cy.get("@email").type(user.email);
    cy.get("@password").type(user.password);
    cy.get("@submit").click();

    cy.contains("Not registered");
  });

  it("should loggin for registered user", () => {
    cy.deleteUser(user.email);
    cy.createUser(user.email);
    cy.get("@email").type(user.email);
    cy.get("@password").type(user.password);
    cy.get("@submit").click();

    cy.contains("successful");
  });

  it("should redirect to /register", () => {
    cy.get('[data-testid="redirect-register"]').click();

    cy.location("pathname").should("eq", "/register");
  });
});

describe("Register", () => {
  beforeEach(() => {
    cy.visit("/register");
    cy.get('[data-testid="register-submit"]').as("submit");
    cy.get('[data-testid="register-name"]').as("name");
    cy.get('[data-testid="register-email"]').as("email");
    cy.get('[data-testid="register-password"]').as("password");
    cy.get('[data-testid="register-passwordConfirm"]').as("passwordConfirm");
  });

  it("should require an email", () => {
    cy.get("@name").type(user.name);
    cy.get("@submit").click();

    cy.get('[data-testid="register-email"]:invalid')
      .invoke("prop", "validity")
      .its("valueMissing")
      .should("be.true");
  });

  it("should require an email with correct format", () => {
    cy.get("@name").type(user.name);
    cy.get("@email").type("no email");
    cy.get("@password").type(user.password);
    cy.get("@passwordConfirm").type(user.password);
    cy.get("@submit").click();

    cy.get('[data-testid="register-email"]:invalid')
      .invoke("prop", "validity")
      .its("typeMismatch")
      .should("be.true");
  });

  it("should show toast message when passwords don't match", () => {
    cy.get("@name").type(user.name);
    cy.get("@email").type(user.email);
    cy.get("@password").type(user.password);
    cy.get("@passwordConfirm").type(" ");
    cy.get("@submit").click();

    cy.contains("don't match");
  });

  it("should register user when all inputs have correct format", () => {
    cy.deleteUser(user.email);

    cy.get("@name").type(user.name);
    cy.get("@email").type(user.email);
    cy.get("@password").type(user.password);
    cy.get("@passwordConfirm").type(user.password);
    cy.get("@submit").click();

    cy.contains("You are now registered");
  });

  it("should redirect to /signin", () => {
    cy.get('[data-testid="redirect-signin"]').click();

    cy.location("pathname").should("eq", "/signin");
  });
});
