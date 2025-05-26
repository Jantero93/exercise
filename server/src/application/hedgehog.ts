import { getPool } from "@server/db";
import { logger } from "@server/logging";
import { Hedgehog, hedgehogSchema } from "@shared/hedgehog";
import { sql } from "slonik";

export async function getAllHedgehogs() {
  try {
    const rows = await getPool().any(sql.type(hedgehogSchema)`
    SELECT
      id,
      name,
      age,
      gender,
      jsonb_build_object(
      'lon', ST_X(location),
      'lat', ST_Y(location)
    ) AS location
    FROM hedgehog
  `);

    const hedgehogs = rows.map<Hedgehog>((row) => ({
      id: row.id,
      name: row.name,
      age: row.age,
      gender: row.gender,
      location: {
        lon: row.location.lon,
        lat: row.location.lat,
      },
    }));

    return hedgehogs;
  } catch (error) {
    logger.error(error);
  }
}

export const getHedgehogById = async (id: number) => {
  const row = await getPool().maybeOne(sql.type(hedgehogSchema)`
    SELECT
      id,
      name,
      age,
      gender,
      jsonb_build_object(
      'lon', ST_X(location),
      'lat', ST_Y(location)
    ) AS location
    FROM hedgehog
    WHERE id = ${id}
  `);

  if (!row) {
    return null;
  }

  const hedgehog: Hedgehog = {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    location: {
      lon: row.location.lon,
      lat: row.location.lat,
    },
  };

  return hedgehog;
};

export const createHedgehog = async (hedgehog: Omit<Hedgehog, "id">) => {
  const row = await getPool().one(sql.type(hedgehogSchema)`
    INSERT INTO hedgehog (name, age, gender, location)
    VALUES (
      ${hedgehog.name ?? null},
      ${hedgehog.age ?? null},
      ${hedgehog.gender},
      ST_SetSRID(ST_MakePoint(${hedgehog.location.lon}, ${
    hedgehog.location.lat
  }), 4326)
    )
    RETURNING
      id,
      name,
      age,
      gender,
      jsonb_build_object(
      'lon', ST_X(location),
      'lat', ST_Y(location)
    ) AS location
  `);

  const newHedgehog: Hedgehog = {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    location: {
      lon: row.location.lon,
      lat: row.location.lat,
    },
  };

  return newHedgehog;
};
