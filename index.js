const { Model } = require('objection');
const Knex = require('knex');
const hashid = require('objection-hashid');
const config = require('./knexfile');

const knex = Knex(config);

Model.knex(knex);

class BaseModel extends hashid(Model) {
  static hashIdSalt = 'asalt';
  static hashIdMinLength = 8;
}

class Person extends BaseModel {
  static tableName = 'persons';
}

class Pet extends BaseModel {
  static tableName = 'pets';
  static hashedFields = ['person_id'];
}

async function main() {
  const jake = await Person.query().insert({ name: 'Jake' });
  console.log('jake', jake);
  console.log('jake.hashid', jake.hashid);
  const pixel = await Pet.query().insert({ name: 'Pixel', person_id: jake.hashId });
}

main().catch(err => console.error(err)).finally(() => knex.destroy());
