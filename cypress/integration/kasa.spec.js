let place1 = { location: "Austin, TX" };
let place2 = { location: "Atlanta, GA" };
let place3 = { location: "Arlington, VA" };

const places = [place1, place2, place3];

describe('Kasa"s Website', () => {
  beforeEach(() => {
    //Visit Kasa Website
    cy.visit("https://kasa.com/");
    //Close popup Iframe
    cy.wait(2000);
    cy.get('iframe[title="Modal Message"]').then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body).find("span").eq(2).click();
    });
  });
  places.map((place) => {
    specify(`Search for Kasas in ${place.location}`, () => {
      //Search for kasa in preffered location
      cy.get("#full-screen-hero-search-input").fill(`${place.location}`);
      //check in date
      cy.get(".input-container.date-inputs__check-in-date");
      cy.get("#full-screen-hero-check-in-input").fill("01/15/2022");

      //check out date//
      cy.get(".input-container.date-inputs__check-out-date");
      cy.get("#full-screen-hero-check-out-input").fill("01/16/2022");
      //click search
      cy.get("form").eq(0).submit();
      //Verify that the correct location is searched
      cy.findAllByText(`${place.location}`).should("exist");
      cy.wait(2000);
    });
  });

  specify(`Does not allow guests to book a single night stay`, () => {
    //Search for kasa in preffered location
    cy.get("#full-screen-hero-search-input").fill(`${place1.location}`);
    //check in date
    cy.get(".input-container.date-inputs__check-in-date");
    cy.get("#full-screen-hero-check-in-input").fill("05/15/2022");

    //check out date//
    cy.get(".input-container.date-inputs__check-out-date");
    cy.get("#full-screen-hero-check-out-input").fill("05/16/2022");
    //click search
    cy.get("form").eq(0).submit();
    //Book Austin 2nd Street
    cy.findAllByText("Austin 2nd Street").eq(0).should("exist").click();
    //Book the 1 Bedroom King Renovated
    cy.get(".room-type-card__header-title").eq(0).click();
    //2 night minimum stay message
    cy.findAllByText("2-night stays minimum").should('exist');
    //Book now Button show not exist
    cy.findAllByText("Book now").should("not.exist");
  });

  specify(`bookings can be only made on a future date`, () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    today = `0${mm}/${dd}/${yyyy}`;

    //Search for kasa in preffered location
    cy.get("#full-screen-hero-search-input").fill("Austin, TX");
    //check in date
    cy.get(".input-container.date-inputs__check-in-date");
    cy.get("#full-screen-hero-check-in-input").fill(today);

    //check out date//
    cy.get(".input-container.date-inputs__check-out-date");
    cy.get("#full-screen-hero-check-out-input").fill("05/16/2022");
    //click search
    cy.get("form").eq(0).submit();
    //get error message
    cy.findAllByText("Enter valid dates").should("be.visible");
  });

  specify(
    `Kasa has "Heating" in the amenities list when a user visits the property details page`,
    () => {
      //Search for kasa in preffered location
      cy.get("#full-screen-hero-search-input").fill(`${place1.location}`);
      //check in date
      cy.get(".input-container.date-inputs__check-in-date");
      cy.get("#full-screen-hero-check-in-input").fill("05/15/2022");

      //check out date//
      cy.get(".input-container.date-inputs__check-out-date");
      cy.get("#full-screen-hero-check-out-input").fill("05/16/2022");
      //click search
      cy.get("form").eq(0).submit();
      //Book Austin 2nd Street
      cy.findAllByText("Austin 2nd Street").eq(0).should("exist").click();
      //Book the 1 Bedroom King Renovated
      cy.get(".room-type-card__header-title").eq(0).click();
      //check that kasa has Heating
      cy.get("div.room-type-popup__section-distance");
      cy.findByText("Heating").scrollIntoView().should("be.visible");
    }
  );
});
