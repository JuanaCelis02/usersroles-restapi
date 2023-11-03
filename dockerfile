# Utiliza una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración de la aplicación
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que se ejecutará tu aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["node", "src/index.js"]