"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React, {
  createContext,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Loader } from "@mantine/core";

import mapStyles from "./Map.module.css";

import { GUAK_DATA } from "@/data/guack";

// seoul
const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};
const DEFAULT_ZOOM = 3;

function Render(children?: ReactElement) {
  return function RenderItem(status: string) {
    switch (status) {
      case Status.LOADING:
        return <Loader />;
      case Status.FAILURE:
        return <>Error</>;
      case Status.SUCCESS:
        return children || <></>;
      default:
        return <>default</>;
    }
  };
}

const MapWrapper = ({ children }: { children?: ReactElement }) => (
  <div className={mapStyles.map}>
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      render={Render(children)}
      libraries={["marker"]}
    >
      {children}
    </Wrapper>
  </div>
);

function MapCore({
  database,
  children,
}: {
  database: typeof GUAK_DATA;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  function getMarker(
    map: google.maps.Map,
    {
      coordinate,
      title,
      label,
    }: {
      coordinate: google.maps.LatLngLiteral;
      title: string;
      label?: string;
    },
  ) {
    return new window.google.maps.marker.AdvancedMarkerElement({
      position: coordinate,
      map: map,
      title: title,
    });
  }

  function drawMarkers(database: typeof GUAK_DATA, map: google.maps.Map) {
    if (ref.current) {
      database.forEach((item) => {
        item.items.forEach((item) => {
          if (!item.coordinate) {
            return;
          }

          const marker = getMarker(map, {
            coordinate: item.coordinate,
            title: item.snippet.title,
          });

          if (!item.roadmap) {
            return;
          }
          const roadmap = item.roadmap.map((item) => {
            return getMarker(map, {
              coordinate: item.coordinate,
              title: item.title,
              label: "R",
            });
          });

          markersRef.current.push(marker);
        });
      });
    }
  }

  useLayoutEffect(() => {
    // Display the map
    if (ref.current && map === null) {
      console.count("123");
      const map = new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        mapId: "ID2ab93894f0d3cce2",
      });

      setMap(map);

      drawMarkers(database, map);
    }
  }, []);

  return (
    <>
      <div
        id="map"
        ref={ref}
        style={{ width: "100%", height: "100vh", background: "white" }}
      />
      <GoogleMapContext.Provider
        value={{
          map: map,
        }}
      >
        {children}
      </GoogleMapContext.Provider>
    </>
  );
}

export const GoogleMapContext = createContext<{
  map: google.maps.Map | null;
}>({
  map: null,
});

export const Map = ({
  database,
  children,
}: {
  database: typeof GUAK_DATA;
  children: React.ReactNode;
}) => {
  return (
    <MapWrapper>
      <MapCore database={database}>{children}</MapCore>
    </MapWrapper>
  );
};
