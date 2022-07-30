export const suits = ["man", "pin", "sou", "honor"];
const windTilesMapping = [
  ["east", "ton"],
  ["south", "nan"],
  ["west", "shaa"],
  ["north", "pei"]
]
const dragonTilesMapping = [
  ["green", "hatsu"],
  ["red", "chun"],
  ["white", "haku"]
]

export const getSuitTile = (suit, number, dora = false) => (
  {
    src: `/tiles/${suit}${number}${dora ? '-dora' : ''}.svg`,
    alt: `${dora ? 'aka ' : ''}${number} ${suit}`
  }
)

export const getTile = (suit, number, dora = false) => (
  suit === "honor" ? getHonorTile(number) : getSuitTile(suit, number, dora)
)

export const getHonorTile = (number) => {
  if (number < 4) {
    return { src: `/tiles/${windTilesMapping[number][1]}.svg`, alt: `${windTilesMapping[number][0]} wind` }
  } else {
    return { src: `/tiles/${dragonTilesMapping[number - 4][1]}.svg`, alt: `${dragonTilesMapping[number - 4][0]} dragon` }
  }
}

