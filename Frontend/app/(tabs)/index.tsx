import { Header } from "@/components/header";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/theme/ThemeProvider";
import { Colors } from "@/constants/theme";
import React from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  View,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import {
  Camera,
  Users,
  Clock,
  Heart,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react-native";

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

  const FeatureCard = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: any;
    title: string;
    description: string;
  }) => (
    <View
      style={[
        styles.featureCard,
        {
          backgroundColor: themeMode === "dark" ? "#1F2937" : "#F3F4F6",
          borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: themeMode === "dark" ? "#7C3AED" : "#EDE9FE" },
        ]}
      >
        <Icon
          size={24}
          color={themeMode === "dark" ? "#FFF" : "#7C3AED"}
          strokeWidth={2}
        />
      </View>
      <ThemedText
        style={styles.featureTitle}
        type="subtitle"
      >
        {title}
      </ThemedText>
      <ThemedText style={styles.featureDescription}>{description}</ThemedText>
    </View>
  );

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

          {/* CTA Buttons */}
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

       
        <View style={styles.showcaseSection}>
          <View
            style={[
              styles.mockupContainer,
              {
                backgroundColor: themeMode === "dark" ? "#111827" : "#F9FAFB",
                borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
              },
            ]}
          >
            <View
              style={[
                styles.mockupPhone,
                {
                  backgroundColor: themeMode === "dark" ? "#0F172A" : "#FFFFFF",
                  borderColor: themeMode === "dark" ? "#1F2937" : "#D1D5DB",
                },
              ]}
            >
              
              <View style={styles.photoGrid}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.photoPlaceholder,
                      {
                        backgroundColor: `hsl(${
                          260 + i * 10
                        }, 80%, 60%)`,
                        opacity: 0.8,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

      
        <View style={styles.featuresSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            How It Works
          </ThemedText>

          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </View>
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
  showcaseSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },
  mockupContainer: {
    borderRadius: 20,
    padding: 16,
    width: "100%",
    maxWidth: 300,
    borderWidth: 1,
  },
  mockupPhone: {
    borderRadius: 16,
    borderWidth: 8,
    aspectRatio: 9 / 16,
    overflow: "hidden",
    padding: 8,
  },
  photoGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photoPlaceholder: {
    width: "48%",
    borderRadius: 8,
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
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
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
