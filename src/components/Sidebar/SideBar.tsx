"use client";

import { Accordion, Box, List, ScrollArea } from "@mantine/core";
import {
  ethiopia,
  eurasia,
  GUAK_DATA,
  japan_2022,
  japan_2024,
  northAmerica,
  russia,
  uzbekistan,
  YoutubeVideoItem,
} from "@/data/guack";

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
          <a
            target="_blank"
            href={`https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`}
          >
            {item.snippet.title}
          </a>
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
