FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
ARG JAR_FILE=eureka-server/target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app.jar"]
