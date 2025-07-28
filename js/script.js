import { challenges } from './challenges.js';


let isMultiplayer = false;
let currentPlayer = 1;
const players = {
  1: { name: "Player 1", color: "#11ff00" },
  2: { name: "Player 2", color: "#dc3545" }
};

function shuffle(array) {
  return array.map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
}

function saveState(selected, source, markedIndices) {
  const selectedBy = [...document.querySelectorAll('.bingo-tile')].map(tile => tile.dataset.selectedBy || null);
  localStorage.setItem('re4_bingo_board', JSON.stringify(selected));
  localStorage.setItem('re4_bingo_source', source);
  localStorage.setItem('re4_bingo_marked', JSON.stringify(markedIndices));
  localStorage.setItem('re4_bingo_selectedBy', JSON.stringify(selectedBy)); // Save selectedBy data
  localStorage.setItem('re4_bingo_multiplayer', JSON.stringify(isMultiplayer));
  localStorage.setItem('re4_bingo_currentPlayer', currentPlayer);
  localStorage.setItem('re4_bingo_players', JSON.stringify(players));
}

function loadState() {
  const selected = JSON.parse(localStorage.getItem('re4_bingo_board') || '[]');
  const source = localStorage.getItem('re4_bingo_source');
  const marked = JSON.parse(localStorage.getItem('re4_bingo_marked') || '[]');
  const selectedBy = JSON.parse(localStorage.getItem('re4_bingo_selectedBy') || '[]'); // Load selectedBy data
  isMultiplayer = JSON.parse(localStorage.getItem('re4_bingo_multiplayer') || 'false');
  currentPlayer = parseInt(localStorage.getItem('re4_bingo_currentPlayer') || '1');
  const savedPlayers = JSON.parse(localStorage.getItem('re4_bingo_players') || '{}');
  if (Object.keys(savedPlayers).length > 0) {
    Object.assign(players, savedPlayers);
  }
  return { selected, source, marked, selectedBy };
}

function toggleMode() {
  isMultiplayer = !isMultiplayer;
  const switchPlayerButton = document.getElementById('switchPlayer');
  if (isMultiplayer) {
    players[1].name = prompt("Enter Player 1 name:", "Player 1") || "Player 1";
    players[2].name = prompt("Enter Player 2 name:", "Player 2") || "Player 2";
    switchPlayerButton.style.display = 'inline-block';
  } else {
    currentPlayer = 1;
    switchPlayerButton.style.display = 'none';
  }
  updateStatus();
}

function updateStatus() {
  const status = document.getElementById('status');
  if (isMultiplayer) {
    status.textContent = `${players[currentPlayer].name}'s Turn`;
    status.style.color = players[currentPlayer].color;
  } else {
    status.textContent = "Solo Mode";
    status.style.color = "#28a745";
  }
}

function generateBoard() {
  const source = document.getElementById('sourceSelect').value;
  const base = [...challenges.Original];
  const pool = source === 'All' ? base.concat(challenges.ChatGPT) : base;
  const selected = shuffle(pool).slice(0, 25);

  renderBoard(selected, source, []);
}

function renderBoard(selected, source, markedIndices, selectedBy = []) {
  const board = document.getElementById('bingoBoard');
  board.innerHTML = '';
  document.getElementById('sourceSelect').value = source;

  selected.forEach((text, i) => {
    const tile = document.createElement('div');
    tile.className = 'bingo-tile';
    tile.innerText = text;
    if (markedIndices.includes(i)) {
      tile.classList.add('marked');
      const player = selectedBy[i];
      if (player) {
        tile.dataset.selectedBy = player;
        tile.style.backgroundColor = players[player].color; // Apply player color
        tile.style.borderColor = players[player].color;
      }
    }

    tile.onclick = () => {
      if (isMultiplayer && tile.dataset.selectedBy && tile.dataset.selectedBy !== currentPlayer.toString()) {
        return; // Prevent overriding another player's selection in multiplayer mode
      }

      tile.classList.toggle('marked');
      if (tile.classList.contains('marked')) {
        tile.dataset.selectedBy = currentPlayer;
        tile.style.backgroundColor = players[currentPlayer].color;
        tile.style.borderColor = players[currentPlayer].color;
      } else {
        tile.dataset.selectedBy = '';
        tile.style.backgroundColor = '';
        tile.style.borderColor = '#444';
      }

      const updatedMarked = [...document.querySelectorAll('.bingo-tile.marked')].map(el => selected.indexOf(el.innerText));
      saveState(selected, source, updatedMarked);
    };

    board.appendChild(tile);
  });

  saveState(selected, source, markedIndices);
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateStatus();
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    if (isMultiplayer) {
      switchPlayer();
    }
  }
});

document.getElementById('toggleMode').addEventListener('click', toggleMode);
document.getElementById('regenerateBoard').addEventListener('click', generateBoard);
document.getElementById('switchPlayer').addEventListener('click', switchPlayer);


window.onload = () => {
  const savedState = loadState();
  if (savedState.selected.length === 25 && savedState.source) {
    renderBoard(savedState.selected, savedState.source, savedState.marked, savedState.selectedBy);
  } else {
    generateBoard();
  }
  updateStatus();

  const switchPlayerButton = document.getElementById('switchPlayer');
  switchPlayerButton.style.display = isMultiplayer ? 'inline-block' : 'none';
};
