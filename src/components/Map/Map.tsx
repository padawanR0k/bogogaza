"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React, { createContext, ReactElement, useEffect, useRef } from "react";
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
  const mapRef = useRef<google.maps.Map>(null);

  function getMarker({
    coordinate,
    title,
    label,
  }: {
    coordinate: google.maps.LatLngLiteral;
    title: string;
    label?: string;
  }) {
    return new window.google.maps.Marker({
      position: coordinate,
      map: mapRef.current,
      title: title,
      label,
    });
  }

  function drawMarkers(database: typeof GUAK_DATA) {
    if (ref.current) {
      database.forEach((item) => {
        item.items.forEach((item) => {
          if (!item.coordinate) {
            return;
          }

          const marker = getMarker({
            coordinate: item.coordinate,
            title: item.snippet.title,
          });

          if (!item.roadmap) {
            return;
          }
          const roadmap = item.roadmap.map((item) => {
            return getMarker({
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

  useEffect(() => {
    // Display the map
    if (ref.current) {
      mapRef.current = new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      drawMarkers(database);
    }
  }, []);

  return (
    <GoogleMapContext.Provider
      value={{
        map: mapRef.current,
      }}
    >
      <div
        id="map"
        ref={ref}
        style={{ width: "100%", height: "100vh", background: "white" }}
      />
      {children}
    </GoogleMapContext.Provider>
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
