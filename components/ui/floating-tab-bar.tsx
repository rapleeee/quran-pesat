import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabItemProps {
  route: any;
  index: number;
  state: any;
  descriptors: any;
  navigation: any;
}

function TabItem({
  route,
  index,
  state,
  descriptors,
  navigation,
}: TabItemProps) {
  const { options } = descriptors[route.key];
  const isFocused = state.index === index;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  const color = isFocused ? "#728d8d" : "#9ca3af";

  return (
    <Pressable
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
    >
      <View
        style={[styles.iconContainer, isFocused && styles.iconContainerActive]}
      >
        {options.tabBarIcon?.({ color, focused: isFocused, size: 24 })}
      </View>
      <Text
        style={[styles.label, { color }, isFocused && styles.labelActive]}
        numberOfLines={1}
      >
        {options.title || route.name}
      </Text>
    </Pressable>
  );
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Filter out hidden tabs (explore/kalender)
  const visibleRoutes = state.routes.filter((route) => {
    // Hide explore tab (Kalender is removed)
    return route.name !== "explore";
  });

  const handleAIPress = () => {
    router.push("/screen/ai-chat");
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.rowContainer}>
        {/* Main Tab Bar */}
        <View style={[styles.glassOuter, { flex: 1 }]}>
          <BlurView
            intensity={80}
            tint="systemThinMaterialLight"
            style={styles.blurContainer}
          >
            <View style={styles.glassOverlay} />
            <View style={styles.tabsWrapper}>
              {visibleRoutes.map((route) => {
                const actualIndex = state.routes.findIndex(
                  (r) => r.key === route.key,
                );
                return (
                  <TabItem
                    key={route.key}
                    route={route}
                    index={actualIndex}
                    state={state}
                    descriptors={descriptors}
                    navigation={navigation}
                  />
                );
              })}
            </View>
          </BlurView>
        </View>

        {/* AI Floating Button */}
        <View style={styles.aiButtonOuter}>
          <BlurView
            intensity={80}
            tint="systemThinMaterialLight"
            style={styles.aiBlurContainer}
          >
            <View style={styles.aiGlassOverlay} />
            <Pressable onPress={handleAIPress} style={styles.aiButton}>
              <View style={styles.aiIconContainer}>
                <Sparkles
                  size={22}
                  color="#9ca3af"
                  fill="#9ca3af"
                  fillOpacity={0.2}
                />
              </View>
              <Text style={styles.aiLabel}>AI</Text>
            </Pressable>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
  },
  glassOuter: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  blurContainer: {
    overflow: "hidden",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      Platform.OS === "android"
        ? "rgba(251, 245, 234, 0.92)"
        : "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(200, 200, 200, 0.3)"
        : "rgba(255, 255, 255, 0.6)",
    borderRadius: 24,
  },
  tabsWrapper: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 4,
  },
  // AI Button styles
  aiButtonOuter: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  aiBlurContainer: {
    flex: 1,
    overflow: "hidden",
  },
  aiGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      Platform.OS === "android"
        ? "rgba(251, 245, 234, 0.92)"
        : "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(200, 200, 200, 0.3)"
        : "rgba(255, 255, 255, 0.6)",
    borderRadius: 24,
  },
  aiButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  aiIconContainer: {
    padding: 4,
    borderRadius: 12,
  },
  aiLabel: {
    fontSize: 9,
    fontWeight: "500",
    marginTop: 2,
    color: "#9ca3af",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 2,
    minWidth: 50,
  },
  iconContainer: {
    padding: 4,
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 9,
    fontWeight: "500",
    marginTop: 2,
  },
  labelActive: {
    fontWeight: "700",
  },
});
