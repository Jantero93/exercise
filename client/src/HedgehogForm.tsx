import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Hedgehog } from "@shared/hedgehog";
import { useState } from "react";

interface Props {
  readonly coordinates: number[];
}

type PostHedgehog = Omit<Hedgehog, "id">;

export function HedgehogForm({ coordinates }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coordinates) {
      alert("Valitse sijainti kartalta ennen lähettämistä.");
      return;
    }

    const postHedgehogData: PostHedgehog = {
      name,
      age: isNaN(parseInt(age)) ? undefined : parseInt(age),
      gender: gender as "Female" | "Male" | "Unknown",
      location: {
        lat: coordinates[0],
        lon: coordinates[1],
      },
    };

    try {
      const response = await fetch("/api/v1/hedgehog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postHedgehogData),
      });

      if (!response.ok) {
        alert("Tallennus epäonnistui.");
      }

      // Handle success
      alert("Siilihavainto tallennettu!");
    } catch (error) {
      console.error("API error:", error);
      alert("Tallennus epäonnistui.");
    }
  };

  const longitudeDisplay = `Pituusaste: ${coordinates[1]?.toFixed(5)}`;
  const latitudeDisplay = `Leveysaste: ${coordinates[0]?.toFixed(5)}`;

  const CoordinatesDisplay =
    coordinates.length === 0 ? (
      <Typography>Ei valittu</Typography>
    ) : (
      <>
        <Typography>{longitudeDisplay}</Typography>
        <Typography>{latitudeDisplay}</Typography>
      </>
    );

  return (
    <Paper elevation={3} sx={{ margin: "1em 0em", padding: "1em" }}>
      <Typography variant="h6">Lisää uusi siilihavainto</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nimi"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Ikä"
          type="number"
          fullWidth
          margin="normal"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <FormControl
          component="fieldset"
          margin="normal"
          required
          title="Sijainti kartalta:"
        >
          <FormLabel component="legend">Sukupuoli</FormLabel>
          <RadioGroup
            row
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            name="gender"
          >
            <FormControlLabel value="Male" control={<Radio />} label="Uros" />
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Naaras"
            />
            <FormControlLabel
              value="Unknown"
              control={<Radio />}
              label="Tuntematon"
            />
          </RadioGroup>
        </FormControl>
        <Typography sx={{ marginBottom: "0.25em" }}>
          Sijainti kartalta:
        </Typography>
        {CoordinatesDisplay}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          disabled={!coordinates}
        >
          Lähetä havainto
        </Button>
      </form>
    </Paper>
  );
}
