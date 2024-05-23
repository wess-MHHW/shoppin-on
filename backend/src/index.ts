import app from "./app";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/config.env" });

// eslint-disable-next-line import/first
import "./utils/database/mongodb";

const port: number = parseInt(process.env.PORT!);

app.listen(port, () => {
  console.log("The application is listening on port 3000!");
});
