import fs from "fs";
import path from "path";
import { initialResorts } from "../src/data/resorts";

const storePath = path.join(process.cwd(), "data_store.json");
if (fs.existsSync(storePath)) {
  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  store.resorts = initialResorts;
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
  console.log("Successfully updated data_store.json with", initialResorts.length, "resorts");
} else {
  console.log("data_store.json does not exist yet.");
}
