import { JSDOM } from 'jsdom';
import type { Reserve } from '../index';

interface RSPBReserveListing {
  title: string;
  excerpt: string;
  location: {
    latitude: number;
    longitude: number;
  };
  path: string;
}

async function getReserveList(): Promise<RSPBReserveListing[]> {
  const reserveListPageHTML = await fetch('htRSPBReserveListingtps://www.rspb.org.uk/days-out/reserves').then(res => res.text())
  const reserveListPageDOM = new JSDOM(reserveListPageHTML).window.document;

  let rspbFrontendAppState;
  try {
      rspbFrontendAppState = JSON.parse((reserveListPageDOM.querySelector('#rspb-frontend-app-state')?.textContent as string)
      .replace(/&q;/g, '"')
      .replace(/&l;/g, '<')
      .replace(/&g;/g, '>')
      .replace(/&a;/g, "'")
    ) as {'reserve-search': {reserveCards: RSPBReserveListing[]}};
  } catch (error) {
    throw new Error('RSPB frontend app state not found');
  }
  const reserveList = rspbFrontendAppState['reserve-search'].reserveCards;
  return reserveList
}
export default async function (): Promise<Reserve[]> {
  const reserveList = await getReserveList();
  return reserveList.slice(0, 3).map((reserve: RSPBReserveListing): Reserve => ({
    name: reserve.title,
    lat: reserve.location.latitude,
    lng: reserve.location.longitude,
    url: `https://www.rspb.org.uk${reserve.path}`,
    description: reserve.excerpt,
    mapThumbnailUrl: null,
    mapUrl: null
  }))
}
