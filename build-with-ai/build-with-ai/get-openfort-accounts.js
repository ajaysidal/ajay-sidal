import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENFORT_SECRET_KEY;

async function main() {
  const res = await fetch("https://api.openfort.io/v1/accounts", {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
