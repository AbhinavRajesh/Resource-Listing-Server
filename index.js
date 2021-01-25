const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.status(200).send({
    message: "API Working",
  });
});

app.listen(PORT, () =>
  console.log(`Server Running at http://localhost:${PORT}`)
);
