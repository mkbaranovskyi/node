# AWS + nginx + domain

- [AWS + nginx + domain](#aws--nginx--domain)
  - [The general idea](#the-general-idea)
  - [nginx](#nginx)

***

## The general idea

1. Create AWS EC2 instance
2. Register your domain
3. Log in into your EC2 via SSH. Install Docker and nginx
4. Configure `docker-compose.yaml`, add `.env`
5. Configure nginx to work with your domain

***

## nginx

1. Go to the [DigitalOcean quick config](https://www.digitalocean.com/community/tools/nginx) 
2. Provide your domain (along with subdomain) in the Server settings. Leave other options with default values.
3. Follow the instructions at the bottom of the page (download, SSL init, Certbot, Go live).
4. Download your config, zip it and `scp` to your EC2 instance. Unzip and paste into `/etc/nginx`. Again. follow the instructions on DigitalOcean.
5. Setup your config files. Usually on deb-based disctros you would create config files in `/etc/nginx/sites-available1` and then provide `symlinks` to them in `/etc/nginx/sites-enablec`. Examples below:

`api-staging.max-domain.com.conf`

```
server {
    ssl off;
   listen                  443; # ssl http2;
   listen                  [::]:443; # ssl http2;
   server_name             api-staging.max-domain.com;

    # SSL
   # #;#ssl_certificate         /etc/letsencrypt/live/max-domain.com/fullchain.pem;
   # #;#ssl_certificate_key     /etc/letsencrypt/live/max-domain.com/privkey.pem;
   # #;#ssl_trusted_certificate /etc/letsencrypt/live/max-domain.com/chain.pem;

    # security
    include                 nginxconfig.io/security.conf;

    # logging
    access_log              /var/log/nginx/max-domain.com.access.log;
    error_log               /var/log/nginx/max-domain.com.error.log warn;

    # reverse proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        include    nginxconfig.io/proxy.conf;
    }

    # additional config
    include nginxconfig.io/general.conf;
}

# HTTP redirect
server {
    ssl off;
    listen      80;
    listen      [::]:80;
    server_name api-staging.max-domain.com;
   # include     nginxconfig.io/letsencrypt.conf;

    location / {
        return 301 https://api-staging.max-domain.com$request_uri;
    }
}
```

`max-domain.com.conf`

```
server {
    listen                  443 ssl http2;
    listen                  [::]:443 ssl http2;
    server_name             api-staging.max-domain.com;

    # SSL
    ssl_certificate         /etc/letsencrypt/live/api-staging.max-domain.com/fullchain.pem;
    ssl_certificate_key     /etc/letsencrypt/live/api-staging.max-domain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/api-staging.max-domain.com/chain.pem;

    # security
    include                 nginxconfig.io/security.conf;

    # logging
    access_log              /var/log/nginx/api-staging.max-domain.com.access.log;
    error_log               /var/log/nginx/api-staging.max-domain.com.error.log warn;

    # reverse proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        include    nginxconfig.io/proxy.conf;
    }

    location /openapi.yaml {
        proxy_pass http://127.0.0.1:3001;
        include    nginxconfig.io/proxy.conf;
    }

    location /docs {
         proxy_pass http://127.0.0.1:3001;
         include    nginxconfig.io/proxy.conf;
    }


    # additional config
    include nginxconfig.io/general.conf;
}

# HTTP redirect
server {
    listen      80;
    listen      [::]:80;
    server_name .api-staging.max-domain.com;
    include     nginxconfig.io/letsencrypt.conf;

    location / {
        return 301 https://api-staging.max-domain.com$request_uri;
    }
}
```