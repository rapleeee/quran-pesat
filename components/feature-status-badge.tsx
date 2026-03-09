import { FeatureBlockingStatus } from "@/types/feature-status";
import React from "react";
import { Text, View } from "react-native";

type FeatureStatusBadgeProps = {
  status: FeatureBlockingStatus;
};

const BADGE_CONFIG: Record<
  FeatureBlockingStatus,
  {
    label: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  develop: {
    label: "DEVELOP",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.6)",
    textColor: "#b45309",
  },
  maintenance: {
    label: "MAINTENANCE",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(248, 113, 113, 0.6)",
    textColor: "#b91c1c",
  },
};

export function FeatureStatusBadge({ status }: FeatureStatusBadgeProps) {
  const config = BADGE_CONFIG[status];

  return (
    <View
      className="mt-1 rounded-md px-2 py-0.5 self-center border"
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
      }}
    >
      <Text className="text-[10px] font-semibold" style={{ color: config.textColor }}>
        {config.label}
      </Text>
    </View>
  );
}
