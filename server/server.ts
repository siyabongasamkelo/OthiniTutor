import express from "express";
import studentRouter from "./features/students/students.routes";
import parentRouter from "./features/parents/parents.routes";
import paymentRouter from "./features/payments/payment.routes";
import classRouter from "./features/classes/classes.routes";
import authRouter from "./features/auth/auth.routes";

const app = express();

app.use(express.json());

// Mount the Feature-Driven Router
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/parents", parentRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/classes", classRouter);
app.use("/api/v1/auth", authRouter);

// Global Error Handler catches all next(error) triggers from controllers perfectly
// app.use(globalErrorHandler);
export default app;
