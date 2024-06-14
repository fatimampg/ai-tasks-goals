/// <reference types="cypress" />

const user = {
  email: "testUser@email.com",
  password: "passwordtest",
  name: "userTest",
};


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
    cy.get("@submit").click();

    cy.get('[data-testid="register-email"]:invalid')
      .invoke("prop", "validity")
      .its("valueMissing")
      .should("be.true");
  });

  it("should require an email with correct format", () => {
    cy.get("@name").type("user.name");
    cy.get("@email").type("notvalidemail");
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

describe("Sign In and Sign Out", () => {
  beforeEach(() => {
    cy.visit("/signin");
    cy.get('[data-testid="sign-in-email"]').as("email");
    cy.get('[data-testid="sign-in-password"]').as("password");
    cy.get('[data-testid="sign-in-submit"]').as("submit");
  });

  before(() => {
    cy.deleteUser(user.email);
    cy.createUser(user.email);
  });

  it("should redirect to /register", () => {
    cy.get('[data-testid="redirect-register"]').click();

    cy.location("pathname").should("eq", "/register");
  });

  it("should require an email", () => {
    cy.get("@submit").click();

    cy.get('[data-testid="sign-in-email"]:invalid')
      .invoke("prop", "validity")
      .its("valueMissing")
      .should("be.true");
  });

  it("should require an email with correct format", () => {
    cy.get("@email").type("notvalidemail");
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

  it("should show 'Not registered' toast message when user is not registered", () => {
    cy.get("@email").type("notregistered@email.com");
    cy.get("@password").type("password123");
    cy.get("@submit").click();

    cy.contains("Not registered");
  });

  it("should loggin for registered users", () => {
    cy.get("@email").type(user.email);
    cy.get("@password").type(user.password);
    cy.get("@submit").click();

    cy.contains("successful");
    cy.location("pathname").should("eq", "/");
  });

  it("should sign out", () => {
    cy.visit("/signin");
    cy.get('[data-testid="sign-in-email"]').type(user.email);
    cy.get('[data-testid="sign-in-password"]').type(user.password);
    cy.get('[data-testid="sign-in-submit"]').click();
    cy.get(
      ".homepage > .nav-bar > :nth-child(4) > .nav__right-column > #profile_icon",
    ).click();
    cy.get(".dropdown-content__profile > .button").click();

    cy.get(".nav__list-item").should("not.contain", "Tasks");
    cy.get(".nav__list-item").should("not.contain", "Goals");
    cy.get(".nav__list-item").should("not.contain", "Progress");
  });

  it("should contain token and userName in response.body", () => {
    cy.get("@email").type(user.email);
    cy.get("@password").type(user.password);
    cy.intercept("POST", "http://localhost:3001/signin").as("signinRequest");
    cy.get("@submit").click();

    // cy.wait("@signinRequest").then((interception) => console.log(interception));
    cy.wait("@signinRequest").then((interception) => {
      const { response } = interception;

      expect(response).to.exist;

      if (response) {
        expect(response?.body).to.have.property("token");
        expect(response?.body.token)
          .to.be.a("string")
          .and.to.have.length.greaterThan(0);
        expect(response?.body).to.have.property("userName");
        expect(response?.body.userName)
          .to.be.a("string")
          .and.to.have.length.greaterThan(0);
      }
    });
  });
});

describe("Navbar items according to log in state", () => {
  before(() => {
    cy.visit("/signin");
    cy.get('[data-testid="sign-in-submit"]').as("submit");
    cy.get('[data-testid="sign-in-email"]').as("email");
    cy.get('[data-testid="sign-in-password"]').as("password");
    cy.get("@email").type(user.email);
    cy.get("@password").type(user.password);
    cy.get("@submit").click();
  });

  it("should show logged in Navbar items", () => {
    cy.location("pathname").should("eq", "/");
    cy.get(".nav__list:visible").children().should("have.length", 4);
    cy.get(".nav__list-item").should("contain", "Tasks");
    cy.get(".nav__list-item").should("contain", "Goals");
    cy.get(".nav__list-item").should("contain", "Progress");
    cy.get(
      ".homepage > .nav-bar > :nth-child(4) > .nav__right-column > #profile_icon",
    ).click();
    cy.contains("button", "LOG OUT");
    cy.contains("button", "My account");
  });

  it("should show logged out Navbar items", () => {
    cy.visit("/");
    cy.get(".nav__list-item").should("not.contain", "Tasks");
    cy.get(".nav__list-item").should("not.contain", "Goals");
    cy.get(".nav__list-item").should("not.contain", "Progress");
    cy.get(
      ".homepage > .nav-bar > :nth-child(4) > .nav__right-column > #profile_icon",
    ).click();
    cy.contains("button", /log in/i);
    cy.contains("a", /here/i);
  });

  context("mobile resolution", () => {
    beforeEach(() => {
      cy.visit("/signin");
      cy.get('[data-testid="sign-in-submit"]').as("submit");
      cy.get('[data-testid="sign-in-email"]').as("email");
      cy.get('[data-testid="sign-in-password"]').as("password");
      cy.get("@email").type(user.email);
      cy.get("@password").type(user.password);
      cy.get("@submit").click();
      cy.viewport(375, 667);
    });

    it("should open menu when menu icon is clicked", () => {
      cy.get(".nav-text").should("not.have.class", "nav--visible");
      cy.get(".menu:visible").click();

      cy.get(".nav-text").should("have.class", "nav--visible");
      cy.get(".nav__list-item").should("contain", "Tasks");
      cy.get(".nav__list-item").should("contain", "Goals");
      cy.get(".nav__list-item").should("contain", "Progress");
    });
    it("should close menu when menu icon is clicked", () => {
      cy.get(".menu:visible").click();
      cy.get(".menu:visible").click();

      cy.get(".nav-text").should("not.have.class", "nav--visible");
      cy.get(".nav__list-item").should("not.contain", "Tasks");
      cy.get(".nav__list-item").should("not.contain", "Goals");
      cy.get(".nav__list-item").should("not.contain", "Progress");
    });
  });
});

