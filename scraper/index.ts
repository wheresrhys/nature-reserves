import wildlifeTrusts from './sources/wildlife-trusts'
import rspb from './sources/rspb'
import wwt from './sources/wwt'

export type Reserve = {
  name: string,
  lat: number,
  lng: number,
  url: string | null | undefined,
  description:string | null | undefined,
  mapThumbnailUrl:string | null | undefined,
  mapUrl:string | null | undefined
}

const reserves = (await Promise.all([wwt(), wildlifeTrusts(), rspb()])).flatMap(reserves => reserves)
console.log(reserves)
