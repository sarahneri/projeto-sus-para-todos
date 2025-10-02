import { db } from "./db";
import {
  type Hospital,
  type InsertHospital,
  type Specialty,
  type InsertSpecialty,
  type Appointment,
  type InsertAppointment,
  type News,
  type InsertNews,
  hospitals,
  specialties,
  appointments,
  news,
} from "@shared/schema";
import { eq, and, gte } from "drizzle-orm";

export interface IStorage {
  getHospitals(): Promise<Hospital[]>;
  getHospital(id: string): Promise<Hospital | undefined>;
  createHospital(hospital: InsertHospital): Promise<Hospital>;

  getSpecialties(): Promise<Specialty[]>;
  getSpecialty(id: string): Promise<Specialty | undefined>;
  createSpecialty(specialty: InsertSpecialty): Promise<Specialty>;
  updateSpecialtyImage(id: string, imageUrl: string): Promise<void>;

  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;

  getNews(): Promise<News[]>;
  getNewsItem(id: string): Promise<News | undefined>;
  createNews(newsItem: InsertNews): Promise<News>;
  updateNewsImage(id: string, imageUrl: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getHospitals(): Promise<Hospital[]> {
    return await db.select().from(hospitals);
  }

  async getHospital(id: string): Promise<Hospital | undefined> {
    const result = await db.select().from(hospitals).where(eq(hospitals.id, id));
    return result[0];
  }

  async createHospital(hospital: InsertHospital): Promise<Hospital> {
    const result = await db.insert(hospitals).values(hospital).returning();
    return result[0];
  }

  async getSpecialties(): Promise<Specialty[]> {
    return await db.select().from(specialties);
  }

  async getSpecialty(id: string): Promise<Specialty | undefined> {
    const result = await db.select().from(specialties).where(eq(specialties.id, id));
    return result[0];
  }

  async createSpecialty(specialty: InsertSpecialty): Promise<Specialty> {
    const result = await db.insert(specialties).values(specialty).returning();
    return result[0];
  }

  async updateSpecialtyImage(id: string, imageUrl: string): Promise<void> {
    await db.update(specialties).set({ imageUrl }).where(eq(specialties.id, id));
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id));
    return result[0];
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(appointments)
      .where(
        gte(appointments.appointmentDate, startOfDay)
      );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(appointment).returning();
    return result[0];
  }

  async getNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(news.publishedAt);
  }

  async getNewsItem(id: string): Promise<News | undefined> {
    const result = await db.select().from(news).where(eq(news.id, id));
    return result[0];
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const result = await db.insert(news).values(newsItem).returning();
    return result[0];
  }

  async updateNewsImage(id: string, imageUrl: string): Promise<void> {
    await db.update(news).set({ imageUrl }).where(eq(news.id, id));
  }
}

export const storage = new DatabaseStorage();
