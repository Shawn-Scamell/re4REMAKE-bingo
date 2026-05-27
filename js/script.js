import { challenges } from './challenges.js';

let isMultiplayer = false;
let currentPlayer = 1;
const players = {
  1: { name: 'Player 1', color: '#11ff00' },
  2: { name: 'Player 2', color: '#dc3545' },
};

const WINNING_LINES = [
  [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
  [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
  [0,6,12,18,24], [4,8,12,16,20],
];

function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function saveState(selected, source, markedIndices) {
  const tiles = [...document.querySelectorAll('.bingo-tile')];
  const selectedBy = tiles.map(t => t.dataset.selectedBy || null);
  localStorage.setItem('re4_bingo_board', JSON.stringify(selected));
  localStorage.setItem('re4_bingo_source', source);
  localStorage.setItem('re4_bingo_marked', JSON.stringify(markedIndices));
  localStorage.setItem('re4_bingo_selectedBy', JSON.stringify(selectedBy));
  localStorage.setItem('re4_bingo_multiplayer', JSON.stringify(isMultiplayer));
  localStorage.setItem('re4_bingo_currentPlayer', currentPlayer);
  localStorage.setItem('re4_bingo_players', JSON.stringify(players));
}

function loadState() {
  const selected = JSON.parse(localStorage.getItem('re4_bingo_board') || '[]');
  const source = localStorage.getItem('re4_bingo_source');
  const marked = JSON.parse(localStorage.getItem('re4_bingo_marked') || '[]');
  const selectedBy = JSON.parse(localStorage.getItem('re4_bingo_selectedBy') || '[]');
  isMultiplayer = JSON.parse(localStorage.getItem('re4_bingo_multiplayer') || 'false');
  currentPlayer = parseInt(localStorage.getItem('re4_bingo_currentPlayer') || '1');
  const savedPlayers = JSON.parse(localStorage.getItem('re4_bingo_players') || '{}');
  if (Object.keys(savedPlayers).length > 0) Object.assign(players, savedPlayers);
  return { selected, source, marked, selectedBy };
}

function updateStatus() {
  const status = document.getElementById('status');
  if (isMultiplayer) {
    status.textContent = `${players[currentPlayer].name}'s Turn`;
    status.style.color = players[currentPlayer].color;
  } else {
    status.textContent = 'Solo Mode';
    status.style.color = '#28a745';
  }
}

function syncPlayerNameInputs() {
  document.getElementById('player1Name').value = players[1].name;
  document.getElementById('player2Name').value = players[2].name;
}

function toggleMode() {
  isMultiplayer = !isMultiplayer;
  const switchPlayerBtn = document.getElementById('switchPlayer');
  const playerNamesDiv = document.getElementById('playerNames');

  if (isMultiplayer) {
    syncPlayerNameInputs();
    playerNamesDiv.classList.remove('hidden');
    switchPlayerBtn.classList.remove('hidden');
  } else {
    currentPlayer = 1;
    playerNamesDiv.classList.add('hidden');
    switchPlayerBtn.classList.add('hidden');
    clearWinBanner();
  }
  updateStatus();
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateStatus();
}

function checkWin() {
  const tiles = [...document.querySelectorAll('.bingo-tile')];
  for (const line of WINNING_LINES) {
    if (isMultiplayer) {
      for (const p of [1, 2]) {
        if (line.every(i => tiles[i].dataset.selectedBy === String(p))) {
          return { winner: p, line };
        }
      }
    } else {
      if (line.every(i => tiles[i].classList.contains('marked'))) {
        return { winner: 'solo', line };
      }
    }
  }
  return null;
}

function clearWinBanner() {
  const banner = document.getElementById('winBanner');
  banner.classList.add('hidden');
  document.querySelectorAll('.bingo-tile.bingo-line').forEach(t => t.classList.remove('bingo-line'));
}

function announceWin(result) {
  const tiles = [...document.querySelectorAll('.bingo-tile')];
  result.line.forEach(i => tiles[i].classList.add('bingo-line'));

  const banner = document.getElementById('winBanner');
  banner.textContent = result.winner === 'solo'
    ? 'Bingo!'
    : `${players[result.winner].name} got Bingo!`;
  banner.classList.remove('hidden');
}

function generateBoard() {
  const source = document.getElementById('sourceSelect').value;
  const base = [...challenges.Original];
  const pool = source === 'All' ? base.concat(challenges.ChatGPT) : base;
  const selected = shuffle(pool).slice(0, 25);
  clearWinBanner();
  renderBoard(selected, source, []);
}

function renderBoard(selected, source, markedIndices, selectedBy = []) {
  const board = document.getElementById('bingoBoard');
  board.innerHTML = '';
  document.getElementById('sourceSelect').value = source;

  selected.forEach((text, i) => {
    const tile = document.createElement('div');
    tile.className = 'bingo-tile';
    tile.textContent = text;
    tile.dataset.index = i;

    if (markedIndices.includes(i)) {
      tile.classList.add('marked');
      const player = selectedBy[i];
      if (player) {
        tile.dataset.selectedBy = player;
        tile.style.backgroundColor = players[player].color;
        tile.style.borderColor = players[player].color;
        if (player === '1') tile.style.color = '#000';
      }
    }

    tile.addEventListener('click', () => {
      if (isMultiplayer && tile.dataset.selectedBy && tile.dataset.selectedBy !== String(currentPlayer)) {
        return;
      }

      clearWinBanner();
      tile.classList.toggle('marked');

      if (tile.classList.contains('marked')) {
        tile.dataset.selectedBy = currentPlayer;
        tile.style.backgroundColor = players[currentPlayer].color;
        tile.style.borderColor = players[currentPlayer].color;
        tile.style.color = currentPlayer === 1 ? '#000' : '#fff';
      } else {
        delete tile.dataset.selectedBy;
        tile.style.backgroundColor = '';
        tile.style.borderColor = '';
        tile.style.color = '';
      }

      const marked = [...document.querySelectorAll('.bingo-tile.marked')]
        .map(el => parseInt(el.dataset.index));
      saveState(selected, source, marked);

      const win = checkWin();
      if (win) announceWin(win);
    });

    board.appendChild(tile);
  });

  saveState(selected, source, markedIndices);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && isMultiplayer) {
    e.preventDefault();
    switchPlayer();
  }
});

document.getElementById('toggleMode').addEventListener('click', toggleMode);
document.getElementById('regenerateBoard').addEventListener('click', generateBoard);
document.getElementById('switchPlayer').addEventListener('click', switchPlayer);

document.getElementById('applyNames').addEventListener('click', () => {
  players[1].name = document.getElementById('player1Name').value.trim() || 'Player 1';
  players[2].name = document.getElementById('player2Name').value.trim() || 'Player 2';
  updateStatus();
});

window.addEventListener('load', () => {
  const saved = loadState();
  if (saved.selected.length === 25 && saved.source) {
    renderBoard(saved.selected, saved.source, saved.marked, saved.selectedBy);
  } else {
    generateBoard();
  }

  const switchPlayerBtn = document.getElementById('switchPlayer');
  const playerNamesDiv = document.getElementById('playerNames');

  if (isMultiplayer) {
    syncPlayerNameInputs();
    switchPlayerBtn.classList.remove('hidden');
    playerNamesDiv.classList.remove('hidden');
  }

  updateStatus();
});
