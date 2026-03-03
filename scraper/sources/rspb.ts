import { JSDOM } from 'jsdom';
import type { Reserve } from '../index';

/*
## RSPB
https://www.rspb.org.uk/days-out/reserves
<script id="rspb-frontend-app-state"
type = "application/json" >


  Read text contents
Replace

reserve - search.reserveCards[]

  ```json
{
  "id": "ed266a3d-ac03-4990-9dfa-a70d8d2c73d0",
  "title": "Fetlar ",
  "excerpt": "This Shetland island is a sanctuary for seabirds, waders, otters and the rare Red-necked Phalarope. ",
  "path": "/days-out/reserves/fetlar",
  "categories": [],
  "location": {
    "latitude": 60.5881,
    "longitude": -0.80961,
    "address": {
      "addressLine1": "Fetlar",
      "addressLine2": null,
      "addressLine3": null,
      "postcode": "ZE2 9DJ"
    },
    "gridReference": "HU65318999",
    "easting": "442800",
    "northing": "1160900",
    "what3words": "thinnest.summit.readily",
    "nearTo": "Between Aith and Funzie"
  },
  "facilities": []
}
```
*/

async function getReserveList(): Promise<Reserve[]> {
  const reserveListPageHTML = await fetch('https://www.rspb.org.uk/days-out/reserves').then(res => res.text())
  const reserveListPageDOM = new JSDOM(reserveListPageHTML).window.document;

  let rspbFrontendAppState;
  try {
      rspbFrontendAppState = JSON.parse(reserveListPageDOM.querySelector('#rspb-frontend-app-state')?.textContent
      .replace(/&q;/g, '"')
      .replace(/&l;/g, '<')
      .replace(/&g;/g, '>')
      .replace(/&a;/g, "'")
    );
  } catch (error) {
    throw new Error('RSPB frontend app state not found');
  }
  const reserveList = rspbFrontendAppState['reserve-search'].reserveCards;
  return reserveList


}
export default async function (): Promise<Reserve[]> {
  const reserveList = await getReserveList();
  console.log(reserveList[0])
  return reserveList.slice(0, 3).map(reserve => ({
    name: reserve.title,
    lat: reserve.location.latitude,
    lng: reserve.location.longitude,
    url: `https://www.rspb.org.uk${reserve.path}`,
    description: reserve.excerpt,
    mapThumbnailUrl: null,
    mapUrl: null
  }))
}
