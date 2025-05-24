import { CircularProgress, Paper, Typography } from "@mui/material";
import { Hedgehog } from "@shared/hedgehog";
import { useEffect, useState } from "react";

interface Props {
  readonly hedgehogId: number | null;
}

export function HedgehogInfo({ hedgehogId }: Props) {
  const [hedgehog, setHedgehog] = useState<Hedgehog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hedgehogId === null) {
      setHedgehog(null);
      return;
    }

    const fetchHedgehogData = async () => {
      setLoading(true);
      setError(null);

      try {
        setHedgehog(null);
        const response = await fetch(`/api/v1/hedgehog/${hedgehogId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch hedgehog");
        }

        const data = await response.json();

        console.log("data.hedgehog", data.hedgehog);

        setHedgehog(data.hedgehog);
      } catch (err) {
        console.error(`Error fetching hedgehog:`, err);
        setError("Virhe siilin tietojen latauksessa.");
      } finally {
        setLoading(false);
      }
    };

    fetchHedgehogData();
  }, [hedgehogId]);

  if (hedgehogId === null) {
    return (
      <Paper elevation={3} sx={{ margin: "1em 0", padding: "1em" }}>
        <Typography>Valitse siili vasemmalta listasta.</Typography>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper elevation={3} sx={{ margin: "1em 0", padding: "1em" }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ margin: "1em 0", padding: "1em" }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!hedgehog) {
    return (
      <Paper elevation={3} sx={{ margin: "1em 0", padding: "1em" }}>
        <Typography>Siilin tietoja ei löytynyt.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ margin: "1em 0", padding: "1em" }}>
      <Typography variant="h6">{hedgehog.name}</Typography>
      <Typography>ID: {hedgehog.id}</Typography>
      <Typography>Ikä: {hedgehog.age ?? "-"}</Typography>
      <Typography>Nimi: {hedgehog.name}</Typography>
    </Paper>
  );
}
