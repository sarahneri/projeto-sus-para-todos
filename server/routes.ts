import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertHospitalSchema,
  insertSpecialtySchema,
  insertAppointmentSchema,
  insertNewsSchema,
  insertUserSchema,
} from "@shared/schema";
import { generateSpecialtyIcon, generateNewsImage } from "./openai-service";
import { hashPassword, verifyPassword, validateStrongPassword } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/hospitals", async (_req, res) => {
    try {
      const hospitals = await storage.getHospitals();
      res.json(hospitals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hospitals/:id", async (req, res) => {
    try {
      const hospital = await storage.getHospital(req.params.id);
      if (!hospital) {
        return res.status(404).json({ error: "Hospital não encontrado" });
      }
      res.json(hospital);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hospitals", async (req, res) => {
    try {
      const validated = insertHospitalSchema.parse(req.body);
      const hospital = await storage.createHospital(validated);
      res.status(201).json(hospital);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/specialties", async (_req, res) => {
    try {
      const specialties = await storage.getSpecialties();
      res.json(specialties);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/specialties/:id", async (req, res) => {
    try {
      const specialty = await storage.getSpecialty(req.params.id);
      if (!specialty) {
        return res.status(404).json({ error: "Especialidade não encontrada" });
      }
      res.json(specialty);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/specialties", async (req, res) => {
    try {
      const validated = insertSpecialtySchema.parse(req.body);
      const specialty = await storage.createSpecialty(validated);
      res.status(201).json(specialty);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/appointments", async (_req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }
      res.json(appointment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validated = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validated);
      console.log("[POST /api/appointments] Appointment created successfully:", appointment.id);
      res.status(201).json(appointment);
    } catch (error: any) {
      console.error("[POST /api/appointments] Validation error:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }
      const validated = insertAppointmentSchema.partial().parse(req.body);
      const updated = await storage.updateAppointment(req.params.id, validated);
      console.log("[PUT /api/appointments] Appointment updated successfully:", updated.id);
      res.json(updated);
    } catch (error: any) {
      console.error("[PUT /api/appointments] Error:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }
      await storage.deleteAppointment(req.params.id);
      console.log("[DELETE /api/appointments] Appointment deleted successfully:", req.params.id);
      res.status(204).send();
    } catch (error: any) {
      console.error("[DELETE /api/appointments] Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/news", async (_req, res) => {
    try {
      const newsItems = await storage.getNews();
      res.json(newsItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const newsItem = await storage.getNewsItem(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ error: "Notícia não encontrada" });
      }
      res.json(newsItem);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validated = insertNewsSchema.parse(req.body);
      const newsItem = await storage.createNews(validated);
      res.status(201).json(newsItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/specialties/:id/generate-image", async (req, res) => {
    try {
      const specialty = await storage.getSpecialty(req.params.id);
      if (!specialty) {
        return res.status(404).json({ error: "Especialidade não encontrada" });
      }

      const imageUrl = await generateSpecialtyIcon(specialty.name);
      await storage.updateSpecialtyImage(req.params.id, imageUrl);

      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/news/:id/generate-image", async (req, res) => {
    try {
      const newsItem = await storage.getNewsItem(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ error: "Notícia não encontrada" });
      }

      const imageUrl = await generateNewsImage(newsItem.title, newsItem.category);
      await storage.updateNewsImage(req.params.id, imageUrl);

      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const registerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string(),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = registerSchema.parse(req.body);

      const passwordValidation = validateStrongPassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.errors.join(", ") });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }

      const passwordHash = await hashPassword(password);
      const user = await storage.createUser({
        name,
        email,
        passwordHash,
      });

      req.session.userId = user.id;

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors[0].message });
      }
      if (error.code === "23505" || error.message?.includes("unique")) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }
      res.status(500).json({ error: error.message });
    }
  });

  const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      req.session.userId = user.id;

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
