# objection-hashid-investigation

I ran into an issue when using objection-hashid related to the hashedFields static model property. It seemed like the hashed fields we being respected, but the decoding wasn't happening properly.

The index.js of this project reproduces the issue. We create a `person` and then create a `pet` with its `person_id` fk pointing to the created person. The Pet model has `static hashedFields = ['person_id']`. When it tries to insert the pet record using `person_id: jake.hashId`, postgres errors. Here's the output

```
jake Person { name: 'Jake', id: 4 }
jake.hashId gMJEqJK3
DataError: insert into "pets" ("name", "person_id") values ($1, $2) returning "id" - invalid input syntax for type integer: "{"4"}"
    at wrapError (/opt/node_app/app/node_modules/db-errors/lib/dbErrors.js:19:14)
    at handleExecuteError (/opt/node_app/app/node_modules/objection/lib/queryBuilder/QueryBuilder.js:1489:32)
    at Object.execute (/opt/node_app/app/node_modules/objection/lib/queryBuilder/QueryBuilder.js:670:20)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async main (/opt/node_app/app/index.js:31:17) {
  nativeError: error: insert into "pets" ("name", "person_id") values ($1, $2) returning "id" - invalid input syntax for type integer: "{"4"}"
      at Parser.parseErrorMessage (/opt/node_app/app/node_modules/pg-protocol/dist/parser.js:287:98)
      at Parser.handlePacket (/opt/node_app/app/node_modules/pg-protocol/dist/parser.js:126:29)
      at Parser.parse (/opt/node_app/app/node_modules/pg-protocol/dist/parser.js:39:38)
      at Socket.<anonymous> (/opt/node_app/app/node_modules/pg-protocol/dist/index.js:11:42)
      at Socket.emit (node:events:394:28)
      at addChunk (node:internal/streams/readable:312:12)
      at readableAddChunk (node:internal/streams/readable:287:9)
      at Socket.Readable.push (node:internal/streams/readable:226:10)
      at TCP.onStreamRead (node:internal/stream_base_commons:190:23) {
    length: 106,
    severity: 'ERROR',
    code: '22P02',
    detail: undefined,
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    column: undefined,
    dataType: undefined,
    constraint: undefined,
    file: 'numutils.c',
    line: '320',
    routine: 'pg_strtoint32'
  },
  client: 'postgres'
}
```

After attempting to insert using the hashId, we get an error complaining about an invalid integer: `invalid input syntax for type integer: "{"4"}"`. It has the correct decoded ID, it's just in the wrong form.

I fixed the issue in a fork. If you change the dependency in this project to `"objection-hashid": "jakeorr/objection-hashid#12a2d21528ba0760596f1ec3c4cfa2364069f5c2",`, the issue no longer occurs.

## Running this project

`docker compose build`
`docker compose up db`
`docker compose run --rm app /bin/bash`
- from in the container run `knex migrate:latest`
- then just run `node .` inside the container
