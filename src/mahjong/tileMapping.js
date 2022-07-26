export const suits = ["man", "pin", "sou", "honor"];
const suitMapping = ["m", "p", "s", "z"];
const windTilesMapping = [
  ["east", "ton"],
  ["south", "nan"],
  ["west", "shaa"],
  ["north", "pei"]
]
const dragonTilesMapping = [
  ["white", "haku"],
  ["green", "hatsu"],
  ["red", "chun"]
]

export const getSuitTile = (suit, number) => (
  {
    src: `/tiles/${suit}${number}.svg`,
    alt: `${number} ${suit}`
  }
)

export const getTile = (suitIndex, number) => (
  suitIndex === 3 ? getHonorTile(number) : getSuitTile(suits[suitIndex], number)
)

export const getHonorTile = (number) => {
  if (number <= 4) {
    return { src: `/tiles/${windTilesMapping[number - 1][1]}.svg`, alt: `${windTilesMapping[number - 1][0]} wind` }
  } else {
    return { src: `/tiles/${dragonTilesMapping[number - 5][1]}.svg`, alt: `${dragonTilesMapping[number - 5][0]} dragon` }
  }
}

const getNextTileNumber = (suitIndex, number) => {
  if (suitIndex < 3) {
    return number === 9 ? 1 : number + 1;
  } else if (number <= 4) {
    return number === 4 ? 1 : number + 1;
  } else {
    return number === 7 ? 5 : number + 1
  }
}

export const handToRiichiString = (riichi, seatWind, roundWind, doraIndicators, hand, calledTiles, winningTile, winningType) => {
  let handString = "";
  hand.forEach(tile => handString += `${tile.number}${suitMapping[tile.suitIndex]}`);
  handString += `${winningType === "ron" ? "+" : ""}${winningTile.number}${suitMapping[winningTile.suitIndex]}`;
  calledTiles.forEach(tileSet => {
    if (tileSet.length === 4 && tileSet[0].showBack)
      handString += "+" + `${tileSet[0].number}${suitMapping[tileSet[0].suitIndex]}`.repeat(2);
    else {
      handString += "+";
      tileSet.forEach(tile => handString += `${tile.number}${suitMapping[tile.suitIndex]}`);
    }
  })
  handString += "+d"
  doraIndicators.forEach(tile => handString += `${getNextTileNumber(tile.suitIndex, tile.number)}${suitMapping[tile.suitIndex]}`);
  handString += `+${riichi > 0 ? riichi === 2 ? "w" : "r" : ""}`;
  handString += `${roundWind.number}${seatWind.number}`;
  return handString;
}
