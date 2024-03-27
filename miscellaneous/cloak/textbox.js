document.getElementById('password').style.display = 'none';
var keys = [];
keys[1] = 't';
keys[2] = 'e';
keys[3] = 'x';
keys[4] = 't';
keys[5] = 'b';
keys[6] = 'o';
keys[7] = 'x';
var i = 1;
var data = null; document.addEventListener('keydown', async function (e) {
    if (e.key == keys[i]) {
        i++;
    } else {
        i = 1
    }
    if (i == 8) {
        document.getElementById('password').style.display = 'block';
    }
});