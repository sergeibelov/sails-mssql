![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png) 

# sails-mssql [![NPM version](https://badge.fury.io/js/sails-mssql.png)](http://badge.fury.io/js/sails-mssql)
Microsoft SQL Server Adapter for Sails.js

## Compatibility

* SQL Server 2005 and later (tested with SQL Server 2005 and SQL Server 2008)
* Sails.js 0.9.x
* Windows/OSX/Linux

## Installation
```sh
npm install sails-mssql
```

## Configuration
__Minimal__
```javascript
adapters: {
  'default': 'mssql',
  mssql: {
    module: 'sails-mssql',
    user: 'sample',
    password: 'secret', 
    database: 'sailsdb'
  }
}
```
__Full__
```javascript
adapters: {
  'default': 'mssql',
  mssql: {
    module: 'sails-mssql',
    host: 'localhost',
    port: 1433,
    user: 'sample',
    password: 'secret', 
    database: 'sailsdb',
    timeout: 5000,
    pool: {
      min: 0,
      max: 10,
      idleTimeout: 30000
    }
  }
}
```
## Configuration Details

* **host** - Database server host name (default: localhost).
* **port** - Database server port (default: 1433).
* **user** - User name to use for authentication.
* **password** - Password to use for authentication.
* **database** - Database name.
* **timeout** - Database connection timeout in milliseconds (default: 5000).
* **pool.min** - The minimum number of connections in the connection pool (default: 0).
* **pool.max** - The maximum number of connections in the connection pool (default: 10).
* **pool.idleTimeout** - Timeout (in milliseconds) before unused connections are closed (default: 30000).

## License

[MIT License](http://sergeibelov.mit-license.org/)  Copyright © 2013-2014 Sergei Belov

