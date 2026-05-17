# 🌱 Build stage: Compile the application
FROM eclipse-temurin:17-jdk-alpine AS builder

# 📁 Set working directory
WORKDIR /app

# 📦 Install Maven
RUN apk add --no-cache maven

# 📋 Copy Maven configuration and source code
COPY pom.xml .
COPY src ./src

# 🛠️ Build the application, skipping tests to save time
RUN mvn clean package -DskipTests

# 🌱 Final stage: Run the application
FROM eclipse-temurin:17-jre-alpine

# 📁 Set working directory
WORKDIR /app

# 🔐 Install CA certificates for HTTPS/SSL (needed for smtp.gmail.com)
RUN apk add --no-cache ca-certificates && update-ca-certificates

# 👤 Create a non-root user
RUN adduser -D -h /home/myuser -s /bin/sh myuser

# 📦 Copy the built JAR from the builder stage
COPY --from=builder --chown=myuser:myuser /app/target/Employee-Module-0.0.1-SNAPSHOT.jar app.jar

# 🔐 Run as non-root user
USER myuser

# 🌐 Expose the port (8084 for employee-module)
EXPOSE 8084

# 🚀 Run the application with optimized JVM settings
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]