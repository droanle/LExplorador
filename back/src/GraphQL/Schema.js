const entityType = require('./entityTypes')
const Mutations = require("./Mutations");
const Queries = require("./Queries");
var { schemaComposer } = require('graphql-compose');

entityType(schemaComposer);
Mutations(schemaComposer);
Queries(schemaComposer);

const schema = schemaComposer.buildSchema();

module.exports = schema;