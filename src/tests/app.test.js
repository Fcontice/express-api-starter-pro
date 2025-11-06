/**
 * Example Supertest suite for Express API Starter Pro
 * ---------------------------------------------------
 * This file tests:
 *  - Server boot
 *  - Health check
 *  - Auth flow (register → login → protected route)
 *  - AI route (mocked)
 */

import request from "supertest";
import mongoose from "mongoose";
import app from "../../server.js";
import User from "../models/user.model.js";
import { MongoMemoryServer } from "mongodb-memory-server";

const base = "/api";
let cookieJar = "";
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// 🔹 Health route
describe("Health Check", () => {
  it("should respond with ok:true", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

// 🔹 Auth routes
describe("Auth Flow", () => {
  const newUser = { name: "Tester", email: "tester@example.com", password: "Pass123!" };

  it("should register a new user", async () => {
    const res = await request(app).post(`${base}/auth/register`).send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(newUser.email);
  });

  it("should login and set cookies", async () => {
    const res = await request(app).post(`${base}/auth/login`).send({
      email: newUser.email,
      password: newUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    cookieJar = res.headers["set-cookie"];
  });

  it("should access /users/me with auth", async () => {
    const res = await request(app)
      .get(`${base}/users/me`)
      .set("Cookie", cookieJar);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });
});

// 🔹 AI route (mock test)
describe("AI Route", () => {
  it("should reject without a prompt", async () => {
    const res = await request(app).post(`${base}/ai/run`).send({});
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 for unknown provider", async () => {
    const res = await request(app)
      .post(`${base}/ai/run`)
      .send({ prompt: "Hello", provider: "unknown" });
    expect(res.statusCode).toBe(400);
  });
});
