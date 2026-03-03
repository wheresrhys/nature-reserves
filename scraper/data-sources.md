## Wildlife trusts
https://www.wildlifetrusts.org/nature-reserves - div.map-data

<span class="map-data__item" data-lat="54.912872033501" data-lng="-1.610119342804" data-type="reserve" data-uuid="906d72fe-a7e4-4a24-933f-bfef3be29d19" data-title="Lamesley Pastures" data-date="" data-time="" data-searched-lat-lon="" data-pin-type="">

https://www.wildlifetrusts.org/map-ajax/{uuid}}/reserve fetches reserve details

## RSPB
https://www.rspb.org.uk/days-out/reserves
<script id="rspb-frontend-app-state"
    type="application/json">


Read text contents
Replace
&q; = "
&l; = <
&g; = >
&a; = '

reserve-search.reserveCards[]

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

## WWT
https://www.wwt.org.uk/wetland-centres
window.WWTMapLocations

(or parse "let WWTMapLocations = {JSON}... is all contained on one line)

## Local nature reserves
https://www.data.gov.uk/dataset/acdf4a9e-a115-41fb-bbe9-603c819aa7f7/local-nature-reserves-england1
Needs work

## Woodland trust

https://woodlandtrust.org.uk/visiting-woods/find-woods/

zoomed out map search
https://woodlandtrust.org.uk/api/woodspages/SearchWoodsNearAll?lat=52.96093635696195&lng=-5.718817516402964&distance=1540748


## National nature reserves

https://publications.naturalengland.org.uk/map?category=23001

search for `<script type="text/javascript">
            function initializeMap() {
                var these_markers = [

                        ...
                        `

In the page source. Maybe use an AST to find
