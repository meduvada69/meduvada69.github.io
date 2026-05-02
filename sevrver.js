import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "YOUR_API_KEY",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 200,
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.content?.[0]?.text || "No response";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));