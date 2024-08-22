function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function setupGames() {
    var gameList = document.getElementById('game-list');

    fetch('/projects/')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a');

            links.forEach(link => {
                const gameName = link.textContent;
                const gamePath = link.getAttribute('href');

                if (gamePath && gamePath !== '../' && gamePath !== './') {
                    const gameUrl = `/projects/${gamePath}`;
                    const thumbnail = `${gameUrl}cover.png`;
                    const gameLinkNew = `/project.html?url=${gameUrl}index.html`;

                    const gameItem = document.createElement('div');
                    gameItem.classList.add('game-item');

                    const gameImage = document.createElement('img');
                    gameImage.src = thumbnail;
                    gameImage.alt = gameName;

                    const gameTitle = document.createElement('h3');
                    gameTitle.textContent = gameName;

                    const gameLinkElement = document.createElement('a');
                    gameLinkElement.href = gameLinkNew;

                    gameLinkElement.appendChild(gameImage);
                    gameLinkElement.appendChild(gameTitle);

                    gameItem.appendChild(gameLinkElement);
                    gameList.appendChild(gameItem);
                }
            });
        })
        .catch(error => console.error('Error fetching project list:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.getElementById('loading');

    loadingIndicator.style.display = 'none';

    setupGames();
});
