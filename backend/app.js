const express = require(`express`);
const cors = require(`cors`);
const cookieParser = require(`cookie-parser`);

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(cors());

// user Router
const userRouter = require(`./routes/userRoute`);
app.use("/api/v1", userRouter);

// home router
const homeRouter = require(`./routes/homeRoute`);
app.use("/api/v1", homeRouter);

// contact router
const contactRouter = require(`./routes/contactRoute`);
app.use("/api/v1", contactRouter);

// Using the middleware for errors
const errorMiddleware = require(`./middleware/error`);
app.use(errorMiddleware);

module.exports = app;
