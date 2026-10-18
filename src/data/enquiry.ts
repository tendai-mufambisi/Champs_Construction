// The build enquiry form: options, validation and the WhatsApp message. Shared by the
// form (browser) and the server function that saves each enquiry to D1.

import { z } from "zod";

export const countries = [
  "Zimbabwe",
  "UK",
  "South Africa",
  "USA",
  "Australia",
  "Canada",
  "Ireland",
  "New Zealand",
  "Other",
] as const;
export const standOptions = ["Yes", "No", "Interested in The Burbs"] as const;
export const buildTypes = [
  "New house",
  "Extension",
  "Finishing an existing structure",
  "Labour only (I have materials)",
  "Project management of my build",
  "Not sure",
] as const;
export const budgets = ["Under $15k", "$15k–$30k", "$30k–$60k", "$60k+", "Not sure"] as const;
export const startOptions = ["Now", "1–3 months", "3–6 months", "Just researching"] as const;

export const enquiryStatuses = ["New", "Contacted", "Closed"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  country: z.enum(countries, { errorMap: () => ({ message: "Please choose your country" }) }),
  whatsapp: z
    .string()
    .trim()
    .max(25)
    .refine((v) => v.replace(/\D/g, "").length >= 9, "Please enter your WhatsApp number"),
  ownsStand: z.enum(standOptions, {
    errorMap: () => ({ message: "Please tell us if you own a stand" }),
  }),
  standLocation: z.string().trim().max(120).optional().default(""),
  buildType: z.enum(buildTypes, { errorMap: () => ({ message: "Please choose a type of build" }) }),
  budget: z.enum(budgets, { errorMap: () => ({ message: "Please choose a budget" }) }),
  startWhen: z.enum(startOptions, {
    errorMap: () => ({ message: "Please tell us when you want to start" }),
  }),
  message: z.string().trim().max(1500).optional().default(""),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryRecord = EnquiryInput & {
  id: number;
  status: EnquiryStatus;
  createdAt: string;
};

/** The pre-filled WhatsApp message sent to Champs when the form is submitted. */
export function enquiryMessage(e: EnquiryInput): string {
  return [
    "Hi Champs Construction, I'd like to build a house in Zimbabwe.",
    "",
    `*Name:* ${e.name}`,
    `*Country:* ${e.country}`,
    `*WhatsApp:* ${e.whatsapp}`,
    `*Own a stand:* ${e.ownsStand}`,
    `*Stand location:* ${e.standLocation || "-"}`,
    `*Type of build:* ${e.buildType}`,
    `*Budget:* ${e.budget}`,
    `*Start:* ${e.startWhen}`,
    `*Message:* ${e.message || "-"}`,
  ].join("\n");
}
