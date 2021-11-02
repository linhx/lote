# lote
Linhx's note

## Init mongo

Access mongodb in docker
```shell
sudo docker exec -it lote_mongo_1 mongod --u root --p root
```
Then run
```javascript
rs.initiate();
```

