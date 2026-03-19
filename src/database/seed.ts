import { db } from "../db";
import { users } from "./schema";

const seed = async () => {
  console.log("Starting the seed");

  const data = [
    {
      username: "SilverWolf",
      password: "Fuchsiashark510",
      display_name: "SilverWolf",
    },
    { username: "Gnzyyyyyyy", password: "Fabio131206", display_name: "Genzy" },
    {
      username: "AhiruSareas",
      password: "Fabio131206",
      display_name: "Ahiru Sareas",
    },
  ];

  for (const user of data) {
    const hashed = await Bun.password.hash(user.password);
    await db.insert(users).values({
      username: user.username,
      password: hashed,
      display_name: user.display_name,
    });
    console.log(`User ${user.username} has been added!`);
  }

  console.log("Seed complete");
  process.exit(0);
};

seed();
