set NODE_PATH=%AppData%\npm\node_modules

start c:\mongodb\bin\mongod.exe
start node simpleserver.js
start "C:\Program Files (x86)\Google\Chrome\Application\Chrome.exe" "http://127.0.0.1:1337/todo.html"
