export type FeatureStatus = "active" | "develop" | "maintenance";

export type FeatureBlockingStatus = Exclude<FeatureStatus, "active">;

export type FeatureStatusRule = {
  routePattern: string;
  status: FeatureBlockingStatus;
  title: string;
  message: string;
};
