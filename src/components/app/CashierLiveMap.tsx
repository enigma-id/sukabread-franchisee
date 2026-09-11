/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type {
  Feature as GeoJSONFeatureType,
  Point as GeoJSONPoint,
} from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import type { CashierMapHistory, CashierMapRow } from "@/services/types";
import {
  DEVICE_STATUS_COLOR,
  DEVICE_STATUS_LABEL,
  currencyFormat,
  deviceStatusColor,
  deviceStatusLabel,
} from "@/utils";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

const validHistory = (row?: CashierMapRow): CashierMapHistory[] =>
  (row?.historys ?? []).filter(
    (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
  );

/** Titik history terakhir yang valid — posisi device terkini operator. */
const lastPoint = (row: CashierMapRow): CashierMapHistory | null => {
  const points = validHistory(row);
  return points.length > 0 ? points[points.length - 1] : null;
};

const escapeHtml = (value: unknown) =>
  String(value ?? "-").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });

interface CashierMarker {
  row: CashierMapRow;
  point: CashierMapHistory;
}

const buildPopupHtml = ({ row, point }: CashierMarker) => {
  const color = deviceStatusColor(row.status);

  return `
  <div style="padding: 14px 16px; font-family: 'Inter', sans-serif; min-width: 200px;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-right: 24px;">
      <div style="font-size: 14px; font-weight: 800; color: #111827; white-space: nowrap;">${escapeHtml(
        row.cashier_name,
      )}</div>
      <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${color}; background: ${color}18; padding: 2px 6px; border-radius: 6px; white-space: nowrap;">
        ${escapeHtml(row.role || "-")}
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
      <span style="width: 7px; height: 7px; border-radius: 50%; background: ${color}; box-shadow: 0 0 0 3px ${color}22;"></span>
      <span style="font-size: 11px; font-weight: 700; color: ${color}; text-transform: uppercase;">
        ${escapeHtml(deviceStatusLabel(row.status))}
      </span>
      ${
        row.last_seen
          ? `<span style="font-size: 10px; color: #9ca3af; margin-left: auto;">${escapeHtml(row.last_seen)}</span>`
          : ""
      }
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: #4b5563;">
      <div style="display: flex; justify-content: space-between; gap: 12px;">
        <span style="color: #9ca3af;">Battery</span>
        <span style="font-weight: 700; color: #1f2937;">${escapeHtml(row.battery_health || "-")}</span>
      </div>
      <div style="display: flex; justify-content: space-between; gap: 12px;">
        <span style="color: #9ca3af;">Omset sesi</span>
        <span style="font-weight: 700; color: #1f2937;">${escapeHtml(
          currencyFormat(row.total_charges ?? 0),
        )}</span>
      </div>
      <div style="display: flex; justify-content: space-between; gap: 12px;">
        <span style="color: #9ca3af;">Posisi</span>
        <span style="font-weight: 600; color: #6b7280;">${point.latitude.toFixed(
          5,
        )}, ${point.longitude.toFixed(5)}</span>
      </div>
    </div>
  </div>`;
};

interface CashierLiveMapProps {
  /** Daftar operator yang sedang bertugas (session opened). */
  items: CashierMapRow[];
  /** Operator yang jejaknya digambar. */
  selectedId?: string | null;
  /** Dipanggil saat marker operator diklik. */
  onSelect?: (cashierId: string) => void;
  className?: string;
}

/**
 * Peta live posisi device operator — satu marker per operator (warna mengikuti
 * recency device) plus opsional jejak history milik operator terpilih.
 *
 * Komponen ini memuat `mapbox-gl`, jadi konsumennya WAJIB lazy-load.
 */
export function CashierLiveMap({
  items,
  selectedId,
  onSelect,
  className,
}: CashierLiveMapProps) {
  const markers = useMemo<CashierMarker[]>(
    () =>
      items
        .map((row) => ({ row, point: lastPoint(row) }))
        .filter((m): m is CashierMarker => m.point !== null),
    [items],
  );

  const trail = useMemo(
    () => (selectedId ? validHistory(items.find((r) => r.cashier_id === selectedId)) : []),
    [items, selectedId],
  );

  const center: [number, number] =
    markers.length > 0
      ? [markers[0].point.longitude, markers[0].point.latitude]
      : [106.8166667, -6.2];

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Signature titik marker — dipakai untuk refit bounds saat posisi berubah.
  const boundsSignature = useMemo(
    () =>
      markers
        .map((m) => `${m.point.longitude},${m.point.latitude}`)
        .sort()
        .join("|"),
    [markers],
  );
  const lastBoundsSignature = useRef<string>("");

  // Map lifecycle — init sekali per mount.
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: 12,
      interactive: true,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    popup.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: 15,
      maxWidth: "280px",
      className: "cashier-mapbox-popup",
    });

    map.current.on("load", () => setIsLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gambar ulang marker + jejak setiap data berubah.
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    const mapInstance = map.current;

    const markerFeatures: GeoJSONFeatureType[] = markers.map(
      ({ row, point }) => ({
        type: "Feature",
        properties: {
          cashierId: row.cashier_id,
          color: deviceStatusColor(row.status),
        },
        geometry: { type: "Point", coordinates: [point.longitude, point.latitude] },
      }),
    );

    const trailFeatures: GeoJSONFeatureType[] = [];
    trail.forEach((p, idx) => {
      if (idx === 0) return;
      const prev = trail[idx - 1];
      trailFeatures.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [prev.longitude, prev.latitude],
            [p.longitude, p.latitude],
          ],
        },
      });
    });

    ["cashier-trail", "cashier-markers"].forEach((layerId) => {
      if (mapInstance.getLayer(layerId)) mapInstance.removeLayer(layerId);
    });
    ["cashier-trail", "cashier-markers"].forEach((sourceId) => {
      if (mapInstance.getSource(sourceId)) mapInstance.removeSource(sourceId);
    });

    if (markerFeatures.length === 0) return;

    if (trailFeatures.length > 0) {
      mapInstance.addSource("cashier-trail", {
        type: "geojson",
        data: { type: "FeatureCollection", features: trailFeatures },
      });
      mapInstance.addLayer({
        id: "cashier-trail",
        type: "line",
        source: "cashier-trail",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 3,
          "line-opacity": 0.75,
          "line-dasharray": [4, 3],
        },
      });
    }

    mapInstance.addSource("cashier-markers", {
      type: "geojson",
      data: { type: "FeatureCollection", features: markerFeatures },
    });

    mapInstance.addLayer({
      id: "cashier-markers",
      type: "circle",
      source: "cashier-markers",
      paint: {
        "circle-radius": 9,
        "circle-color": ["get", "color"],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    const onMapClick = (e: mapboxgl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["cashier-markers"],
      });
      if (!features || features.length === 0) return;

      const props = features[0].properties as any;
      const found = markers.find((m) => m.row.cashier_id === props.cashierId);
      if (!found) return;

      const coordinates = (features[0].geometry as GeoJSONPoint)
        .coordinates as [number, number];

      if (popup.current) {
        popup.current
          .setLngLat(coordinates)
          .setHTML(buildPopupHtml(found))
          .addTo(mapInstance);
      }

      if (found.row.cashier_id) onSelect?.(found.row.cashier_id);
    };

    const onMapMouseMove = (e: mapboxgl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["cashier-markers"],
      });
      mapInstance.getCanvas().style.cursor =
        features.length > 0 ? "pointer" : "";
    };

    mapInstance.on("click", onMapClick);
    mapInstance.on("mousemove", onMapMouseMove);

    return () => {
      mapInstance.off("click", onMapClick);
      mapInstance.off("mousemove", onMapMouseMove);
    };
  }, [markers, trail, isLoaded, onSelect]);

  // Refit bounds hanya ketika sebaran titik berubah (bukan tiap re-render).
  useEffect(() => {
    if (!map.current || !isLoaded || markers.length === 0) return;
    if (lastBoundsSignature.current === boundsSignature) return;

    const bounds = new mapboxgl.LngLatBounds();
    markers.forEach(({ point }) =>
      bounds.extend([point.longitude, point.latitude]),
    );
    map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    lastBoundsSignature.current = boundsSignature;
  }, [boundsSignature, markers, isLoaded]);

  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden rounded-xl bg-slate-100",
        className,
      )}
    >
      {MAPBOX_TOKEN ? (
        <div
          ref={mapContainer}
          className='absolute inset-0 h-full w-full'
          style={{ minHeight: 200 }}
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center border-2 border-dashed border-slate-200'>
          <div className='text-center'>
            <MapPin className='mx-auto mb-2 h-7 w-7 text-slate-300' />
            <p className='text-xs font-medium text-slate-400'>
              Mapbox token belum dikonfigurasi
            </p>
            <code className='text-[10px] text-slate-400'>VITE_MAPBOX_TOKEN</code>
          </div>
        </div>
      )}

      {MAPBOX_TOKEN && markers.length === 0 && (
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-slate-50/85'>
          <MapPin className='mb-2 h-7 w-7 text-slate-300' />
          <p className='text-xs font-medium text-slate-400'>
            Belum ada posisi device
          </p>
        </div>
      )}

      <div className='absolute bottom-2 left-2 z-10 space-y-1 rounded-lg bg-white/90 px-2.5 py-1.5 shadow-sm'>
        {(["online", "stale", "offline"] as const).map((status) => (
          <div key={status} className='flex items-center gap-1.5'>
            <span
              className='h-2 w-2 rounded-full'
              style={{ background: DEVICE_STATUS_COLOR[status] }}
            />
            <span className='text-[10px] font-semibold text-slate-600'>
              {DEVICE_STATUS_LABEL[status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
