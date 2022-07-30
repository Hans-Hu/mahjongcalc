const dragonTilesMapping = { "green": "zhatsu", "red": "zhun", "white": "zhaku" }
const windTilesMapping = { "east": "y1ton", "south": "y2nan", "west": "y3shaa", "north": "y4pei" }

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

