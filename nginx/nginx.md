# Nginx

- [Nginx](#nginx)
  - [Intro](#intro)


## Intro

Example config:

```conf
# Main context
# http
# events

# Block directive, context
server {
  # Simple directive
  listen 80
  listen [::]:80;

  server_name testsitio.dev.devurai.com;

  root /home/testsitio/dist;
  index index.html;

  # Block directive, context
  location / {
    try_files $uri $uri/ =404;
  }
}
```

