"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React, {
  createContext,
  ReactElement,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Loader } from "@mantine/core";

import mapStyles from "./Map.module.css";

import { Coordinate, GUAK_DATA, russia, YoutubeRawData } from "@/data/guack";

// seoul
const DEFAULT_CENTER = russia.items[0].coordinate;

const seoul = {
  lat: 37.5665,
  lng: 126.978,
};

const DEFAULT_ZOOM = 12;

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
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polyLinesRef = useRef<google.maps.Polyline[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  function getMarker(
    map: google.maps.Map,
    {
      coordinate,
      title,
      index,
      subIndex,
    }: {
      coordinate: google.maps.LatLngLiteral;
      title: string;
      index: number;
      subIndex?: number;
    },
  ) {
    const markerElement = document.createElement("div");
    markerElement.style.color = "white";
    markerElement.style.backgroundColor = "black";
    markerElement.style.padding = "5px";
    markerElement.style.borderRadius = "8px";
    markerElement.style.fontSize = "18px";
    markerElement.style.fontWeight = "bold";
    markerElement.style.textAlign = "center";
    markerElement.style.lineHeight = "20px";
    markerElement.style.border = "1px solid #ddd";
    markerElement.textContent = `${index}${subIndex ? ` - ${subIndex}` : ""}`;

    return new window.google.maps.marker.AdvancedMarkerElement({
      position: coordinate,
      map: map,
      title: title,
      content: markerElement,
    });
  }

  function getPolyLine(
    map: google.maps.Map,
    {
      path,
      polyLineOption,
    }: {
      path: google.maps.LatLngLiteral[];
      polyLineOption?: google.maps.PolylineOptions;
    },
  ) {
    return new window.google.maps.Polyline({
      path,
      map,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      ...polyLineOption,
    });
  }

  function drawMarkers(database: YoutubeRawData[], map: google.maps.Map) {
    if (ref.current) {
      database.forEach((item) => {
        item.items.forEach((item, index) => {
          if (!item.coordinate) {
            return;
          }

          const marker = getMarker(map, {
            coordinate: item.coordinate,
            title: item.snippet.title,
            index: index + 1,
          });

          if (!item.roadmap) {
            return;
          }

          const roadmap = item.roadmap.map((item, subIndex) => {
            return getMarker(map, {
              coordinate: item.coordinate,
              title: item.title,
              index,
              subIndex: subIndex + 1,
            });
          });

          markersRef.current = [...markersRef.current, marker, ...roadmap];
        });
      });
    }
  }
  function drawPolyLines(database: YoutubeRawData[], map: google.maps.Map) {
    if (ref.current) {
      // reset
      polyLinesRef.current.forEach((polyLine) => {
        polyLine.setMap(null);
      });

      database.forEach((item) => {
        const mainRoutePath: Coordinate[] = [];
        item.items.forEach((item, index) => {
          if (!item.coordinate) {
            return;
          }
          mainRoutePath.push(item.coordinate);

          if (!item.roadmap) {
            return;
          }

          const roadmapStartPoint = item.coordinate;
          const roadmapPath = [
            roadmapStartPoint,
            ...item.roadmap.map((item) => item.coordinate),
          ];

          const subLine = getPolyLine(map, {
            path: roadmapPath,
            polyLineOption: {
              strokeOpacity: 0.5,
              zIndex: 20,
              icons: [
                {
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                    scale: 2, // Adjust the size of the dots
                  },
                  offset: "16px", // Start the symbol at the beginning of the line
                  repeat: "24px", // Spacing between each dot
                },
              ],
            },
          });

          polyLinesRef.current = [...polyLinesRef.current, subLine];
        });

        const mainLine = getPolyLine(map, {
          path: mainRoutePath,
          polyLineOption: {
            strokeColor: "#AA0000",
            strokeOpacity: 0.7,
            zIndex: 10,
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 2, // Adjust the size of the dots
                },
                offset: "16px", // Start the symbol at the beginning of the line
                repeat: "32px", // Spacing between each dot
              },
            ],
          },
        });
        polyLinesRef.current = [...polyLinesRef.current, mainLine];
      });
    }
  }

  useLayoutEffect(() => {
    // Display the map
    if (ref.current && map === null) {
      const map = new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        mapId: "ID2ab93894f0d3cce2",
      });

      setMap(map);

      drawMarkers(database, map);
      drawPolyLines(database, map);
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
