# Build stage
FROM maven:3.9.6-eclipse-temurin-21-jammy AS builder

WORKDIR /app

# Copy the entire project
COPY . .

# Build the JAR
RUN cd Backend/recall && mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/Backend/recall/target/recall-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE ${PORT:-8080}

# Run the application
CMD ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
