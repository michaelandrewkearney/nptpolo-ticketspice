const body = document.body;
const script_load_config = { attributes: false, childList: true, subtree: false };

// Callback function to execute when mutations are observed
const script_load_mutation_handler = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
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