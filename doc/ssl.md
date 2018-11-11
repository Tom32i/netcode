# SSL and custom hostname

In production, you'll want your server to be run behind a real domain name and possibly on a secured SSL connection.

So instead of connecting the `ws://localhost:8000`, you'll want something like `wss://my-game.io/live/`.

Here's how to configure an Nginx proxy server to do just that:

- Server setup : `new Server(8042, 'localhost', new BinaryEncoder(events));`
- Client setup : `new Client('wss://my-game.io/live/', new BinaryEncoder(events))`
- Nginx configuration :

```nginx
server {
    listen 443 ssl http2;
    server_name my-game.io;
    root /home/tom32i/my-game/client;
    # ... the rest of the server and SSL configuration

    location /live/ {
        # Proxy for the running node server
        proxy_pass http://localhost:8042/;# The actual node server adress
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        # Serve the static HTML/JS/CSS assets
        index index.html;
    }
}
```
