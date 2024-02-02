## Developement

```bash
make build
```

or

```bash
docker-compose up --build
```


## http endpoints

```http
GET /api/wallet/balance/1 HTTP/1.1
Host: localhost:3000
```
```http
POST /api/wallet/money HTTP/1.1
Content-Type: application/json
Host: localhost:3000

{
  "user_id": 1,
  "amount": 1
}
```
```http
GET /api/audit/ HTTP/1.1
Host: localhost:3001
```

or you can use [requests.http](https://github.com/soltanireza65/daal-challenge/blob/main/requests.http)