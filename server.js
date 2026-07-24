import express from "express";

import createApp from "./src/app.js";

const PORT = 3000;
const app = express();
app.use(express.json());
createApp(app);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
