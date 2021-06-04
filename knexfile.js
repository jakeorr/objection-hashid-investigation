module.exports = {
  client: 'pg',
  connection: {
    host: 'db',
    database: 'dev',
    user: 'dev',
    password: 'dev',
    charset: 'utf8',
  },
  migrations: {
    directory: `${__dirname}/migrations`,
  },
};
