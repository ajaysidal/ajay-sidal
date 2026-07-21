import Openfort from "@openfort/openfort-node";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const of = new Openfort(process.env.OPENFORT_SECRET_KEY);

  const users = await of.users.listUsers();
  console.log("Users:", users);
}

main().catch(console.error);
