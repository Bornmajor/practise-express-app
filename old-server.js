import http from 'node:http';

const tasks = [
    {id:1,title:'Learn node', done:false}
];

const server = http.createServer((req,res) => {
    console.log(req.method, req.url);

    if(req.method === 'GET' && req.url === '/'){
        res.writeHead(200,{'Content-Type': 'text/plain'});
        return res.end('Hello from Node');
    }

    if(req.method === 'GET' && req.url === '/tasks'){
        res.writeHead(200,{'Content-Type': 'application/json'});
        //convert to JSON
        return res.end(JSON.stringify(tasks));
    }

    if(req.method === 'POST' && req.url === '/tasks'){
        let body = '';

        //listen to data stream from client
        //this function run when data arrive from client
        req.on('data', chunk => (body += chunk));

        //end - run when finish fetching data because is async 
        req.on('end',() => {
             const {title} = JSON.parse(body);
             const task = {id: tasks.length+1,title:title,done:false}
             tasks.push(task);

             //return response to client
             res.writeHead(201,{'Content-Type': 'application/json'});
             res.end(JSON.stringify(tasks))
        })

        return;
    }

    //fallback for unmapped routes
    res.writeHead(404,{'Content-Type': 'application/json'});
    res.end(JSON.stringify({error:'Not found'}));

});

server.listen(3000,() => {
    console.log("Server running on http://localhost:3000");
})