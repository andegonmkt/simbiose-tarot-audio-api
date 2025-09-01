FROM node:18-bullseye

# instala python, pip e ffmpeg (necessários pro yt-dlp)
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg && \
    pip3 install --no-cache-dir yt-dlp && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
