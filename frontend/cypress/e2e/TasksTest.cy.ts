/// <reference types="cypress" />

describe("Dashboard Tasks", () => {
  beforeEach(() => {
    cy.visit("/tasks");
  });

  it("should have inputs start and end dates", () => {
    cy.get("input#date_start").should("exist");
    cy.get("input#date_end").should("exist");
  });
  it("should accept start and end dates", () => {
    cy.get("input#date_start").type("2024-04-01");
    cy.get("input#date_end").type("2024-06-01");
  });

  it('should have "Save Task Progress"', () => {
    cy.contains("Save Task Progress");
  });
});
