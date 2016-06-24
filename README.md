# CirrusDbQL - Cirrus Clients.DB REST API version 0.0.2
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Setup and Start the API

#### 1. Start a MongoDB instance
First you need to make sure that you have an MonogoDB running, if not follow this instructions: [Vagrantfile-Mongodb](https://github.com/post-cirrus/Vagrant-Basic-Templates/blob/master/Vagrantfile-Mongodb/README.md)

#### 2. Pull CirrusDbQL REST API version from git
```
$ git clone -b cirrusdbql-0.0.1 --single-branch https://github.com/post-cirrus/Backend_Modules
$ cd Backend_Modules
$ cd CirrusDbQL
```

#### 3. Build a Docker container

Make sure the Docker Daemon is runnng on your machine

```
$ docker build -t cirrus/cirrusdbqlapi-0.0.1 .
$ docker images

REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
cirrus/cirrusdbqlapi-0.0.1   latest              c39d731437e3        About a minute ago   672.1 MB
node                         argon               1f9967dbfc82        13 days ago          647.2 MB
```

#### 4. Run the REST API

Running your image with -d runs the container in detached mode, leaving the container running in the background.
The -p flag redirects a public port to a private port inside the container.
The --add-host will map the name 'db.cirrus.io' to IP 192.168.82.104. (Hint: you can have a mulitple of this entry. Example: --add-host foo:10.10.10.1 --add-host bar:10.10.10.2)

```
$ docker run --add-host db.cirrus.io:192.168.82.104 -p 10083:10083 -d cirrus/cirrusdbqlapi-0.0.1
$ docker ps

CONTAINER ID        IMAGE                        COMMAND             CREATED             STATUS              PORTS                      NAMES
6dd230b90acf        cirrus/cirrusdbqlapi-0.0.1   "npm start"         17 seconds ago      Up 3 seconds        0.0.0.0:10083->10083/tcp   gloomy_hawking

$ docker logs <container id>

2016-06-07 18:04:45|INFO|CirrusDbQL:0.0.1|Starting CirrusDbQL server on port 10083

```

## Important

In order to connect to the API you need to use the Docker virtual machine IP. When starting
the Docker a virtual machine is created and an IP is assigned to the machine.

```
$ docker-machine ip
192.168.99.101
```

## API Documentation

The REST API documentation is included in the CirrusDbQL API and can be reached by opening a browser
and navigating to url: http://docker_daemon_ip:10083/v1/doc.

```
open http://192.168.99.101:10083/v1/doc
```

## Hints
* curl -i http://192.168.99.101:10083/v1/users
* To test out the API you can use [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop), which can be installed in Chrome.
* Docker :
```
$ docker stop <container id>
$ docker restart <container id>
```
