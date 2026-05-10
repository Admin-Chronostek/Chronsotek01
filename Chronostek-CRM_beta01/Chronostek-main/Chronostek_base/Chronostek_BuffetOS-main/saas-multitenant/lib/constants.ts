import { LeadSource, LeadStatus } from "@/types"

export const LEAD_SOURCES: Record<LeadSource, string> = {
  GOOGLE_ADS: "Google Ads",
  GOOGLE_ORGANIC: "Google Orgânico",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  LINKEDIN: "LinkedIn",
  INDICACAO: "Indicação",
  COLD_CALL: "Cold Call",
  EMAIL: "Email",
  EVENTO: "Evento",
  WHATSAPP: "WhatsApp",
  WEBSITE: "Website",
  OUTRO: "Outro",
}

export const LEAD_STATUSES: Record<LeadStatus, { label: string; color: string }> = {
  NEW: { label: "Novo", color: "bg-blue-100 text-blue-800" },
  CONTACTED: { label: "Contatado", color: "bg-yellow-100 text-yellow-800" },
  QUALIFIED: { label: "Qualificado", color: "bg-purple-100 text-purple-800" },
  PROPOSAL: { label: "Proposta", color: "bg-orange-100 text-orange-800" },
  LOST: { label: "Perdido", color: "bg-red-100 text-red-800" },
  CONVERTED: { label: "Convertido", color: "bg-green-100 text-green-800" },
}

export const LEAD_CHANNELS = [
  "Pago",
  "Orgânico",
  "Direto",
  "Referência",
]

export const BUDGET_RANGES = [
  { label: "Até R$ 5.000", min: 0, max: 5000 },
  { label: "R$ 5.000 - R$ 10.000", min: 5000, max: 10000 },
  { label: "R$ 10.000 - R$ 25.000", min: 10000, max: 25000 },
  { label: "R$ 25.000 - R$ 50.000", min: 25000, max: 50000 },
  { label: "Acima de R$ 50.000", min: 50000, max: Infinity },
]
