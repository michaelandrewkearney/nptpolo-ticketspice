const scripts = document.querySelectorAll('script');
scripts.forEach((script) => {
    if (script.getAttribute('src').startsWith("/js/bundle.js")) {
        seat.setAttribute('src', 'https://nptpolo.com/src/bundle2.js');
    }
});

for (let script of document.scripts) {
    console.log(script.getAttribute('src'));
    if (script.getAttribute('src').startsWith("/js/bundle.js")) {
        script.setAttribute('src', "https://nptpolo.com/src/bundle.js");
    }
}


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


const body = document.body;
const script_load_config = { attributes: false, childList: true, subtree: false };

// Callback function to execute when mutations are observed
const script_load_mutation_handler = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        alert(mutation.target.children())
          mutation.addedNodes.forEach((node) => {
            if (node.hasAttribute("src")) {
                alert(node.tagName + ": " + node.getAttribute("src"));
            }
          });
      }
    }
  };

const script_load_observer = new MutationObserver(script_load_mutation_handler);
script_load_observer.observe(body, script_load_config);