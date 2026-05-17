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
# Image JRE Java 17 basée sur Alpine (plus légère)
FROM eclipse-temurin:17-jre-alpine

# Définir le dossier de travail
WORKDIR /app

# Créer un utilisateur non-root avec home et shell sh
RUN adduser -D -h /home/myuser -s /bin/sh myuser

# Copier le JAR avec les bonnes permissions
# 📦 Copy the built JAR from the builder stage
COPY --from=builder --chown=myuser:myuser /app/target/eureka-server-0.0.1-SNAPSHOT.jar app.jar
# Passer à l'utilisateur non-root
USER myuser

# Exposer le port d’Eureka
EXPOSE 8761

# Lancer l’application avec options JVM adaptées aux conteneurs
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
