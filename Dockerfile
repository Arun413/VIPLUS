FROM nginx:alpine

# Remove default files
RUN rm -rf /usr/share/nginx/html/*

# Copy files
COPY . /usr/share/nginx/html/

# Fix permissions (THIS IS THE KEY FIX)
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]