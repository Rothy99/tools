import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper for lazy Gemini AI client
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Sitemap and Robots.txt endpoints
  app.get("/sitemap.xml", (_req, res) => {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    res.header("Content-Type", "application/xml");
    res.sendFile(sitemapPath);
  });

  app.get("/robots.txt", (_req, res) => {
    const robotsPath = path.join(process.cwd(), "public", "robots.txt");
    res.header("Content-Type", "text/plain");
    res.sendFile(robotsPath);
  });

  // AI Tool Assistant endpoint
  app.post("/api/ai/tool-assistant", async (req, res) => {
    try {
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(400).json({
          error: "Gemini API Key is missing. Please configure GEMINI_API_KEY in Secrets.",
        });
      }

      const { toolId, task, input, prompt, secondaryInput } = req.body;

      let systemInstruction = "You are a senior developer toolkit AI assistant. Provide concise, accurate, and production-ready outputs.";
      let userPrompt = "";

      if (task === "fix_json") {
        systemInstruction = "You are an expert JSON parser and repair engine. The user will provide broken JSON text. Repair the JSON so it is strictly valid JSON format. Return ONLY a valid JSON object/array if possible, or if requested, return a clean JSON code block and brief bullet points explaining what was fixed.";
        userPrompt = `Please repair this broken JSON string and return the corrected JSON:\n\n${input}`;
      } else if (task === "generate_json") {
        systemInstruction = "You are a synthetic test data generator. Generate realistic, clean, valid JSON formatted mock data matching the user request.";
        userPrompt = `Generate sample JSON data according to this requirement: ${prompt || "Realistic e-commerce order or user profile data"}`;
      } else if (task === "explain_regex") {
        systemInstruction = "You are a Regular Expression expert. Break down the provided regex pattern token by token and explain clearly what each part does.";
        userPrompt = `Explain this regular expression pattern in plain developer terms:\nPattern: \`${input}\`\nFlags: ${prompt || "g"}`;
      } else if (task === "generate_regex") {
        systemInstruction = "You are a regex builder. Provide a regex pattern and flags that match the description, along with 3 test cases.";
        userPrompt = `Generate a regular expression for: ${prompt}`;
      } else if (task === "optimize_sql") {
        systemInstruction = "You are a database engineer. Format, optimize, and explain the provided SQL query.";
        userPrompt = `Format and optimize this SQL query:\n\n${input}`;
      } else if (task === "explain_diff") {
        systemInstruction = "You are a code review assistant. Summarize the major changes between Side A and Side B clearly.";
        userPrompt = `Compare these two inputs:\n\n--- ITEM A ---\n${input}\n\n--- ITEM B ---\n${secondaryInput || ""}\n\nSummarize key additions, deletions, and structural modifications.`;
      } else if (task === "ts_from_json") {
        systemInstruction = "You are a TypeScript architect. Convert the provided JSON structure into clean, well-typed TypeScript interfaces or types.";
        userPrompt = `Convert this JSON structure into idiomatic TypeScript type definitions:\n\n${input}`;
      } else {
        userPrompt = `Tool: ${toolId}\nUser Task: ${task}\nPrompt: ${prompt}\nInput Context: ${input}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const text = response.text || "No response generated.";
      return res.json({ result: text });
    } catch (err: any) {
      console.error("AI Tool Assistant Error:", err);
      return res.status(500).json({ error: err.message || "Failed to call AI service" });
    }
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DevStudio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
