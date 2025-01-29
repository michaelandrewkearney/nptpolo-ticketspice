// Order Validity Monitoring
// Select the node that will be observed for mutations
const main_form = document.getElementsByTagName("form")[0];

// Options for the observer (which mutations to observe)
const advance_to_checkout_config = { attributes: false, childList: true, subtree: false };

const is_order_valid = () => {
    return false;
}

const enable_button = (button) => {
    button.removeAttribute("disabled");
}

const disable_button = (button) => {
    button.setAttribute("disabled", "");
}

const disable_order_if_invalid = () => {
    if (is_order_valid()) {
        enable_button(document.querySelector(".submit-row > *"));
    } else {
        // TODO: Display error message
        disable_button(document.querySelector(".submit-row > *"));
    }
}

// Callback function to execute when mutations are observed
const advance_to_checkout_mutation_handler = (mutationList, observer) => {
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

// Create an observer instance linked to the callback function
const advance_to_checkout_observer = new MutationObserver(advance_to_checkout_mutation_handler);

// Start observing the target node for configured mutations
advance_to_checkout_observer.observe(main_form, advance_to_checkout_config);