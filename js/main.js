let digimon = 0;
let lifePlayer = 3;
let starPoint = 0;

async function sortearDigimon() {
    let digimonSorteado = 0;

    while (digimonSorteado === 0) {
        digimonSorteado = Math.floor(Math.random() * 1460) + 1;
    }

    if (digimonSorteado > 1460) {
        digimonSorteado = 1460;
    }

    const url = `https://digi-api.com/api/v1/digimon/${digimonSorteado}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro ao acessar a API: ${response.status}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Erro ao obter dados do Digimon:', error);
        return null;
    }
}

function startAnimation() {
    startGame();
    // Exibe a mensagem
    document.querySelector('.mensagem').style.display = 'flex'; 

    // Oculta a background
    document.querySelector('.background').style.display = 'none';

    document.querySelector('.container--MensagemDoAgumonHakasePerda').style.display = 'none'; 
    document.querySelector('.container--MensagemDoAgumonHakaseVitoria').style.display = 'none';

    const botaoConfirm = document.getElementById('botao--confirm');
    botaoConfirm.disabled = false;
}

function playGame() {
    const containerText = document.getElementById('containerText');
    
    containerText.innerHTML = '';
    

    sortearDigimon().then(digimonData => {
        if (digimonData) {
            let imgElement = document.getElementById('digimonImage');
            imgElement.src = digimonData.images[0].href;
            imgElement.title = digimonData.name;
            imgElement.alt = digimonData.name;

            let nomeDigimon = digimonData.name.toLowerCase().replace(/\s/g, '');
            let monIndex = nomeDigimon.indexOf('mon');

            if (monIndex !== -1) {
                nomeDigimon = nomeDigimon.slice(0, monIndex + 3);
            }

            // Mantém a variável global 'digimon' intacta
            digimon = nomeDigimon;

            let firstInput = document.createElement('input');
            firstInput.type = 'text';
            firstInput.maxLength = 1;
            firstInput.value = nomeDigimon.charAt(0);
            firstInput.disabled = true;
            firstInput.classList.add('texto');
            containerText.appendChild(firstInput);

            if (nomeDigimon.length > 5) {
                for (let i = 1; i < nomeDigimon.length - 3; i++) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.placeholder = '_';
                    input.classList.add('texto');
                    containerText.appendChild(input);
                }
            }

            if (nomeDigimon.length > 10) {
                let inputIndexes = [];
                while (inputIndexes.length < 2) {
                    let randomIndex = Math.floor(Math.random() * (nomeDigimon.length - 3));
                    if (!inputIndexes.includes(randomIndex)) {
                        inputIndexes.push(randomIndex);
                    }
                }

                inputIndexes.forEach(index => {
                    const input = containerText.querySelectorAll('input')[index];
                    input.value = nomeDigimon.charAt(index);
                });
            }

            for (let i = 0; i < 3; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.classList.add('texto');
                input.value = nomeDigimon.charAt(nomeDigimon.length - 3 + i);
                input.disabled = true;
                input.classList.add('texto');
                containerText.appendChild(input);
            }

            let levelDigimon = document.getElementById("level--digimon");
            levelDigimon.textContent = `Level:\n${digimonData.levels[0].level}`;

            let attributeDigimon = document.getElementById("attribute--digimon");
            attributeDigimon.textContent = `Attribute:\n${digimonData.attributes[0].attribute}`;

            let typeDigimon = document.getElementById("type--digimon");
            typeDigimon.textContent = `Type:\n${digimonData.types[0].type}`;
        }
    });
}

function mensagemScore(score, lives) {
    const botaoConfirm = document.getElementById('botao--confirm');
    botaoConfirm.disabled = true;

    if (lives === 0) {
        if (score < 6) {
            document.querySelector('.background').style.display = 'flex';
            document.querySelector('.container--MensagemDoAgumonHakase').style.display = 'none'; 
            document.querySelector('.container--MensagemDoAgumonHakaseVitoria').style.display = 'none'; 
            document.querySelector('.container--MensagemDoAgumonHakasePerda').style.display = 'flex'; 
        } else {
            document.querySelector('.background').style.display = 'flex';
            document.querySelector('.container--MensagemDoAgumonHakase').style.display = 'none'; 
            document.querySelector('.container--MensagemDoAgumonHakasePerda').style.display = 'none'; 
            document.querySelector('.container--MensagemDoAgumonHakaseVitoria').style.display = 'flex'; 
        }
    }
    
}

function scoreGame() {
    let digimonInput = '';

    const inputs = document.querySelectorAll('#containerText input');
    inputs.forEach(input => {
        digimonInput += input.value;
    });

    digimonInput = digimonInput.toLowerCase();

    if (digimonInput === digimon) {
        playGame();
        starPoint = starPoint + 1;

        let spanScorePlayer = document.getElementById("span--ScorePlayer");
        if (spanScorePlayer) {
            spanScorePlayer.textContent = ` : ${starPoint > 6 ? 6 : starPoint}`;
        }

        let spanLifePlayer = document.getElementById("span--LifePlayer");
        if (spanLifePlayer) {
            spanLifePlayer.textContent = ` : ${lifePlayer}`;
        }

    } else {
        lifePlayer = lifePlayer - 1;

        let spanLifePlayer = document.getElementById("span--LifePlayer");
        if (spanLifePlayer) {
            spanLifePlayer.textContent = ` : ${lifePlayer}`;
        }

        if (lifePlayer <= 0) {
            if (spanLifePlayer) {
                spanLifePlayer.textContent = ` : 0`;
            }
        }
    }

    mensagemScore(starPoint,lifePlayer)

    const botaoConfirm = document.getElementById('botao--confirm');
    botaoConfirm.disabled = false;
}

function startGame() {
    if (localStorage.getItem('firstLoad') === null) {
        localStorage.setItem('firstLoad', 'done');
    } else {
        lifePlayer = 6;
        starPoint = 0;

        let spanLifePlayer = document.getElementById("span--LifePlayer");
        if (spanLifePlayer) {
            spanLifePlayer.textContent = ` : ${lifePlayer}`;
        } 

        let spanScorePlayer = document.getElementById("span--ScorePlayer");
        if (spanScorePlayer) {
            spanScorePlayer.textContent = ` : ${starPoint}`;
        }
    }

    playGame();
}

document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const background = document.querySelector('.background');
        const displayValue = window.getComputedStyle(background).getPropertyValue('display');

        if (displayValue === 'none') {
            scoreGame();
            background.display = "flex";
        } else {
            startAnimation();
        }

    }
});


// Adicionando evento de clique ao botão
document.getElementById("botao--confirm").addEventListener("click", scoreGame);

// Chama a função startGame quando a página é carregada
window.onload = startGame;
