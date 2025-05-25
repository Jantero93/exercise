import { Box, MenuItem, Paper, Typography } from "@mui/material";
import { Hedgehog } from "@shared/hedgehog";
import { useEffect, useState, Dispatch } from "react";

type HedgehogListProps = {
  selectedHedgehogId: Dispatch<number | null>;
};

export default function HedgeHogList({
  selectedHedgehogId,
}: Readonly<HedgehogListProps>) {
  const [hedgehogs, setHedgehogs] = useState<Hedgehog[]>([]);

  // Fetch all hedgehog's during startup
  useEffect(() => {
    const getAllHedgehogs = async () => {
      try {
        const res = await fetch("/api/v1/hedgehog");
        if (!res.ok) return;

        const json = await res.json();
        setHedgehogs(json?.hedgehogs ?? []);
      } catch (err) {
        console.error(`Error while fetching hedgehogs: ${err}`);
      }
    };

    getAllHedgehogs();
  }, []);

  return (
    <Paper elevation={3} sx={{ margin: "1em", overflow: "hidden" }}>
      <Box
        sx={{
          backgroundColor: "#a1e6df",
          height: "3em",
          display: "flex",
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "darkslategrey" }}>
          Rekisteröidyt siilit
        </Typography>
      </Box>
      {hedgehogs.length ? (
        <Box sx={{ overflowY: "scroll", height: "100%" }}>
          {hedgehogs.map((hedgehog) => (
            <MenuItem
              key={hedgehog.id}
              onClick={() => selectedHedgehogId(hedgehog.id)}
            >
              {hedgehog?.name ?? "-"}
            </MenuItem>
          ))}
        </Box>
      ) : (
        <Typography sx={{ padding: "1em" }}>
          Ei rekisteröityjä havaintoja
        </Typography>
      )}
    </Paper>
  );
}
