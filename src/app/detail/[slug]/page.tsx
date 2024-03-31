"use client";
import { Box, Card, CloseButton, Group } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

import { GoogleMapContext } from "@/components/Map/Map";
import { YoutubeVideo } from "@/components/Youtube/YoutubeVideo";

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
        <YoutubeVideo id={id} />
      </Card.Section>
    </Card>
  );
}
