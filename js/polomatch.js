// NODE OBSERVATION HELPER FUNCTIONS

const getElementByTagName = (tagName) => {
  return document.getElementsByTagName(tagName)[0];
};

const getElementByClassName = (className) => {
  return document.getElementsByClassName(className)[0];
};

const getElementById = (id) => {
  return document.getElementById(id);
};

const querySelector = (query) => {
  return document.querySelector(query);
};

const logMainElements = () => {
  const mainElements = [
    ["HTML", getElementByTagName, "html"],
    ["head", getElementByTagName, "head"],
    ["body", getElementByTagName, "body"],
    ["root", getElementById, "root"],
    ["campaign-form", getElementByClassName, "campaign-form"],
    ["form", getElementByTagName, "form"],
    ["registrants", getElementById, "registrants"],
    ["billing-section", getElementById, "billing-section"],
    ["submit-row", getElementByClassName, "submit-row"],
    ["field-reservedSeating", getElementByClassName, "field-reservedSeating"],
    ["pickSeats", getElementByClassName, "pickSeats"],
    [
      "reserved-seating-container",
      getElementById,
      "reserved-seating-container",
    ],
    ["reservedSeating", getElementByClassName, "reservedSeating"],
    [
      "reservedSeating-container",
      getElementByClassName,
      "reservedSeating-container",
    ],
    ["layout", getElementById, "layout"],
    ["viewport", getElementByClassName, "viewport"],
    ["seated-sections", getElementById, "seated-sections"],
    ["table-sections", getElementById, "table-sections"],
    ["seats", querySelector, "g.viewport > g.seats"],
  ];
  for (let [elementName, func, arg] of mainElements) {
    element = func(arg);
    if (element == null) {
      console.log(`WARNING: ${elementName} is null or undefined.`);
    } else {
      console.log(`${elementName} is defined.`);
    }
  }
};

// Observes Descendant Nodes Added to Node
const addedNodeMutationHandler = (mutationList, observer) => {
  let count = 0;
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      console.log(count);
      mutation.addedNodes.forEach((node) => {
        console.log(
          `${node.parentElement.tagName}.${node.parentElement.className} > ${node.tagName}.${node.className}`
        );
      });
      count = count + 1;
    }
  }
};

const addedNodeObserver = new MutationObserver(addedNodeMutationHandler);
const addedNodeConfig = { attributes: false, childList: true, subtree: true };

// SEATING CHART MODIFICATION

const pavilion_viewport_transform_attribute =
  "matrix(0.3865505064688903,0,0,0.3865505064688903,752.0665322312002,762.9232348556498)";
const pavilion_viewport_transform_style =
  "transform: matrix(0.386551, 0, 0, 0.386551, 752.067, 762.923);";

const circleRadius = 30;
const smallCircleInstructions =
  "m -10,0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0";
const largeCircleInstructions =
  "m -30,0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0";
const chaletSectionNumber = 1;
const tailgateSectionNumber = 2;

const getLayout = () => {
  return document.getElementById("layout");
};

const getViewport = () => {
  return document.querySelector("#layout > g.viewport");
};

const getSelectSeats = () => {
  return document.querySelector("#layout > g.viewport > g.seats");
};

const zoomToPavilion = () => {
  const viewport = getViewport();
  if (typeof viewport !== "undefined" && viewport !== null) {
    viewport.transform = pavilion_viewport_transform_attribute;
    viewport.style.transform = pavilion_viewport_transform_style;
  }
};

const redrawAll = () => {
  redrawAllSpots();
  redrawAllSelectSeats();
};

const redrawAllSpots = () => {
  redrawSection(chaletSectionNumber);
  redrawSection(tailgateSectionNumber);
};

const redrawSection = (sectionNumber) => {
  const section = document.getElementById("section" + sectionNumber);
  if (typeof section !== "undefined" && section !== null) {
    for (let path of section.getElementsByTagName("path")) {
      redrawSpot(path);
    }
  }
};

const redrawSpot = (spot) => {
  if (spot.hasAttribute("d")) {
    spot.setAttribute(
      "d",
      spot
        .getAttribute("d")
        .replaceAll(smallCircleInstructions, largeCircleInstructions)
    );
  }
};

const redrawAllSelectSeats = () => {
    const selectSeats = getSelectSeats();
    if (typeof selectSeats !== "undefined" && selectSeats !== null && typeof selectSeats.childNodes !== "undefined" && selectSeats.childNodes !== null) {
        for (let seat of selectSeats.childNodes) {
            redrawSelectSeat(seat);
        }
    }
};

// Redraws Row Seat in Select Seat container
const redrawSelectSeat = (seat) => {
  for (let circle of seat.getElementsByTagName("circle")) {
    circle.setAttribute("r", circleRadius);
    circle.style.r = circleRadius;
  }
};

// ORDER VALIDATION

const TicketType = Object.freeze({
  OTHER: 0,
  LAWN_TICKET: 1,
  PAVILION: 2,
  TAILGATE: 3,
  CHALET: 4,
  RESERVED_LAWN: 5,
  CABANA: 6,
  GRANDSTAND: 7,
});

const tailgateChaletCombinedTicketMaximum = 10;

const tailgateChaletLawnTicketMinimums = [
  0, 0, 30, 45, 60, 80, 120, 150, 180, 210, 250,
];

const getEmptyTicketCountsMap = () => {
  const ticketCounts = new Map([
    [TicketType.OTHER, 0],
    [TicketType.LAWN_TICKET, 0],
    [TicketType.PAVILION, 0],
    [TicketType.TAILGATE, 0],
    [TicketType.CHALET, 0],
    [TicketType.RESERVED_LAWN, 0],
    [TicketType.CABANA, 0],
    [TicketType.GRANDSTAND, 0],
  ]);
  return ticketCounts;
};

const incrementMap = (map, key, value) => {
  if (map.has(key)) {
    map.set(key, map.get(key) + value);
  } else {
    map.set(key, value);
  }
  return map.get(key);
};

const getTierBodyTier = (tierBody) => {
  const tierName = tierBody.firstElementChild.firstElementChild.textContent;
  switch (tierName) {
    case "Lawn Ticket":
      return TicketType.LAWN_TICKET;
    case "Tailgate":
      return TicketType.TAILGATE;
    case "Chalet":
      return TicketType.CHALET;
    case "Reserved Lawn":
    case "Reserved Lawn A":
    case "Reserved Lawn B":
      return TicketType.RESERVED_LAWN;
    case "Cabana 1":
    case "Cabana 2":
    case "Cabana 3":
    case "Cabana 4":
    case "Clicquot Terrasse":
      return TicketType.CABANA;
    case "Grandstand":
    case "Grandstand Left":
    case "Grandstand Right":
      return TicketType.GRANDSTAND;
    default:
      return TicketType.PAVILION;
  }
  if (tierName.includes("Pavilion")) {
    return TicketType.PAVILION;
  }
  return TicketType.OTHER;
};

const getTierBodyTicketCount = (tierBody) => {
  return tierBody.getElementsByTagName("tr").length - 1;
};

const getTicketCounts = () => {
  const ticketTable = document.querySelector("table.holds-tickets");
  // TODO: Error check that Ticket Table exists
  const ticketCounts = getEmptyTicketCountsMap();
  for (let tierBody of ticketTable.getElementsByTagName("tbody")) {
    incrementMap(
      ticketCounts,
      getTierBodyTier(tierBody),
      getTierBodyTicketCount(tierBody)
    );
  }
  return ticketCounts;
};

const getValidityMessages = () => {
  // catch error if no Ticket Table exists
  const validityMessages = [];
  const ticketCounts = getTicketCounts();
  const combinedTailgateChaletTicketCount =
    ticketCounts.get(TicketType.TAILGATE) + ticketCounts.get(TicketType.CHALET);
  if (combinedTailgateChaletTicketCount > tailgateChaletCombinedTicketMaximum) {
    validityMessages.push(
      `Orders are limited to ${tailgateChaletLawnTicketMinimums} Tailgate and Chalet tickets combined.<br>Please go back to edit your order.`
    );
    return validityMessages;
  }
  if (
    ticketCounts.get(TicketType.LAWN_TICKET) <
    tailgateChaletLawnTicketMinimums[combinedTailgateChaletTicketCount]
  ) {
    validityMessages.push(
      `Orders of more than one Tailgate or Chalet require a minimum number of Lawn Tickets.<br>An order of ${combinedTailgateChaletTicketCount} Tailgates or Chalets requires ${tailgateChaletLawnTicketMinimums[combinedTailgateChaletTicketCount]} Lawn Tickets.<br>Please go back and edit your order.`
    );
  }
  return validityMessages;
};

const enableButton = (button) => {
  if (button.hasAttribute("disabled")) {
    button.removeAttribute("disabled");
  }
};

const disableButton = (button) => {
  button.setAttribute("disabled", "");
};

// Adds a string message to an Order Validity Container
const addValidityMessage = (message, container) => {
  const messageWrapper = document.createElement("p");
  messageWrapper.classList.add("validity-message-wrapper");
  messageWrapper.innerHTML = message;
  container.appendChild(messageWrapper);
};

const topValidityMessagesContainer = document.createElement("div");
const middleValidityMessagesContainer = document.createElement("div");
const bottomValidityMessagesContainer = document.createElement("div");

const clearValidityMessages = () => {
  for (let container of [
    topValidityMessagesContainer,
    middleValidityMessagesContainer,
    bottomValidityMessagesContainer,
  ]) {
    while (container.firstElementChild) {
      container.removeChild(container.firstElementChild);
    }
  }
  enableButton(getSubmitButton());
};

const getTicketBlock = () => {
  return document.querySelector("div#ticketBlock");
};

const getSubmitRow = () => {
  return document.querySelector("div.submit-row");
};

const getSubmitButton = () => {
  return getSubmitRow().querySelector("button");
};

// STATE HANDLERS

const chartOverviewStateHandler = () => {
  redrawAllSpots();
};

const selectSeatsStateHandler = () => {
  redrawAllSelectSeats();
};

// Redraws Row Seats that are added to the Select Seats container
const selectSeatsHoverHandler = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "g") {
          redrawSelectSeat(node);
        }
      }
    }
  }
};

const checkoutStateHandler = () => {
  clearValidityMessages();
  // Top Message Container
  topValidityMessagesContainer.id = "top-validity-messages-container";
  topValidityMessagesContainer.classList.add("validity-messages-container");
  //getTicketBlock().prepend(topValidityMessagesContainer);

  middleValidityMessagesContainer.id = "middle-validity-messages-container";
  middleValidityMessagesContainer.classList.add("validity-messages-container");
  getTicketBlock().appendChild(middleValidityMessagesContainer);

  // Bottom Message Container
  bottomValidityMessagesContainer.id = "bottom-validity-messages-container";
  bottomValidityMessagesContainer.classList.add("validity-messages-container");
  getSubmitRow().prepend(bottomValidityMessagesContainer);

  // Check Order Validity
  const validityMessages = getValidityMessages();
  if (validityMessages.length > 0) {
    disableButton(getSubmitButton());
    for (let message of validityMessages) {
      addValidityMessage(message, topValidityMessagesContainer);
      addValidityMessage(message, middleValidityMessagesContainer);
      addValidityMessage(message, bottomValidityMessagesContainer);
    }
  }
};

// MUTATION HANDLERS

// Reserved Seating Mutation Handler
const reservedSeatingContainerMutationHandler = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.id === "ticketBlock") {
          // Checkout Page
          checkoutStateHandler();
          return;
        }
      });
      mutation.removedNodes.forEach((node) => {
        if (node.id === "transitionSpinner") {
          // Initial Seating Chart
          chartOverviewStateHandler();
          selectSeatsStateHandler();
        }
      });
    }
  }
};

const reservedSeatingChartMutationConfig = {
  attributes: false,
  childList: true,
  subtree: false,
};
const reservedSeatingChartObserver = new MutationObserver(
  reservedSeatingContainerMutationHandler
);

// Registrants Mutation Handler
const registrantsMutationHandler = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        console.log(`${node.tagName}#${node.id}.${node.className}`);
        if (node.className === "reservedSeating") {
          // Attach New Mutation Handler to Reserver Seating Container
          reservedSeatingChartObserver.observe(
            node.parentElement,
            reservedSeatingChartMutationConfig
          );
          console.log("Reserved Seating Chart Observer now observing.");
          // Disconnect Registrants Mutation Handler
          observer.disconnect();
          redrawAll();
        }
      });
    }
  }
};

const registrantsMutationConfig = {
  attributes: false,
  childList: true,
  subtree: true,
};
const registrantsObserver = new MutationObserver(registrantsMutationHandler);
registrantsObserver.observe(
  document.getElementById("registrants"),
  registrantsMutationConfig
);
