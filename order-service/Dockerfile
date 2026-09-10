FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
ARG JAR_FILE=order-service/target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "/app.jar"]
