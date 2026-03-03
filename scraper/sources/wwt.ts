import type { Reserve } from '../index';

type WWTReserveListing = {
  name: string;
  latitude: number;
  longitude: number;
  url: string;
}
async function getReserveList(): Promise<Reserve[]> {
  const reserveListPageHTML = await fetch('https://www.wwt.org.uk/wetland-centres').then(res => res.text())
  let wwtReserves: WWTReserveListing[] | undefined;
  reserveListPageHTML.split('\n').find(line => {
    if (line.includes('WWTMapLocations =')) {

      wwtReserves = JSON.parse(
        line
          .replace(/.*WWTMapLocations \= '/, '')
          .replace(/';\s*$/, '')
      ) as WWTReserveListing[];
      return true;
    }
  });

  if (!wwtReserves) return [];

  return wwtReserves.slice(0, 3).map((reserve: WWTReserveListing): Reserve => ({
    name: reserve.name,
    lat: reserve.latitude,
    lng: reserve.longitude,
    url: reserve.url,
    description: null,
    mapThumbnailUrl: null,
    mapUrl: null
  }));
}
export default async function (): Promise<Reserve[]> {
  return await getReserveList();
}
