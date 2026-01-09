import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/theme/ThemeProvider";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Camera,
  Clock,
  Heart,
  Shield,
  Users,
  Zap,
} from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { themeMode } = useThemeMode();
  const colors = Colors[themeMode];

  const features = [
    {
      id: "1",
      icon: Camera,
      title: "Instant Capture",
      description: "Share photos seamlessly during your event",
    },
    {
      id: "2",
      icon: Users,
      title: "Smart Grouping",
      description: "Find your photos with face & hashtag search",
    },
    {
      id: "3",
      icon: Clock,
      title: "Event Timer",
      description: "Countdown to the perfect moment",
    },
    {
      id: "4",
      icon: Heart,
      title: "Swipe to Save",
      description: "Curate your favorites like a pro",
    },
    {
      id: "5",
      icon: Shield,
      title: "Private & Secure",
      description: "Photos stay local until you save them",
    },
    {
      id: "6",
      icon: Zap,
      title: "Quick Join",
      description: "Enter a code in 10 seconds, start sharing",
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ThemedText type="title" style={styles.heroTitle}>
            Capture Every Moment
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Bring everyone's photos together. No chaos. No duplicates.
          </ThemedText>

          CTA Buttons
          <View style={styles.ctaContainer}>
            {!isLoggedIn ? (
              <>
                <Pressable
                  style={[
                    styles.primaryButton,
                    { backgroundColor: "#7C3AED" },
                  ]}
                  onPress={() => router.push("/(tabs)/signup")}
                >
                  <ThemedText
                    style={styles.primaryButtonText}
                  >
                    Get Started
                  </ThemedText>
                  <ArrowRight size={20} color="white" />
                </Pressable>
                <Pressable
                  style={[
                    styles.secondaryButton,
                    {
                      borderColor: colors.tint,
                      backgroundColor:
                        themeMode === "dark" ? "#1F2937" : "#F3F4F6",
                    },
                  ]}
                  onPress={() => router.push("/(tabs)/login")}
                >
                  <ThemedText style={styles.secondaryButtonText}>
                    Sign In
                  </ThemedText>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={[styles.primaryButton, { backgroundColor: "#7C3AED" }]}
                onPress={() => router.push("/(tabs)/createEvent")}
              >
                <ThemedText style={styles.primaryButtonText}>
                  Create Event
                </ThemedText>
                <ArrowRight size={20} color="white" />
              </Pressable>
            )}
          </View>
        </View>



        <View style={styles.featuresSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            How It Works
          </ThemedText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContainer}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <View
                  key={feature.id}
                  style={[
                    styles.pillCard,
                    {
                      backgroundColor:
                        themeMode === "dark" ? "#1F2937" : "#F3F4F6",
                      borderColor:
                        themeMode === "dark" ? "#374151" : "#E5E7EB",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.pillIcon,
                      {
                        backgroundColor:
                          themeMode === "dark" ? "#7C3AED" : "#EDE9FE",
                      },
                    ]}
                  >
                    <Icon
                      size={20}
                      color={themeMode === "dark" ? "#FFF" : "#7C3AED"}
                      strokeWidth={2}
                    />
                  </View>
                  <ThemedText style={styles.pillTitle}>
                    {feature.title}
                  </ThemedText>
                </View>
              );
            })}
          </ScrollView>
        </View>


        <View style={styles.stepsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Get Started in 4 Steps
          </ThemedText>

          <View style={styles.stepsList}>
            {[
              {
                num: "1",
                title: "Create Event",
                desc: "Host sets the event time & generates a code",
              },
              {
                num: "2",
                title: "Share Code",
                desc: "Attendees enter the code to join",
              },
              {
                num: "3",
                title: "Snap Photos",
                desc: "Everyone uploads their best moments",
              },
              {
                num: "4",
                title: "Swipe & Save",
                desc: "Choose favorites & save locally",
              },
            ].map((step) => (
              <View
                key={step.num}
                style={[
                  styles.stepCard,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F2937" : "#F3F4F6",
                    borderColor:
                      themeMode === "dark" ? "#374151" : "#E5E7EB",
                  },
                ]}
              >
                <View
                  style={[
                    styles.stepNumber,
                    { backgroundColor: "#7C3AED" },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {step.num}
                  </ThemedText>
                </View>
                <View style={styles.stepContent}>
                  <ThemedText style={styles.stepTitle} type="subtitle">
                    {step.title}
                  </ThemedText>
                  <ThemedText style={styles.stepDesc}>{step.desc}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>


        {!isLoggedIn && (
          <View style={styles.bottomCtaSection}>
            <ThemedText type="subtitle" style={styles.bottomCtaTitle}>
              Ready to collect your memories?
            </ThemedText>
            <Pressable
              style={[
                styles.primaryButton,
                styles.fullWidthButton,
                { backgroundColor: "#7C3AED" },
              ]}
              onPress={() => router.push("/(tabs)/signup")}
            >
              <ThemedText style={styles.primaryButtonText}>
                Create Your First Event
              </ThemedText>
            </Pressable>
          </View>
        )}


        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    paddingTop: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  pillsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 4,
  },
  pillCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  pillIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  pillTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepsSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    opacity: 0.7,
  },
  bottomCtaSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    gap: 20,
  },
  bottomCtaTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  fullWidthButton: {
    width: "100%",
  },
});
