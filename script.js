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

function generateBoard() {
  const board = document.getElementById('bingoBoard');
  const source = document.getElementById('sourceSelect').value;
  const base = [...challenges.Original];
  const pool = source === 'All' ? base.concat(challenges.ChatGPT) : base;
  const selected = shuffle(pool).slice(0, 25);

  board.innerHTML = '';
  selected.forEach((text, i) => {
    const tile = document.createElement('div');
    tile.className = 'bingo-tile';
    tile.innerText = `${i + 1}. ${text}`;
    tile.onclick = () => tile.classList.toggle('marked');
    board.appendChild(tile);
  });
}

window.onload = generateBoard;
