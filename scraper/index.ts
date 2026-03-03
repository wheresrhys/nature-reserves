import wildlifeTrusts from './sources/wildlife-trusts'
import rspb from './sources/rspb'

type Reserve = {
  name: string,
  lat: string,
  lng: string,
  url: string,
  description: string,
  mapThumbnailUrl: string,
  mapUrl: string
}

const reserves = (await Promise.all([wildlifeTrusts(), rspb()])).flatMap(reserves => reserves)
console.log(reserves)
