![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png) 

# sails-mssql [![NPM version](https://badge.fury.io/js/sails-mssql.png)](http://badge.fury.io/js/sails-mssql)
Microsoft SQL Server Adapter for Sails.js

* Works with SQL Server 2005 and later
* Tested with SQL Server 2005 and SQL Server 2008
* Pooled connections
* Compatible with Sails.js 0.9.x
* Works on windows/osx/linux

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
    timeout: 5000
  }
}
```

## License

[MIT License](http://sergeibelov.mit-license.org/)  Copyright © 2013-2014 Sergei Belov

