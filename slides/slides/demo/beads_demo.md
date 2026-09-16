---

## Beads system wide setup

```
mkdir -p ~/.beads/shared-server
```

content `~/.beads/shared-server/server.yaml`
```
log_level: info
listener:
  host: 0.0.0.0
  port: 3307
data_dir: /Users/r/.beads/shared-server
behavior:
  autocommit: true
```

Start
`dolt sql-server --config ~/.beads/shared-server/server.yaml`

## Beads repo setup

```
bd init -p PROJ \
--server --external \
--server-host 127.0.0.1 --server-port 3307 --server-user root \
--database proj
``

.sandcastle/.env
```
BEADS_DOLT_SERVER_MODE=1
BEADS_DOLT_SERVER_HOST=host.docker.internal
BEADS_DOLT_SERVER_PORT=3307
BEADS_DOLT_SERVER_USER=root
BEADS_DOLT_AUTO_START=0
```