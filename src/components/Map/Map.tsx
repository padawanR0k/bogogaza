"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { ReactElement } from "react";
import { useEffect, useRef } from "react";

// seoul
const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};
const DEFAULT_ZOOM = 7;

import mapStyles from "./Map.module.css";

function Render(children?: ReactElement) {
  return function RenderItem(status: string) {
    switch (status) {
      case Status.LOADING:
        return <>...loading</>;
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

function MapCore() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Display the map
    if (ref.current) {
      new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });
    }
  }, []);

  return (
    <div
      id="map"
      ref={ref}
      style={{ width: "100%", height: "100vh", background: "white" }}
    />
  );
}

export const Map = () => {
  return (
    <MapWrapper>
      <MapCore />
    </MapWrapper>
  );
};
