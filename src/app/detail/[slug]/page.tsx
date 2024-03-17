"use client";

import { Box } from "@mantine/core";
import { PageProps } from "../../../../.next/types/app/page";

export default function DetailPage(props: PageProps) {
  const id = props.params.slug;
  return <Box>{id}</Box>;
}
