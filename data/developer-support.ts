import {
  DeveloperSupportSummary,
  SupportMethod,
} from "@/types/developer-support";

const MIDTRANS_PAYMENT_LINK =
  process.env.EXPO_PUBLIC_MIDTRANS_PAYMENT_LINK?.trim() ?? "";

export const developerSupportSummary: DeveloperSupportSummary = {
  developerName: "Rafli Maulana",
  supportTitle: "Dukung Pengembangan Quran Pesat",
  supportDescription:
    "Quran Pesat adalah aplikasi gratis tanpa iklan yang dibuat dengan penuh cinta",
  monthlyTarget: 1500000,
  currentSupport: 420000,
  lastUpdatedLabel: "Update • Februari 2026",
};

export const supportMethods: SupportMethod[] = [
  {
    id: "payment-link",
    title: "Midtrans Checkout",
    subtitle: "Bayar lewat Midtrans (QRIS / e-wallet / transfer)",
    type: "payment_link",
    actionLabel: "Bayar via Midtrans",
    actionUrl: MIDTRANS_PAYMENT_LINK,
    isConfigured: MIDTRANS_PAYMENT_LINK.length > 0,
  },
  {
    id: "bank-transfer",
    title: "Transfer Bank",
    subtitle: "Transfer langsung ke rekening developer",
    type: "bank_transfer",
    accountName: "Rafli Maulana",
    copyValue: "1234567890",
    isConfigured: true,
  },
  {
    id: "ewallet",
    title: "E-Wallet",
    subtitle: "DANA / OVO / GoPay",
    type: "ewallet",
    accountName: "Rafli Maulana",
    copyValue: "081234567890",
    isConfigured: true,
  },
];

export const supportNotes: string[] = [
  "Ini dukungan untuk developer, bukan penggalangan donasi lembaga.",
  "Penyaluran ke pihak lain sepenuhnya keputusan pribadi developer.",
];
