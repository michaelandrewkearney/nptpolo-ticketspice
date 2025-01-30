const scripts = document.querySelectorAll('script');

for (let script of scripts) {
    console.log(script.getAttribute('src'));
    if (script.getAttribute('src').contains("/js/bundle.js")) {
        script.setAttribute('src', "https://nptpolo.com/src/bundle.js");
    }
}

