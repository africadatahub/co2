# Climate Observer 2

African Climate Observer V2 — an interactive tool from [Africa Data Hub](https://www.africadatahub.org/) for exploring historical temperature, rainfall, air quality, and crop water-stress (WRSI) data for locations across Africa.

## Tech stack

- React 18, bundled with [Parcel 2](https://parceljs.org/)
- Data fetched from [Supabase](https://supabase.com/) (Postgres) tables
- Charts: Recharts, react-vis, reaviz, d3-scale / d3-scale-chromatic
- Maps: Leaflet / react-leaflet
- Styling: Sass (`src/app.scss`) + Bootstrap / react-bootstrap

## Dev installation

Requires [Node.js](https://nodejs.org/) and [Yarn](https://classic.yarnpkg.com/) (this repo is pinned to Yarn 1 via `packageManager` in `package.json`).

1. Install dependencies:

    ```
    yarn
    ```

2. Create a `.env` file in the project root with the Supabase credentials (see [Data source & access](#data-source--access) below):

    ```
    SUPABASE_URL=https://<your-project>.supabase.co
    SUPABASE_KEY=<your-supabase-anon-key>
    ```

3. Start the dev server:

    ```
    yarn dev
    ```

    This runs `parcel src/index.html` and serves the app locally with hot reload.

## Build

```
yarn build
```

This runs `parcel build src/index.html` followed by `post-build-script.js`, which post-processes the built CSS/HTML so the app can be safely embedded on another page (it scopes all CSS rules under a single wrapper class instead of `:root`/`html`/`body`, so the styles don't leak into or clash with the host page). Output is written to `dist/`.

To build with a specific wrapper class (e.g. for a specific embed target) instead of the default (`unique-lpxjij`), pass it as an argument:

```
node post-build-script.js <wrapper-class-name>
```

## Data source & access

All climate data is stored in a **Supabase** Postgres database and queried directly from the browser via `@supabase/supabase-js` (see `src/supabase.js`). The client is initialized with `SUPABASE_URL` and `SUPABASE_KEY` environment variables, which Parcel inlines at build/dev time from a local `.env` file — talk to the Africa Data Hub team for access to the project's Supabase credentials.

The app queries the following Supabase tables, filtered by a ~1° latitude/longitude bounding box around the selected location (see `src/AppProvider.js`):

| Table | Used for |
|---|---|
| `locations` | Reverse geocoding a clicked map position to a city/town/region name and country |
| `climatology` | Historical (baseline) monthly temperature averages |
| `temperature` | Monthly average/max/min temperature time series |
| `precipitation_historical` | Historical (baseline, 1950–1980) monthly rainfall |
| `precipitation` | Monthly rainfall time series |
| `air_quality` | Monthly aerosol optical depth (AOD), used as an air quality proxy |
| `crops` | Monthly Water Requirement Satisfaction Index (WRSI) values |

Underlying source datasets (as credited in-app):

- **Temperature** — [Berkeley Earth](https://berkeleyearth.org/data/)
- **Rainfall (historical baseline)** — [GPCC](https://gpcc.dwd.de/); **rainfall (recent)** — [GloH2O / MSWEP](https://www.gloh2o.org/mswep/)
- **Air quality (AOD)** — [NASA MODIS MYD08_M3](https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MYD08_M3#overview)
- **Crop water stress (WRSI)** — derived from [NASA FLDAS](https://disc.gsfc.nasa.gov/datasets/FLDAS_NOAH01_C_GL_M_001/summary?keywords=FLDAS)

City and country reference data used for search/lookup is bundled locally in `src/data/cities.json` and `src/data/countries.json` (not fetched from Supabase).

Note: all data is modelled/estimated at global scale rather than directly observed at every location, so values for a specific point may be interpolated from nearby measurements.

## Project structure

- `src/index.js` — app entry point, mounts `AppProvider` + `Co2`
- `src/AppProvider.js` / `src/AppContext.js` — central state and data-fetching layer (Supabase queries, filtering, CSV/PNG export)
- `src/Co2.js` — main page layout and content
- `src/AQ*.js`, `src/TEMP*.js`, `src/PRECIP*.js`, `src/CropYield.js` — charts/tables for air quality, temperature, precipitation, and crop water stress respectively
- `src/AQMap.js`, `src/LeafletGrid.js` — map components
- `src/LocationBar.js`, `src/LocationInfoPanel.js`, `src/Navigator.js` — location search/selection UI
- `src/data/` — bundled reference data (cities, countries) and static map imagery
- `post-build-script.js` — post-build CSS/HTML scoping step for embeddable output

## URL parameters

The app reads state from the query string on load:

- `?city=<slug>` — load a specific city (slug is the city name, lowercase, spaces replaced with `-`)
- `?position=<lat>,<lon>` — load a specific coordinate (reverse-geocoded via the `locations` table)
- `&daterange=<start>,<end>` — set the initial year range (defaults to `1993,2026`)

If no `city` or `position` is given, a random city is selected on load.
