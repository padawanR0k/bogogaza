"use client";

import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";

import { useQueryParameter } from "@/util/useQueryParameter";

export function YoutubeVideo({ id }: { id: string }) {
  const { queryObject } = useQueryParameter();
  const youtubeContext = useContext(YoutubeContext);

  // useEffect(() => {
  //   if (queryObject.t) {
  //     const timestamp = parseInt(queryObject.t as string);
  //   }
  // }, [queryObject]);

  if (!youtubeContext) {
    throw new Error("YoutubeContext is not provided");
  }

  function onReadyVideo(event: YouTubeEvent) {
    const timestamp = queryObject.t ? parseInt(queryObject.t as string) : 0;
    if (timestamp !== 0 && !Number.isNaN(timestamp)) {
      event.target.seekTo(timestamp, true);
    }
    event.target.playVideo();
    youtubeContext?.setPlayer(event.target);
  }

  return (
    <YouTube
      videoId={id}
      onReady={onReadyVideo}
      opts={{
        autoplay: 1,
        width: "480px",
        height: "270px",
      }}
    />
  );
}

type YoutubePlayerContext = {
  setTimestamp: (timestamp: number) => void;
  setPlayer: (player: YouTubePlayer) => void;
};

export const YoutubeContext = createContext<YoutubePlayerContext | null>(null);

export function YoutubeProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  // const [timestamp, setTimestamp] = useState<number | null>(null);
  const { addQueryParameter } = useQueryParameter();

  function setPlayer(player: YouTubePlayer) {
    playerRef.current = player;
  }

  function setTimestamp(timestamp: number) {
    addQueryParameter("t", timestamp.toString());
  }

  return (
    <YoutubeContext.Provider
      value={{
        setTimestamp,
        setPlayer,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
}
