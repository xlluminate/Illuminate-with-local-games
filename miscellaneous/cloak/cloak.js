var url = document.getElementById("url-target");
var urlObj = new window.URL(window.location.href);
function check() {
    if (document.getElementById("passwordbox").value == combination) {
        win = window.open();
        win.document.body.style.margin = "0";
        win.document.body.style.height = "100vh";
        var iframe = win.document.createElement("iframe");
        iframe.style.border = "none";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.margin = "0";
        iframe.referrerpolicy = "no-referrer";
        iframe.allow = "fullscreen";
        iframe.src = redirect;
        win.document.body.appendChild(iframe);
        var script = win.document.createElement("script");
        win.document.body.appendChild(script);
    };
}
