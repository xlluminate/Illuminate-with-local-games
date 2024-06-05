function saveData() {
    var cookieData = document.cookie.split(';').map(function (c) {
        var i = c.indexOf('=');
        return [c.substring(0, i), c.substring(i + 1)];
    });
    //copy(JSON.stringify(JSON.stringify(cookieData)));
    //cookieData = JSON.stringify(JSON.stringify(cookieData));
}
function loadData(data) {
    var cookieData = JSON.parse(data);
    cookieData.forEach(function (arr) {
        document.cookie = arr[0] + '=' + arr[1];
    });
}
function extractURL() {
    var url = window.location.href;
    if (url.indexOf('?') !== -1) {
        var queryString = url.split('?')[1];
        var parameters = queryString.split('&');
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i];
            if (parameter.startsWith('q=')) {
                return parameter.substring(4);
            }
        }
    }
    return null;
}
const save = () => {
    var cookieData = '';
    saveData();
    const link = document.createElement("a");
    var content = cookieData;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "data.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    //window.close();
}
function load() {
    if (confirm('Are you sure you want to replace your site data with this value?') == true) {
        var newCookieData = extractURL();
        loadData(newCookieData);
        confirm('Success, your data has been replaced.');
        window.close();
    } else {
        window.close();
    }
}