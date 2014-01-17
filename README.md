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
__Basic Options__
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
__Advanced Options__
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

## License

[MIT License](http://sergeibelov.mit-license.org/)  Copyright © 2013-2014 Sergei Belov

