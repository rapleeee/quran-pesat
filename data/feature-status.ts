import {
  FeatureBlockingStatus,
  FeatureStatus,
  FeatureStatusRule,
} from "@/types/feature-status";

const FEATURE_STATUS_RULES: FeatureStatusRule[] = [
  {
    routePattern: "/screen/ayat/[nomor]/[ayat]",
    status: "develop",
    title: "Fitur Sedang Develop",
    message:
      "Buka detail ayat per halaman sedang dikembangkan. Sementara gunakan halaman surah.",
  },
];

const FEATURE_ROUTE_RULES = FEATURE_STATUS_RULES.map((rule) => ({
  ...rule,
  regex: buildPatternRegex(rule.routePattern),
}));

function normalizeRoute(route: string): string {
  const [pathWithoutQuery] = route.split("?");
  const [pathWithoutHash] = pathWithoutQuery.split("#");
  const normalized = pathWithoutHash.endsWith("/")
    ? pathWithoutHash.slice(0, -1)
    : pathWithoutHash;
  return normalized || "/";
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPatternRegex(routePattern: string): RegExp {
  const normalizedPattern = normalizeRoute(routePattern);
  const escapedPattern = escapeRegex(normalizedPattern).replace(
    /\\\[[^\]]+\\\]/g,
    "[^/]+",
  );
  return new RegExp(`^${escapedPattern}$`);
}

function getMatchedRule(route?: string): FeatureStatusRule | null {
  if (!route) {
    return null;
  }

  const normalizedRoute = normalizeRoute(route);
  for (const rule of FEATURE_ROUTE_RULES) {
    if (rule.regex.test(normalizedRoute)) {
      return rule;
    }
  }
  return null;
}

export function getFeatureStatusByRoute(route?: string): FeatureStatus {
  return getMatchedRule(route)?.status ?? "active";
}

export function getFeatureWarningByRoute(route?: string): {
  status: FeatureBlockingStatus;
  title: string;
  message: string;
} | null {
  const rule = getMatchedRule(route);
  if (!rule) {
    return null;
  }

  return {
    status: rule.status,
    title: rule.title,
    message: rule.message,
  };
}
