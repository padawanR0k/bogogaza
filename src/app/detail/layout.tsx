import { Box } from "@mantine/core";

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      style={{
        position: "absolute",
        right: "0",
        top: "0",
      }}
    >
      {children}
    </Box>
  );
}
