const challenges = {
  Original: [
    "Enemy Kills Themself on Tripwire",
    "Kill a Boss Knife-Only",
    "Grab the Free SQBR",
    "Kill Saddler Without a Rocket",
    "Get S rank with Ada (Mercs)",
    "Do Knight Room Without Flashes (Leon)",
    "Complete 3 Merchant Requests",
    "Kill 3 Enemies with 1 Flash",
    "Get S rank with Luis (Mercs)",
    "Kill 3 Rats with a Knife",
    "Kill the Verdugo (Leon)",
    "Buy an Exclusive Upgrade",
    "Kill Ashley",
    "Complete 5 Merchant Requests",
    "Complete an Entire Chapter Without Reloading (Not Ashley)",
    "Kill an Enemy with a Harpoon (Not DelLago)",
    "Throw a Golden Egg at Ashley",
    "Kill a Boss with only the Bolt-Thrower",
    "Complete an Entire Chapter Without Picking Anything Up (Not Ashley – Excludes Key Items)",
    "Get S rank with Leon (Mercs)",
    "Destroy 10 Medallions",
    "Craft a Full Crown (5 Colors)",
    "Avoid Killing Medieval Gigante",
    "Kill the Savage Mutt",
    "Get Attacked by a Chicken",
    "Have 200,000 ptas at one time",
    "Sell 3 different weapons",
    "Capture the Lunker Bass",
    // "Capture the Lord of the Waterway",
    "Never use a key",
    "Craft a Full Necklace",
    "Watch any cutscene",
    "Die to Chainsaw Guy",
    "Get hit by a pig",
    "Get hit by cow",
    "Never use yellow herb in village",
    "Kill Regenerator without Bioscope",
    "Break 5 windows",
    "Own 30 spinels at one time",
    "Don't use rocket launcher in castle"
  ],
  ChatGPT: [
    "Kill 2 Enemies with One Grenade",
    "Parry a Chainsaw Attack",
    "Trade with the Merchant 5 Times in One Chapter",
    "Kill 5 Enemies Using Proximity Mines",
    "Complete a Chapter Without Using Healing Items",
    "Save the Merchant from an Enemy Attack",
    "Shoot a Snake Before It Bites",
    "Get a S+ Rank in a Shooting Gallery Challenge",
    "Sell 3 Treasures with Triple Bonuses",
    "Kill a Regenerador Using Only the Bolt Thrower",
    "Kill an Enemy While Hanging on a Ledge",
    "Kill an Enemy with a Cannon",
    "Catch a Fish and Eat It",
    "Kill a Zealot With Their Own Catapult",
    "Disarm a Bear Trap Without Stepping In It",
    "Craft Bolts and Use Them in the Same Chapter",
    "Use a Flashbang to Kill a Plagas Mutant",
    "Kill an Enemy With a Barrel Explosion",
    "Kill an Armored Enemy With a Headshot",
    "Open Every Locked Drawer in One Playthrough",
    "Shoot the Merchant’s Bell",
    "Kill 10 Enemies Without Reloading",
    "Interrupt a Cultist Chant with a Gunshot",
    "Trade Spinels for a Map",
    "Jump Down Onto an Enemy and Kill Them Mid-Stagger"
  ]
};

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
  localStorage.setItem('re4_bingo_selectedBy', JSON.stringify(selectedBy));
  localStorage.setItem('re4_bingo_multiplayer', JSON.stringify(isMultiplayer));
  localStorage.setItem('re4_bingo_currentPlayer', currentPlayer);
  localStorage.setItem('re4_bingo_players', JSON.stringify(players));
}

function loadState() {
  const selected = JSON.parse(localStorage.getItem('re4_bingo_board') || '[]');
  const source = localStorage.getItem('re4_bingo_source');
  const marked = JSON.parse(localStorage.getItem('re4_bingo_marked') || '[]');
  isMultiplayer = JSON.parse(localStorage.getItem('re4_bingo_multiplayer') || 'false');
  currentPlayer = parseInt(localStorage.getItem('re4_bingo_currentPlayer') || '1');
  const savedPlayers = JSON.parse(localStorage.getItem('re4_bingo_players') || '{}');
  if (Object.keys(savedPlayers).length > 0) {
    Object.assign(players, savedPlayers);
  }
  return { selected, source, marked };
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

function renderBoard(selected, source, markedIndices) {
  const board = document.getElementById('bingoBoard');
  board.innerHTML = '';
  document.getElementById('sourceSelect').value = source;

  const selectedBy = JSON.parse(localStorage.getItem('re4_bingo_selectedBy') || '[]');

  selected.forEach((text, i) => {
    const tile = document.createElement('div');
    tile.className = 'bingo-tile';
    tile.innerText = `${i + 1}. ${text}`;
    if (markedIndices.includes(i)) {
      tile.classList.add('marked');
      const player = selectedBy[i];
      if (player) {
        tile.dataset.selectedBy = player;
        tile.style.backgroundColor = players[player].color;
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

  const updatedMarked = [...document.querySelectorAll('.bingo-tile.marked')]
    .map(el => parseInt(el.innerText.split('.')[0]) - 1);
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
    renderBoard(savedState.selected, savedState.source, savedState.marked);
  } else {
    generateBoard();
  }
  updateStatus();

  const switchPlayerButton = document.getElementById('switchPlayer');
  switchPlayerButton.style.display = isMultiplayer ? 'inline-block' : 'none';
};
