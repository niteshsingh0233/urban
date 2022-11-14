const express = require(`express`);
const cors = require(`cors`);
const cookieParser = require(`cookie-parser`);

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(cors());

const userRouter = require(`./routes/userRoute`);
app.use("/api/v1", userRouter);

// Using the middleware for errors
const errorMiddleware = require(`./middleware/error`);
app.use(errorMiddleware);

module.exports = app;
