
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
    "Get Attacked by a Chicken"
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

function shuffle(array) {
  return array.map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
}

function saveState(selected, source, markedIndices) {
  localStorage.setItem('re4_bingo_board', JSON.stringify(selected));
  localStorage.setItem('re4_bingo_source', source);
  localStorage.setItem('re4_bingo_marked', JSON.stringify(markedIndices));
}

function loadState() {
  const selected = JSON.parse(localStorage.getItem('re4_bingo_board') || '[]');
  const source = localStorage.getItem('re4_bingo_source');
  const marked = JSON.parse(localStorage.getItem('re4_bingo_marked') || '[]');
  return { selected, source, marked };
}

function generateBoard() {
  const board = document.getElementById('bingoBoard');
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

  selected.forEach((text, i) => {
    const tile = document.createElement('div');
    tile.className = 'bingo-tile';
    tile.innerText = `${i + 1}. ${text}`;
    if (markedIndices.includes(i)) tile.classList.add('marked');

    tile.onclick = () => {
      tile.classList.toggle('marked');
      const updatedMarked = [...document.querySelectorAll('.bingo-tile.marked')]
        .map(el => parseInt(el.innerText.split('.')[0]) - 1);
      saveState(selected, source, updatedMarked);
    };

    board.appendChild(tile);
  });

  saveState(selected, source, markedIndices);
}

window.onload = () => {
  const { selected, source, marked } = loadState();
  if (selected.length === 25 && source) {
    renderBoard(selected, source, marked);
  } else {
    generateBoard();
  }
};
