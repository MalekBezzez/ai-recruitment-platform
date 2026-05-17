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
COPY --from=builder --chown=myuser:myuser /app/target/Module-Project-0.0.1-SNAPSHOT.jar app.jar

# Passer à l'utilisateur non-root
USER myuser

# Exposer le port du microservice
EXPOSE 8082

# Lancer l'application avec options JVM adaptées aux conteneurs
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
