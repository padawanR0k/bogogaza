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
        left: "50%",
        top: "0",
        transform: "translate(-50%, 0)",
      }}
    >
      {children}
    </Box>
  );
}
