function getMainURL() {
    return `${window.location.protocol}//${window.location.host}`;
}

function extractFlashGameURL(href) {
    var url = href;
    if (url.indexOf('#') !== -1) {
        var queryString = url.split('#')[1];
        var parameters = queryString.split('&');
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i];
            if (parameter.startsWith('game=')) {
                return parameter.substring(5);
            }
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.getElementById('loading');
    const gameList = document.getElementById('game-list');

    // Function to fetch the game list from the external HTML file
    function fetchGameList() {
        return fetch('list.html')
            .then(response => response.text())
            .catch(error => {
                console.error('Error fetching game list:', error);
                return '';
            });
    }

    // Function to create game items from the fetched HTML
    function createGameItems(html) {
        const mainURL = getMainURL();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const cards = tempDiv.querySelectorAll('.card');

        cards.forEach(card => {
            const link = card.querySelector('a');
            const gameName = link.textContent;
            const gameUrl = link.getAttribute('href');
            let thumbnail;
            let gameLinkNew;

            if (gameUrl.includes('#game=')) {
                // Flash game
                const gameParam = extractFlashGameURL(gameUrl);
                thumbnail = `${mainURL}/projects/flash/images/${gameParam}.png`;
                gameLinkNew = `/project.html?url=${mainURL}/projects/flash/#game=${gameParam}`;
            } else {
                // HTML5 game
                thumbnail = gameUrl.replace(/index\.htm(l)?$/, 'cover.png');
                gameLinkNew = `/project.html?url=${mainURL}/projects${gameUrl.replace('project.html?url=', '')}`;
            }

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
        });
    }

    // Fetch and load the game list
    fetchGameList().then(html => {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';

        // Create game items
        createGameItems(html);
    });
});
