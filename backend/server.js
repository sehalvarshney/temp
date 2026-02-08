require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');

// Routers
const adminAuthRoutes = require('./router/admin/auth');
const loginRouter = require('./router/loginRouter');
const sourceRouter = require('./router/admin/sourceRoutes');
const companyRoutes = require('./router/companyRoutes');
const predictRoutes = require('./router/predictRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/auth", loginRouter);
app.use("/api/source", sourceRouter);
app.use("/api/companies", companyRoutes);
app.use("/api/predict", predictRoutes);

// Start server
connectDb().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("DB connection failed:", err);
});
