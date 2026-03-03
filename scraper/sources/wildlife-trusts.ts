import { JSDOM } from 'jsdom';
import type { Reserve } from '../index';
type WildlifeTrustReserveListing = {
  name: string;
  lat: string;
  lng: string;
  uuid: string;
}

type WildlifeTrustReserveDetails = {
  url: string | null | undefined;
  description: string | undefined;
  mapThumbnailUrl: string | null | undefined;
  mapUrl: string | null | undefined;
}

type WildlifeTrustReserve = WildlifeTrustReserveListing & WildlifeTrustReserveDetails;

async function validateReserveUrl(url: string | null | undefined, reserveName: string): Promise<{url: string | null | undefined, html: string | null | undefined}> {

  if (!url) return {url: null, html: null}
  const response = await fetch(url)
  if (/search\?/.test(response.url)) {
    const reserveSearchHTML = await fetch(response.url).then(res => res.text())
    const reserveSearchDOM = new JSDOM(reserveSearchHTML).window.document
    const reserveSearchResults = reserveSearchDOM.querySelectorAll('.node--type-reserve');
    const matchingSearchResult = [...reserveSearchResults].find(result => {
      return result.querySelector('.node__title')?.textContent?.trim().toLowerCase() === reserveName.trim().toLowerCase()
    })
    if (!matchingSearchResult) {
      return {url: null, html: null}
    }
    const potentiallyRelativeUrl = matchingSearchResult?.querySelector('.node__title a')?.getAttribute('href') ?? null
    if (!potentiallyRelativeUrl) {
      return {url: null, html: null}
    }
    let finalUrl = null;
    try {
      // if the url is relative, this will error
      finalUrl = new URL(potentiallyRelativeUrl).href
    } catch (error) {
      finalUrl = new URL(potentiallyRelativeUrl, response.url).href
    }
    const finalHTML = await fetch(finalUrl).then(res => res.text())
    return { url: finalUrl, html: finalHTML }
  } else {
    return { url: response.url, html: await response.text() };
  }

}

function extractMapUrl(html: string | null | undefined): {mapThumbnailUrl: string | null | undefined, mapUrl: string | null | undefined} {
  if (!html) return null
  const mapDOM = new JSDOM(html).window.document
  const mapThumbnailUrl = mapDOM.querySelector('.paragraph--type--image-gallery img[alt$=" map"]')?.getAttribute('data-lazy') ?? null
  const mapUrl = mapThumbnailUrl?.replace('styles/scaled_12_col_desk/', 'styles/gallery_image_default/') ?? null
  return {mapThumbnailUrl, mapUrl}
}

async function getReserveDetails({uuid, name}: WildlifeTrustReserveListing): Promise<WildlifeTrustReserveDetails> {
  const reserveDetailsModalHTML = await fetch(`https://www.wildlifetrusts.org/map-ajax/${uuid}/reserve`).then(res => res.text())
  const reserveDetailsModalDOM = new JSDOM(reserveDetailsModalHTML).window.document;
  const {url, html} = await validateReserveUrl(reserveDetailsModalDOM.querySelector('.node__title a')?.getAttribute('href'), name);
  return {
    url: url,
    description: reserveDetailsModalDOM.querySelector('div[itemprop="description"]')?.textContent,
    ...extractMapUrl(html)
  }
}


async function getReserveList(): Promise<WildlifeTrustReserveListing[]> {
  const reserveListPageHTML = await fetch('https://www.wildlifetrusts.org/nature-reserves').then(res => res.text())
  const reserveListPageDOM = new JSDOM(reserveListPageHTML).window.document
  return [...reserveListPageDOM.querySelectorAll('.map-data__item')].map(el => ({
    name: el.getAttribute('data-title'),
    lat: el.getAttribute('data-lat'),
    lng: el.getAttribute('data-lng'),
    uuid: el.getAttribute('data-uuid')
  } as WildlifeTrustReserveListing))
}

export default async function (): Promise<Reserve[]> {
  const reserveList = await getReserveList();
  const reserves = await Promise.all(reserveList.slice(0, 3).map(async reserveListing => {
    const reserveDetails = await getReserveDetails(reserveListing)
    return { ...reserveListing, ...reserveDetails }
  }))
  return reserves.map(reserve => ({
    name: reserve.name,
    lat: Number(reserve.lat),
    lng: Number(reserve.lng),
    url: reserve.url,
    description: reserve.description,
    mapThumbnailUrl: reserve.mapThumbnailUrl,
    mapUrl: reserve.mapUrl
  }))
}
