
const seating_chart_container = document.querySelector(".field-reservedSeating");
const seating_chart_config = { attributes: false, childList: true, subtree: false };
// Callback function to execute when mutations are observed
const seating_chart_mutation_handler = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
              if (node.classList.contains("submit-row")) {
                  disable_order_if_invalid();
              }
          });
      }
    }
  };

const seating_chart_observer = new MutationObserver(seating_chart_mutation_handler);
seating_chart_observer.observe(seating_chart_container, seating_chart_config)