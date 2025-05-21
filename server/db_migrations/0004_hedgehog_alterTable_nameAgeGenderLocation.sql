DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'hedgehog' AND column_name = 'name'
    ) THEN
        ALTER TABLE hedgehog ADD COLUMN name VARCHAR(256) NOT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'hedgehog' AND column_name = 'age'
    ) THEN
        ALTER TABLE hedgehog ADD COLUMN age INTEGER NOT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'hedgehog' AND column_name = 'gender'
    ) THEN
        ALTER TABLE hedgehog ADD COLUMN gender gender_enum DEFAULT 'Unknown';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'hedgehog' AND column_name = 'location'
    ) THEN
        ALTER TABLE hedgehog ADD COLUMN location geometry(Point, 4326) NOT NULL;
    END IF;
END $$;