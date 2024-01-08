# PG_RAI_Proj_extra

prepare server and install dependencies:<br>
```
npm init -y
npm install express archiver
```

run server:
```
node server.js
```

use compressor
```
Invoke-RestMethod -Uri http://localhost:3000/compress -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"directory": "C:\\Users\\wdmk4\\OneDrive\\Desktop\\SBD\\"}'
```