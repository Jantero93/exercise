import { HedgehogForm } from "./HedgehogForm";
import { HedgehogInfo } from "./HedgehogInfo";
import HedgeHogList from "./HedgehogList";
import { Map } from "./Map";
import { Box, Paper, Typography } from "@mui/material";
import { Hedgehog } from "@shared/hedgehog";
import { toLonLat, transform } from "ol/proj";
import { useEffect, useState } from "react";

export function App() {
  // Latest coordinates from the Map click event
  const [coordinates, setCoordinates] = useState<number[]>();
  // ID of the currently selected hedgehog
  const [selectedHedgehogId, setSelectedHedgehogId] = useState<number | null>(
    null,
  );
  const [selectedHedgehogInfo, setSelectedHedgehogInfo] =
    useState<Hedgehog | null>(null);

  useEffect(() => {
    if (selectedHedgehogId == null) {
      setSelectedHedgehogInfo(null);
      return;
    }

    const fetchHedgehog = async () => {
      try {
        const response = await fetch(`/api/v1/hedgehog/${selectedHedgehogId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSelectedHedgehogInfo(data.hedgehog);
      } catch (error) {
        console.error("Failed to fetch hedgehog:", error);
        setSelectedHedgehogInfo(null);
      }
    };

    fetchHedgehog();
  }, [selectedHedgehogId]);

  const transformOlCoordinates = (coordinates: number[]) =>
    transform(coordinates, "EPSG:4326", "EPSG:3857");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#00B2A0",
          height: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "white" }} variant="overline">
          Siilit kartalla
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridAutoColumns: "1fr 1.5fr 2fr",
          gridAutoFlow: "column",
          overflow: "hidden",
        }}
      >
        <HedgeHogList selectedHedgehogId={setSelectedHedgehogId} />
        <Box>
          <HedgehogInfo hedgehogId={selectedHedgehogId} />
          <HedgehogForm coordinates={coordinates || []} />
        </Box>
        <Paper elevation={3} sx={{ margin: "1em" }}>
          <Map
            onMapClick={(coordinates) => setCoordinates(toLonLat(coordinates))}
            // Esimerkki siitä, miten kartalle voidaan välittää siilien koordinaatteja GeoJSON -arrayssä
            features={
              selectedHedgehogInfo
                ? [
                    {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: transformOlCoordinates([
                          selectedHedgehogInfo.location.lat,
                          selectedHedgehogInfo.location.lon,
                        ]),
                      },
                      properties: {
                        name: selectedHedgehogInfo.name ?? "-",
                        age: selectedHedgehogInfo.age ?? "-",
                        gender: selectedHedgehogInfo?.gender,
                      },
                    },
                  ]
                : []
            }
          />
        </Paper>
      </Box>
      <Box
        sx={{
          backgroundColor: "#00B2A0",
          height: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <Typography sx={{ color: "white" }} variant="overline">
          Powered by Ubigu Oy
        </Typography>
      </Box>
    </Box>
  );
}
