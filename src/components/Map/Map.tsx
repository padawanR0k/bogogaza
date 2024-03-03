"use client";

import { Wrapper } from "@googlemaps/react-wrapper";
import { ReactNode } from "react";

import mapStyles from "./Map.module.css";

export const Map = ({ children }: { children?: ReactNode }) => (
  <div className={mapStyles.map}>
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      {children}
    </Wrapper>
  </div>
);
