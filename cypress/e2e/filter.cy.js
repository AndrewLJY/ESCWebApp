
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value"
).set;
// TC5 Filter Search
describe("Filter Search", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:5173/search?location=Singapore%2C+Singapore&hotel=&checkin=2025-08-20&checkout=2025-08-30&guests=1&roomNum=1"
    );
  });

  it("Pre-condition: User is viewing Hotel Search results", () => {
    cy.url().should("include", "/search?");
    cy.get(".hotel-results", { timeout: 10000 }).should("exist");
  });

  it("Flow: filter search (Sort)", () => {
    cy.get(".form-select").eq(0).select("Rating (High to Low)");
    cy.get(".hotel-card").eq(0).find(".stars").should("contain", "★★★★★");
  });

  it("Flow: filter search (price range)", () => {
    cy.get('input[type="range"]')
      .eq(0)
      .then(($range) => {
        const range = $range[0];
        nativeInputValueSetter.call(range, 3860);
        range.dispatchEvent(
          new Event("change", { value: 3860, bubbles: true })
        );
      });
    cy.get('input[type="range"]')
      .eq(1)
      .then(($range) => {
        const range = $range[0];
        nativeInputValueSetter.call(range, 10000);
        range.dispatchEvent(
          new Event("change", { value: 10000, bubbles: true })
        );
      });
    cy.get(".hotel-card")
      .eq(0)
      .find(".hotel-book")
      .find(".fw-bold")
      .invoke("text")
      .then((text) => {
        const intValueStr = text.slice(0, -4);
        const intVal = parseInt(intValueStr);
        expect(intVal).to.be.at.least(3860);
      });

    for (var i = 0; i < 9; i++) {
      cy.get(".page-item").eq(1).find("a").click();
      cy.wait(50);
    }

    cy.get(".hotel-card")
      .eq(-1)
      .find(".hotel-book")
      .find(".fw-bold")
      .invoke("text")
      .then((text) => {
        const intValueStr = text.slice(0, -4);
        const intVal = parseInt(intValueStr);
        expect(intVal).to.be.at.most(10000);
      });
  });

  it("Clear Filters", () => {
    cy.get('input[type="range"]')
      .eq(0)
      .then(($range) => {
        const range = $range[0];
        nativeInputValueSetter.call(range, 3860);
        range.dispatchEvent(
          new Event("change", { value: 3860, bubbles: true })
        );
      });
    cy.get('input[type="range"]')
      .eq(1)
      .then(($range) => {
        const range = $range[0];
        nativeInputValueSetter.call(range, 10000);
        range.dispatchEvent(
          new Event("change", { value: 10000, bubbles: true })
        );
      });
    cy.get(".form-select").eq(0).select("Rating (High to Low)");
    cy.get("button").contains("Clear Filters").click();
    cy.get('input[type="range"]').eq(0).should("have.value", 0);
    cy.get('input[type="range"]').eq(1).should("have.value", 21238);
    cy.get(".form-select").eq(0).should("have.value", "price");
  });
});
