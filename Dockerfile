# ---- Stage 1: Build ----
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom first (for dependency caching)
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source and build the JAR (skipping tests for speed)
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
WORKDIR /app

# Copy only the built JAR from Stage 1
COPY --from=builder /app/target/APP.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
