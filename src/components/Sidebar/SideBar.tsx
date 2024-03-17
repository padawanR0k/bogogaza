"use client";

import { Accordion, Box, List, ScrollArea, Text } from "@mantine/core";
import Link from "next/link";

import { GUAK_DATA, YoutubeVideoItem } from "@/data/guack";

type Props = {
  countryName: string;
  videos: YoutubeVideoItem[];
};

// <iframe
//     width="560"
//     height="315"
//     src={`https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`}
//     title={item.snippet.title}
//     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// ></iframe>

function CountryList({ videos, countryName }: Props) {
  return (
    <List size="sm">
      {videos.map((item) => (
        <List.Item key={item.id}>
          <Link
            href={{
              pathname: `/detail/${item.snippet.resourceId.videoId}`,
              query: item.coordinate,
            }}
          >
            <Text size="sm" c="gray.9">
              {item.snippet.title}
            </Text>
          </Link>
        </List.Item>
      ))}
    </List>
  );
}

export function SideBar({ database }: { database: typeof GUAK_DATA }) {
  return (
    <Box w="30%">
      <ScrollArea h="100vh" scrollbars="y" p={8}>
        <Accordion defaultValue={database[0].title}>
          {database.map((item) => (
            <Accordion.Item key={item.etag} value={item.title}>
              <Accordion.Control>{item.title}</Accordion.Control>
              <Accordion.Panel>
                <CountryList
                  key={item.etag}
                  videos={item.items}
                  countryName={item.title}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </ScrollArea>
    </Box>
  );
}
