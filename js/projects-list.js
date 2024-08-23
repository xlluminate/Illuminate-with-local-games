document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.getElementById('loading');
    const gameList = document.getElementById('game-list');

    function fetchGameList() {
        return fetch('list.html')
            .then(response => response.text())
            .catch(error => {
                console.error('Error fetching game list:', error);
                return '';
            });
    }

    function createGameItems(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const cards = tempDiv.querySelectorAll('.card');

        const mainURL = window.location.origin;

        cards.forEach(card => {
            const link = card.querySelector('a');
            const gameName = link.textContent;

            const gameUrl = link.getAttribute('href').replace('project.html?url=', '');

            let thumbnail;
            let gameLinkNew;

            if (gameUrl.includes('#game=')) {
                const gameParam = new URLSearchParams(gameUrl.split('#')[1]).get('game');
                thumbnail = `${mainURL}/projects/flash/images/${gameParam}.png`;
                gameLinkNew = `/project.html?url=${mainURL}/projects/flash/#game=${gameParam}`;
            } else {
                const gamePath = gameUrl.replace(/index\.htm(l)?$/, 'cover.png');
                thumbnail = `${mainURL}/projects${gamePath}`;
                gameLinkNew = `/project.html?url=${mainURL}/projects${gameUrl}`;
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

    fetchGameList().then(html => {
        loadingIndicator.style.display = 'none';

        createGameItems(html);
    });
});
