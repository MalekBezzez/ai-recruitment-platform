FROM camunda/camunda-bpm-platform:7.23.0

# Copie tes processus BPMN (à adapter selon où tu les stockes)
COPY ./processes/*.bpmn /camunda/configuration/resources/
EXPOSE 8080
# Si tu as un JAR ou WAR à ajouter (optionnel)
# COPY ./your-custom.jar /camunda/configuration/lib/

