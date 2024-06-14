/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


declare namespace Cypress {
  interface Chainable<Subject> {
    createUser(email: string): Chainable<any>;
    deleteUser(email: string): Chainable<any>;
    signinUser(email: string, password: string): Chainable<any>;
  }
}

Cypress.Commands.add("createUser", (email) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3001/tests/add",
    body: { email },
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add("deleteUser", (email) => {
  cy.request({
    method: "DELETE",
    url: "http://localhost:3001/tests/delete",
    body: { email },
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add("signinUser", (email, password) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3001/signin",
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});