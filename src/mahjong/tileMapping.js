const dragonTilesMapping = { "green": "hatsu", "red": "chun", "white": "haku" }
const windTilesMapping = { "east": "ton", "south": "nan", "west": "shaa", "north": "pei" }
export const suits = ["man", "pin", "sou"];
export const honors = ["east", "south", "west", "north", "white", "green", "red"];

export const getSuitTiles = (suit, number, dora = false) => (
  {
    src: `/tiles/${suit}${number}${dora ? '-dora' : ''}.svg`,
    alt: `${dora ? 'aka ' : ''}${number} ${suit}`
  }
)

export const getHonorTiles = (tile) => {
  if (tile[0] === 'g' || tile[0] === 'r' || tile[1] === 'h') {
    return { src: `/tiles/${dragonTilesMapping[tile]}.svg`, alt: `${tile} dragon` }
  } else {
    return { src: `/tiles/${windTilesMapping[tile]}.svg`, alt: `${tile} wind` }
  }
}

