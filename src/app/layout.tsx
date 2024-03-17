import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createTheme, Flex, MantineProvider } from "@mantine/core";
import { SideBar } from "@/components/Sidebar/SideBar";
import { GUAK_DATA } from "@/data/guack";
import { Map } from "@/components/Map/Map";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "놀러갈 땐? 보고가자",
  description: "놀러갈 땐? 보고가자",
};

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log({
    children,
  });
  return (
    <html lang="ko">
      <body className={inter.className}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Flex direction="row" w="100%" m={0}>
            <SideBar database={GUAK_DATA} />
            <Map database={GUAK_DATA} />
          </Flex>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
