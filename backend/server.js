const express = require('express');
const connectDb = require('./config/db');
const authRouter = require('./router/auth');

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
connectDb();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});
