
var _ = require('underscore');
var mssql = require('mssql'); 
var Query = require('./query');
var sql = require('./sql.js');
var utils = require('./utils');

module.exports = (function () {

/**
 * MssqlAdapter
 * 
 * @module      :: MSSQL Adapter
 * @description :: MSSQL database adapter for Sails.js
 * @docs        :: https://github.com/sergeibelov/sails-mssql
 *
 * @syncable    :: true
 * @schema      :: true
 */

var dbs = {};

var adapter = {

	identity: 'sails-mssql',
	syncable: true,
	schema: true,

	registerCollection: function (collection, cb) {

		var def = _.clone(collection);
		var key = def.identity;
		var definition = def.definition || {};

		// Set a default Primary Key
		var pkName = 'id';

		// Set the Primary Key Field
		for(var attribute in definition) {

			if(!definition[attribute].hasOwnProperty('primaryKey')) continue;

			// Check if custom primaryKey value is falsy
			if(!definition[attribute].primaryKey) continue;

			// Set the pkName to the custom primaryKey value
			pkName = attribute;
		}

		// Set the primaryKey on the definition object
		def.primaryKey = pkName;

		// Store the definition for the model identity
		if(dbs[key]) return cb();
		dbs[key.toString()] = def;

		return cb();

	},

	query: function(collectionName, statement, data, cb) {
	
		if (_.isFunction(data)) {
			cb = data;
			data = null;
		}

		mssql.connect(marshalConfig(dbs[collectionName].config), function(err) {

			if (err) return cb(err);
			var request = new mssql.Request();
			request.query(statement, function(err, recordset) {
				cb(err, recordset);
			});
		});
	},

	teardown: function(cb) {
		cb();
	},

	describe: function(collectionName, cb) {

		var tableName = dbs[collectionName].identity; 
		var statement = "SELECT c.name AS ColumnName,TYPE_NAME(c.user_type_id) AS TypeName,c.is_nullable AS Nullable,c.is_identity AS AutoIncrement,ISNULL((SELECT is_unique FROM sys.indexes i LEFT OUTER JOIN sys.index_columns ic ON i.index_id=ic.index_id WHERE i.object_id=t.object_id AND ic.object_id=t.object_id AND ic.column_id=c.column_id),0) AS [Unique],ISNULL((SELECT is_primary_key FROM sys.indexes i LEFT OUTER JOIN sys.index_columns ic ON i.index_id=ic.index_id WHERE i.object_id=t.object_id AND ic.object_id=t.object_id AND ic.column_id=c.column_id),0) AS PrimaryKey,ISNULL((SELECT COUNT(*) FROM sys.indexes i LEFT OUTER JOIN sys.index_columns ic ON i.index_id=ic.index_id WHERE i.object_id=t.object_id AND ic.object_id=t.object_id AND ic.column_id=c.column_id),0) AS Indexed FROM sys.tables t INNER JOIN sys.columns c ON c.object_id=t.object_id LEFT OUTER JOIN sys.index_columns ic ON ic.object_id=t.object_id WHERE t.name='" + tableName + "'";

		mssql.connect(marshalConfig(dbs[collectionName].config), function __DESCRIBE__(err) {

			if (err) return cb(err);

			var request = new mssql.Request();
			request.query(statement, function(err, recordset) {

				if (err) return cb(err);
				if (recordset.length == 0) return cb();
				var normalizedSchema = sql.normalizeSchema(recordset);
				dbs[collectionName].schema = normalizedSchema;
				cb(null, normalizedSchema);

			});

		});
	},	

	define: function(collectionName, definition, cb) {
		
		mssql.connect(marshalConfig(dbs[collectionName].config), function __DEFINE__(err) {

			if (err) return cb(err);

			var def = dbs[collectionName];
			collectionName = def.identity;
			var schema = sql.schema(collectionName, definition);
			var statement = 'CREATE TABLE ' + collectionName + ' (' + schema + ')';

			var request = new mssql.Request();
			request.query(statement, function(err, recordset) {

				if (err) return cb(err);
				cb(null, {});

			});

		});
	},

	drop: function(collectionName, cb) {
		
		var statement = 'DROP TABLE [' + collectionName + ']';
		mssql.connect(marshalConfig(dbs[collectionName].config), function __DROP__(err) {

			if (err) return cb(err);

			var request = new mssql.Request();
			request.query(statement, function(err) {
				if (err) return cb(err);
				cb(null, {});
			});
		});
	},

	create: function(collectionName, data, cb) {

		Object.keys(data).forEach(function(value) {
			data[value] = utils.prepareValue(data[value]);
		});

		var statement = sql.insertQuery(dbs[collectionName].identity, data);
		mssql.connect(marshalConfig(dbs[collectionName].config), function __CREATE__(err) {
		
			if (err) return cb(err);

			var request = new mssql.Request();
			request.query(statement, function(err, recordsets) {
				
				var recordset = recordsets[0];
				var model = data;
				if (recordset.id) {
					model = _.extend({}, data, {
						id: recordset.id
					});
				}

				var _query = new Query(dbs[collectionName].definition);
				var values = _query.cast(model);
				cb(err, values);

			});
		});
	},

	addAttribute: function (collectionName, attrName, attrDef, cb) {
	
		if (attrName === '_waterline_dummy02492') return cb();

		var statement = sql.addColumn(dbs[collectionName].identity, attrName, attrDef);
		mssql.connect(marshalConfig(dbs[collectionName].config), function __ADDATTRIBUTE__(err) {

			if (err) return cb(err);

			var request = new mssql.Request();
			request.query(statement, function(err) {

				if (err) return cb(err);
				cb(err);

			});
		});

	},

	removeAttribute: function (collectionName, attrName, cb) {

		if (attrName === '_waterline_dummy02492') return cb();

		var statement = sql.removeColumn(dbs[collectionName].identity, attrName);
		mssql.connect(marshalConfig(dbs[collectionName].config), function __REMOVEATTRIBUTE__(err) {

			if (err) return cb(err);

			var request = new mssql.Request();
			request.query(statement, function(err) {

				if (err) return cb(err);
				cb(err);

			});
		});

	},

	find: function(collectionName, options, cb) {

		// Check if this is an aggregate query and that there is something to return
		if(options.groupBy || options.sum || options.average || options.min || options.max) {
			if(!options.sum && !options.average && !options.min && !options.max) {
				return cb(new Error('Cannot groupBy without a calculation'));
			}
		}

		var statement = sql.selectQuery(dbs[collectionName].identity, options);
		mssql.connect(marshalConfig(dbs[collectionName].config), function __FIND__(err) {

			if (err) return cb(err);

			var request = new mssql.Request();
			request.query(statement, function(err, recordset) {

				if (err) return cb(err);
				cb(null, recordset);

			});

		});
	},

	update: function(collectionName, options, values, cb) {
		
		var tableName = dbs[collectionName].identity; 
		var criteria = sql.serializeOptions(dbs[collectionName].identity, options);
		var pk = dbs[collectionName].primaryKey;
		var statement = 'SELECT [' + pk + '] FROM ' + tableName + ' ' + criteria;

		mssql.connect(marshalConfig(dbs[collectionName].config), function __UPDATE__(err) {

			if (err) return cb(err);

			var request = new mssql.Request();
			request.query(statement, function(err, recordset) {

				if (err) return cb(err);

				if (recordset.length === 0) {
					return cb(null, []);
				}

				var pks = [];
				recordset.forEach(function(row) {
					pks.push(row[pk]);
				});

				Object.keys(values).forEach(function(value) {
					values[value] = utils.prepareValue(values[value]);
				});

				statement = 'UPDATE [' + tableName + '] SET ' + sql.updateCriteria(dbs[collectionName].identity, values) + ' ';
				statement += sql.serializeOptions(dbs[collectionName].identity, options);

				request.query(statement, function(err, recordset) {

					if (err) return cb(err);

					var criteria;

					if(pks.length === 1) {
						criteria = { where: {}, limit: 1 };
						criteria.where[pk] = pks[0];
					} else {
						criteria = { where: {}};
						criteria.where[pk] = pks;
					}

					adapter.find(collectionName, criteria, function(err, models) {

						if (err) return cb(err);
						var values = [];
						var _query = new Query(dbs[collectionName].definition);

						models.forEach(function(item) {
							values.push(_query.cast(item));
						});

						cb(err, values);
					});
				});
			});
		});
	},

	destroy: function(collectionName, options, cb) {

		var tableName = dbs[collectionName].identity; 
		var statement = 'DELETE FROM [' + tableName + '] ';
		statement += sql.serializeOptions(dbs[collectionName].identity, options);

		mssql.connect(marshalConfig(dbs[collectionName].config), function __DELETE__(err) {

			if (err) return cb(err);

			var request = new mssql.Request();
			request.query(statement, function(err, recordset) {

				if (err) return cb(err);
				cb(null, []);

			});

		});
	},

};

function marshalConfig(config) {
	return {
		user: config.user,
		password: config.password,
		server: config.host || 'localhost',
		port: config.port || 1433,
		database: config.database,
		timeout: config.timeout || 5000,
		pool: {
			max: (config.pool && config.pool.max) ? config.pool.max : 10,
			min: (config.pool && config.pool.min) ? config.pool.min : 0,
			idleTimeoutMillis: (config.pool && config.pool.idleTimeout) ? config.pool.idleTimeout : 30000
		},
		options: {
			appName: 'sails.js'
		}
	};
}

return adapter;

})();