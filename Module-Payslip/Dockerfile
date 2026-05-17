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




# Image de base OpenJDK 17 JRE Alpine (plus légère)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root avec home et shell sh
RUN adduser -D -h /home/myuser -s /bin/sh myuser

# Copier le JAR avec la bonne propriété
COPY --from=builder --chown=myuser:myuser /app/target/Module-Payslip-0.0.1-SNAPSHOT.jar app.jar

# Utiliser l'utilisateur non-root
USER myuser

# Exposer le port du microservice
EXPOSE 8083

# Lancer l'application avec options JVM adaptées
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
