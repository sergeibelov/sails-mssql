![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png) 

# sails-mssql
MSSQL Server Adapter for Sails.js

* Works with SQL Server 2005 and later
* Tested with SQL Server 2005 and SQL Server 2008
* Limited support for SQL Server 2000
* Compatible with Sails.js 0.9.x

## Installation
```
npm install sails-mssql
```

## Configuration
```javascript
adapters: {
  'default': 'mssql',
  mssql: {
    module: 'sails-mssql',
    host: '127.0.0.1',
    user: 'sample',
    password: 'secret', 
    database: 'sailsdb'
  }
}
```


