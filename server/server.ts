import express from "express";
import studentRouter from "./features/students/students.routes";
import parentRouter from "./features/parents/parents.routes";

const app = express();

app.use(express.json());

// Mount the Feature-Driven Router
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/parents", parentRouter);

// Global Error Handler catches all next(error) triggers from controllers perfectly
// app.use(globalErrorHandler);
export default app;
