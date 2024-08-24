document.addEventListener('DOMContentLoaded', () => {
    const mainURL = window.location.origin;
    const gameList = document.getElementById('game-list');
    const loadingIndicator = document.getElementById('loading');

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

        cards.forEach(card => {
            const link = card.querySelector('a');
            const gameName = link.textContent.trim();
            let gameUrl = link.getAttribute('href');
            
            console.log('Original href:', gameUrl);

            gameUrl = gameUrl.replace('project.html?url=', '');

            console.log('Cleaned URL:', gameUrl);

            let thumbnail;
            if (gameUrl.includes('#game=')) {
                const gameParam = gameUrl.split('#game=')[1];
                thumbnail = `${mainURL}/projects/flash/images/${gameParam}.png`;
            } else {
                thumbnail = `${mainURL}/projects${gameUrl.replace(/index\.htm(l)?$/, 'cover.png')}`;
            }

            const gameLinkNew = `/project.html?url=${mainURL}/projects${gameUrl}`;

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
