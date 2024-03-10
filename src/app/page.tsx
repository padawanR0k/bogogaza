import { Map } from "@/components/Map/Map";
import styles from "./page.module.css";
import { Box, Flex, MantineProvider, Title, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { SideBar } from "@/components/Sidebar/SideBar";
import { GUAK_DATA } from "@/data/guack";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function Home() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <main className={styles.main}>
        <Flex direction="row" w="100%" m={0}>
          <SideBar database={GUAK_DATA} />
          <Map database={GUAK_DATA} />
        </Flex>
      </main>
    </MantineProvider>
  );
}
