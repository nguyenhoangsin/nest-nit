```
docker run --name redis -d -p 6379:6379 -v redis-data:/data redis redis-server --requirepass 1
docker run --name mysql -e MYSQL_ROOT_PASSWORD=1 -p 3306:3306 -v mysql-data:/var/lib/mysql -d mysql
docker run --name mongodb -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=1 -p 27017:27017 -v mongodb-data:/data/db -d mongo

docker-compose up -d
docker-compose down -v
```
