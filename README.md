# Semantic_Search_Engine

Files discription :
Query_search_ipynb_files containes the fintuning model , embedding extraction and LSH notebooks 

EDA and classical modeling contains the eda notebook , and key word based search notebooks 

frontend-react conatins the files relating the react app for QHunt

api-services has the backend part of the code 

Presentaion link : https://docs.google.com/presentation/d/1HT64rewraCcdUnWyvN19qVINRYuxdQHPmnjP-qumM1E/edit?usp=share_link , https://prezi.com/view/rT4oRmfCjLpChGceaiXL/

Medium Article link : https://medium.com/@fuzzymark1221/creating-an-ai-powered-semantic-search-engine-ea82fe9de8e7

#Semantic_Search_Engine - Deployment to GCP (Manual)

# Images on docker hub : 
api-services :amanjolly1994/sse-api-server:latest

frontend-react-app: amanjolly1994/sse-frontend-react-v1:latest

## Running Docker Containers on VM

### Install Docker on VM
* Create a VM Instance from [GCP](https://console.cloud.google.com/compute/instances)
* When creating the VM, you can select all the default values but ensure to select:
	- Allow HTTP traffic
	- Allow HTTPS traffic
* SSH into your newly created instance
Install Docker on the newly created instance by running
* `curl -fsSL https://get.docker.com -o get-docker.sh`
* `sudo sh get-docker.sh`
Check version of installed Docker
* `sudo docker --version`

### Create folders and give permissions
* `sudo mkdir persistent-folder`
* `sudo mkdir secrets`
* `sudo mkdir -p conf/nginx`
* `sudo chmod 0777 persistent-folder`
* `sudo chmod 0777 secrets`
* `sudo chmod -R 0777 conf`

```
sudo mkdir persistent-folder
sudo mkdir secrets
sudo mkdir -p conf/nginx
sudo chmod 0777 persistent-folder
sudo chmod 0777 secrets
sudo chmod -R 0777 conf
```

### Add secrets file
* Create a file `bucket-reader.json` inside `secrets` folder with the secrets json provided
* You can create a file using the echo command:
```
echo '<___Provided Json Key___>' > secrets/bucket-reader.json
```


### Create Docker network
```
sudo docker network create sse-app
```

### Run api-service
Run the container using the following command
```
sudo docker run -d --name api-service \
--mount type=bind,source="$(pwd)/persistent-folder/",target=/persistent \
--mount type=bind,source="$(pwd)/secrets/",target=/secrets \
-p 9000:9000 \
-e GOOGLE_APPLICATION_CREDENTIALS=/secrets/bucket-reader.json \
-e GCP_PROJECT=ai5-project \
-e GCP_ZONE=us-central1-a --network sse-app amanjolly1994/sse-api-server:latest
```

If you want to run in interactive mode like we id in development:
```
sudo docker run --rm -ti --name api-service --mount type=bind,source="$(pwd)/persistent-folder/",target=/persistent --mount type=bind,source="$(pwd)/secrets/",target=/secrets -p 9000:9000 -e GOOGLE_APPLICATION_CREDENTIALS=/secrets/bucket-reader.json -e GCP_PROJECT=ai5-project -e GCP_ZONE=us-central1-a -e DEV=1 --network sse-app amanjolly1994/sse-api-server:latest
```

### Run frontend
Run the container using the following command
```
sudo docker run -d --name frontend -p 3000:80 --network amanjolly1994/sse-frontend-react-v1:latest
```

### Add NGINX config file
* Create `nginx.conf`
```
echo 'user  nginx;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
}
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    tcp_nopush     on;
    keepalive_timeout  65;
	types_hash_max_size 2048;
	server_tokens off;
    gzip  on;
	gzip_disable "msie6";

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;

	server {
		listen 80;

		server_name localhost;

		error_page   500 502 503 504  /50x.html;
		location = /50x.html {
			root   /usr/share/nginx/html;
		}
		# API
		location /api {
			rewrite ^/api/(.*)$ /$1 break;
			proxy_pass http://api-service:9000;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header X-Forwarded-Proto $scheme;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header Host $http_host;
			proxy_redirect off;
			proxy_buffering off;
		}

		# Frontend
		location / {
			rewrite ^/(.*)$ /$1 break;
			proxy_pass http://frontend;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header X-Forwarded-Proto $scheme;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header Host $http_host;
			proxy_redirect off;
			proxy_buffering off;
		}
	}
}
' > conf/nginx/nginx.conf
```

### Run NGINX Web Server
Run the container using the following command
```
sudo docker run -d --name nginx -v $(pwd)/conf/nginx/nginx.conf:/etc/nginx/nginx.conf -p 80:80 --network mushroom-app nginx:stable
```

You can access the deployed API using `http://<Your VM IP Address>/`


## Debugging Containers

If you want to debug any of the containers to see if something is wrong

* View running containers
```
sudo docker container ls
```

* View images
```
sudo docker image ls
```

* View logs
```
sudo docker container logs api-service -f
sudo docker container logs frontend -f
sudo docker container logs nginx -f
```

* Get into shell
```
sudo docker exec -it api-service /bin/bash
sudo docker exec -it frontend /bin/bash
sudo docker exec -it nginx /bin/bash
```

