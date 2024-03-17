"use client";
import {
  ActionIcon,
  Box,
  Card,
  Group,
  Menu,
  Text,
  rem,
  CloseButton,
} from "@mantine/core";
import YouTube from "react-youtube";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { IconDots } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { GoogleMapContext } from "@/components/Map/Map";

export default function DetailPage(props: any) {
  const id = props.params.slug;
  const searchParams = useSearchParams();
  const mapContext = useContext(GoogleMapContext);

  useEffect(() => {
    if (!id) {
      return;
    }
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) {
      const point = new window.google.maps.LatLng(Number(lat), Number(lng));

      mapContext.map?.setCenter(point);
      mapContext.map?.setZoom(14);
    }
  }, []);

  const router = useRouter();
  const handleClose = () => {
    router.push("/");
  };

  if (!id) {
    return <Box>Id not found</Box>;
  }

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder={false} m={8}>
      <Card.Section>
        <Group justify="flex-end">
          <CloseButton onClick={handleClose} />
        </Group>
      </Card.Section>

      <Card.Section h={270}>
        <YouTube
          videoId={id}
          opts={{
            autoplay: 1,
            width: "480px",
            height: "270px",
          }}
        />
      </Card.Section>
    </Card>
  );
}
