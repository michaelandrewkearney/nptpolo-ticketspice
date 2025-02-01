document.head.innerHTML += '<link rel="stylesheet" href="styles.css" type="text/css"/>';

const loadScript = (url) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};

const loadStyle = (url) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
};
