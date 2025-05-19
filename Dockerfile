# Use a base image with JDK 21 for the final image
FROM openjdk:21-jdk

WORKDIR /app

# Copy the JAR file from the TeamCity build artifacts
COPY build/libs/wuung-*-SNAPSHOT.jar app.jar

# Set the entry point
ENTRYPOINT ["java", "-jar", "app.jar"]