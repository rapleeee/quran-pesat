export type SupportMethodType = "payment_link" | "bank_transfer" | "ewallet";

export interface SupportMethod {
  id: string;
  title: string;
  subtitle: string;
  type: SupportMethodType;
  accountName?: string;
  copyValue?: string;
  actionLabel?: string;
  actionUrl?: string;
  isConfigured: boolean;
}

export interface DeveloperSupportSummary {
  developerName: string;
  supportTitle: string;
  supportDescription: string;
  monthlyTarget: number;
  currentSupport: number;
  lastUpdatedLabel: string;
}
