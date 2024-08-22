document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');
    const loadingIndicator = document.getElementById('loading');
    
    // Ensure gamedomain cookie is set
    var gamedomain = getCookie('gamedomain');
    if (!gamedomain) {
        gamedomain = "yourdefaultdomain.com";
        setCookie('gamedomain', gamedomain, 365);
    }

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
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const cards = tempDiv.querySelectorAll('.card');

        cards.forEach(card => {
            const link = card.querySelector('a');
            const gameName = link.textContent.trim();
            const gameUrl = link.getAttribute('href');
            
            let newUrl;
            let thumbnail;

            if (gameUrl.includes('#game=')) {
                // Flash game
                const gameParam = gameUrl.split('#game=')[1];
                newUrl = `${gamedomain}/projects/flash/#game=${gameParam}`;
                thumbnail = `${gamedomain}/projects/flash/images/${gameParam}.png`;
            } else {
                // Normal game
                newUrl = gameUrl.replace('/project.html?url=', `${gamedomain}/projects`);
                thumbnail = newUrl.replace(/index\.html?$/, 'cover.png');
            }

            link.setAttribute('href', newUrl);

            const gameItem = document.createElement('div');
            gameItem.classList.add('game-item');

            const gameImage = document.createElement('img');
            gameImage.src = thumbnail;
            gameImage.alt = gameName;

            const gameTitle = document.createElement('h3');
            gameTitle.textContent = gameName;

            link.appendChild(gameImage);
            link.appendChild(gameTitle);

            gameItem.appendChild(link);
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
