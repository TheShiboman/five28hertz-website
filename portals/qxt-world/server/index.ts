import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeWebSocket } from "./services/websocket-service";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CSP headers with development-specific rules
app.use((req, res, next) => {
  const isDevelopment = app.get("env") === "development";

  const cspDirectives = isDevelopment
    ? [
        // Development CSP - more permissive for Vite, HMR, etc.
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.firebaseapp.com https://*.firebase.com https://*.googleapis.com https://*.gstatic.com https://*.google.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.gstatic.com",
        "connect-src 'self' ws: wss: https://*.firebaseapp.com https://*.firebase.com https://*.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com",
        "img-src 'self' data: blob: https://*.googleusercontent.com https://*.gstatic.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://*.google.com",
        "worker-src 'self' blob:",
        "base-uri 'self'",
      ]
    : [
        // Production CSP - more restrictive
        "default-src 'self'",
        "script-src 'self' https://*.firebaseapp.com https://*.firebase.com https://*.googleapis.com https://*.gstatic.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "connect-src 'self' ws: wss: https://*.firebaseapp.com https://*.firebase.com https://*.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com",
        "img-src 'self' data: https://*.googleusercontent.com",
        "font-src 'self' https://fonts.gstatic.com",
        "frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://*.google.com",
        "base-uri 'self'",
      ];

  res.setHeader("Content-Security-Policy", cspDirectives.join("; "));
  next();
});

// Enable CORS for WebSocket and API requests
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Initialize WebSocket service with port from environment variable
  const wsPort = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 443;
  initializeWebSocket(server, wsPort);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`Error: ${message}`);
    res.status(status).json({ message });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();