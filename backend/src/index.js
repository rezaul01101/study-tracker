const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const curriculumRoutes = require("./routes/curriculum");
const notebookRoutes = require("./routes/notebook");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Uploaded note photos are served as static files.
app.use("/uploads", express.static(path.join(__dirname, "..", "storage", "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", curriculumRoutes);
app.use("/api", notebookRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", docs: "/api-docs" });
});

app.listen(PORT, () => {
  console.log(`Study Tracker API running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
