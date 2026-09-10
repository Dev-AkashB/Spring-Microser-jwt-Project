FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
ARG JAR_FILE=product-service/target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app.jar"]
