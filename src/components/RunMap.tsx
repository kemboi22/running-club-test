import { useEffect, useState } from "react";
import type { RunPath, Marker as RunMarker } from "@/lib/mock-data";

type Props = {
  center: [number, number];
  paths: RunPath[];
  activePathId?: string;
};

const markerEmoji: Record<RunMarker["type"], string> = {
  start: "🟢",
  finish: "🏁",
  water: "💧",
  crossing: "🚦",
  rest: "🪑",
  cheer: "📣",
};

export default function RunMap({ center, paths, activePathId }: Props) {
  const [mod, setMod] = useState<typeof import("react-leaflet") | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, leaflet]) => {
      if (!active) return;
      setMod(rl);
      setL(leaflet);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!mod || !L) {
    return (
      <div className="grid h-[480px] w-full place-items-center rounded-2xl bg-muted">
        <span className="text-sm text-muted-foreground">Loading map…</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polyline, Marker, Popup } = mod;
  const visible = activePathId ? paths.filter((p) => p.id === activePathId) : paths;

  const makeIcon = (emoji: string, color: string) =>
    L.divIcon({
      className: "",
      html: `<div style="background:${color};border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,.25);border-radius:9999px;width:34px;height:34px;display:grid;place-items:center;font-size:16px;">${emoji}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "480px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visible.map((p) => (
          <Polyline
            key={p.id}
            positions={p.coords}
            pathOptions={{ color: p.color, weight: 6, opacity: 0.85 }}
          />
        ))}
        {visible.flatMap((p) =>
          p.markers.map((m) => (
            <Marker key={m.id} position={m.position} icon={makeIcon(markerEmoji[m.type], p.color)}>
              <Popup>
                <strong>{m.label}</strong>
                <br />
                <span style={{ color: p.color }}>{p.title}</span>
              </Popup>
            </Marker>
          )),
        )}
      </MapContainer>
    </div>
  );
}