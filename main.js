if('serviceWorker'  in  navigator){
    window.addEventListener('load' , () => {
        navigator.serviceWorker
        .register('./sw_site.js')
        .then(reg => console.log("Service worker:Registered "  ))
        .catch(err => console.error(`Service worker: Error: ${err}` ,))
    });
}