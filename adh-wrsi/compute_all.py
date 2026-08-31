import os, re, glob, sys
import numpy as np
import pandas as pd
import xarray as xr

DATA_DIR = 'FLDAS_NOAH01_C_GL_M_001'
LOCS_CSV = 'locations_rows.csv'
OUT_TS   = 'timeseries.csv'
OUT_BLOCKS = 'blocks_monthly.csv'
AFRICA_LAT = (-37, 37)
AFRICA_LON = (-20, 60)

VARS = [
    'Evap_tavg', 'LWdown_f_tavg', 'Lwnet_tavg', 'Psurf_f_tavg',
    'Qair_f_tavg', 'Qg_tavg', 'Qh_tavg', 'Qle_tavg', 'Qs_tavg',
    'Qsb_tavg', 'RadT_tavg', 'Rainf_f_tavg', 'SWE_inst',
    'SWdown_f_tavg', 'SnowCover_inst', 'SnowDepth_inst', 'Snowf_tavg',
    'Swnet_tavg', 'Tair_f_tavg', 'Wind_f_tavg',
    'SoilMoi00_10cm_tavg', 'SoilMoi10_40cm_tavg',
    'SoilMoi40_100cm_tavg', 'SoilMoi100_200cm_tavg',
    'SoilTemp00_10cm_tavg', 'SoilTemp10_40cm_tavg',
    'SoilTemp40_100cm_tavg', 'SoilTemp100_200cm_tavg',
]
ET_VARS = ['Tair_f_tavg','Qair_f_tavg','Psurf_f_tavg','Wind_f_tavg','Swnet_tavg','Lwnet_tavg']

def fao56_eto_vec(T_k, q, P_pa, wind10, swnet, lwnet):
    T = T_k - 273.15
    P = P_pa / 1000.0
    es = 0.6108 * np.exp(17.27 * T / (T + 237.3))
    ea = q * P / 0.622
    delta = 4098 * es / (T + 237.3) ** 2
    gamma = 0.000665 * P
    u2 = wind10 * 4.87 / np.log(67.8 * 10 - 5.42)
    Rn = (swnet + lwnet) * 86400 / 1e6
    et = (0.408 * delta * Rn + gamma * (900 / (T + 273)) * u2 * (es - ea)) / (delta + gamma * (1 + 0.34 * u2))
    return np.maximum(et / 86400, 0)


locs = pd.read_csv(LOCS_CSV)
blocks = []
for _, row in locs.iterrows():
    clat, clon = row['latitude'], row['longitude']
    blocks.append((clat, clon, clat - 0.5, clat + 0.5, clon - 0.5, clon + 0.5))
B = len(blocks)

nc_files = sorted(glob.glob(os.path.join(DATA_DIR, 'FLDAS_NOAH01_C_GL_M.A*.001.nc')))
print(f"Processing {len(nc_files)} files ...")

ts_rows = []
block_rows_chunks = [[] for _ in range(B)]

for file_idx, fp in enumerate(nc_files):
    fname = os.path.basename(fp)
    m = re.search(r'A(\d{4})(\d{2})', fname)
    if not m:
        continue
    date_str = f"{m.group(1)}-{m.group(2)}"
    if file_idx % 20 == 0:
        print(f"[{file_idx+1}/{len(nc_files)}] {date_str}")
    else:
        sys.stdout.write(f"\r{date_str}  ")
        sys.stdout.flush()

    ds = xr.open_dataset(fp, engine='netcdf4')
    ds = ds.rename({'X': 'longitude', 'Y': 'latitude'})
    ds = ds.drop_vars([v for v in ['time_bnds'] if v in ds.variables])
    africa = ds.where(
        (ds.latitude > AFRICA_LAT[0]) & (ds.latitude < AFRICA_LAT[1]) &
        (ds.longitude > AFRICA_LON[0]) & (ds.longitude < AFRICA_LON[1]),
        drop=True
    )

    lats = africa['latitude'].values
    lons = africa['longitude'].values
    nlat, nlon = len(lats), len(lons)

    # Read all variables as 2D arrays once (time dim is 1)
    arrs = {}
    for v in VARS:
        arrs[v] = africa[v].isel(time=0).values  # (nlat, nlon)

    # Africa-wide means
    ts_row = {'date': date_str}
    for v in VARS:
        ts_row[v] = float(np.nanmean(arrs[v]))
    eto_full = fao56_eto_vec(arrs['Tair_f_tavg'], arrs['Qair_f_tavg'],
                              arrs['Psurf_f_tavg'], arrs['Wind_f_tavg'],
                              arrs['Swnet_tavg'], arrs['Lwnet_tavg'])
    ts_row['ETo'] = float(np.nanmean(eto_full))
    with np.errstate(invalid='ignore', divide='ignore'):
        wrsi_full = np.nanmean(arrs['Evap_tavg'] / eto_full * 100)
    ts_row['WRSI'] = float(np.clip(wrsi_full, 0, 100) if np.isfinite(wrsi_full) else 0)
    ts_rows.append(ts_row)

    # Precompute block indices and extract block data
    for bi in range(B):
        clat, clon, lat_min, lat_max, lon_min, lon_max = blocks[bi]
        Yi = np.where((lats >= lat_min) & (lats < lat_max))[0]
        Xi = np.where((lons >= lon_min) & (lons < lon_max))[0]
        r = {'date': date_str, 'latitude': clat, 'longitude': clon}
        if len(Yi) == 0 or len(Xi) == 0:
            for v in VARS:
                r[v] = np.nan
            r['ETo'] = np.nan
            r['WRSI'] = np.nan
        else:
            YY, XX = np.meshgrid(Yi, Xi, indexing='ij')
            for v in VARS:
                r[v] = float(np.nanmean(arrs[v][YY, XX]))
            eto_b = fao56_eto_vec(
                arrs['Tair_f_tavg'][YY, XX], arrs['Qair_f_tavg'][YY, XX],
                arrs['Psurf_f_tavg'][YY, XX], arrs['Wind_f_tavg'][YY, XX],
                arrs['Swnet_tavg'][YY, XX], arrs['Lwnet_tavg'][YY, XX],
            )
            r['ETo'] = float(np.nanmean(eto_b))
            with np.errstate(invalid='ignore', divide='ignore'):
                wrsi_b = np.nanmean(arrs['Evap_tavg'][YY, XX] / eto_b * 100)
            r['WRSI'] = float(np.clip(wrsi_b, 0, 100) if np.isfinite(wrsi_b) else 0)
        block_rows_chunks[bi].append(r)

    ds.close()

print()

ts_df = pd.DataFrame(ts_rows)
ts_df.to_csv(OUT_TS, index=False)
print(f"Saved {OUT_TS} — {len(ts_df)} rows, {len(ts_df.columns)} cols")

# Concatenate block chunks
all_block_rows = []
for chunk in block_rows_chunks:
    all_block_rows.extend(chunk)
block_df_out = pd.DataFrame(all_block_rows)
block_df_out.to_csv(OUT_BLOCKS, index=False)
print(f"Saved {OUT_BLOCKS} — {len(block_df_out)} rows, {len(block_df_out.columns)} cols")
