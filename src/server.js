import express from "express";

//create express instance or intializing express app
const app = express();

// middleware covert parse JSON bodies into req.body for server to be able to read JSON request bodies
app.use(express.json());

let tasks = [{ id: 1, title: 'Learn Node', done: false }];
let nextId = 2;

//Logger middleware
app.use((req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => res.send('Hello from Express!'));

// get method
app.get("/tasks", (req,res) => {
    //get done query /tasks?done=true
    const {done} = req.query;
    const result = done === undefined ? tasks : tasks.filter((item) =>  String(item.done) === done)
    res.json(result);
});

//get by id
app.get("/task/:id",(req,res) => {
//validation
const task = tasks.filter((item) => item.id !== req.params.id);

if(!task) {
    res.status(404).json({error: "Task not found"})
}
res.json(task);
});

//post method
app.post("/tasks",(req,res) => {
    const {title} = req.body;
    //validation
    if(!title) {
       return res.status(400).json({error: "title is required"})
    }

    const task = {id: nextId++,title,done:false}
    tasks.push(task);

    res.status(201).json(tasks);
});

// UPDATE (partial)
app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  Object.assign(task, req.body);
  res.json(task);
});

// DELETE
app.delete('/tasks/:id', (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== Number(req.params.id));
  if (tasks.length === before) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});

app.use((req,res) => {
    res.status(404).json({error: "Route not found"})
});

//central error handler should have 4 params include err of to flag as error handler by express
app.use((err,req,res,next) => {
    console.error(err);

    res.status(500).json({error: 
        'Something went wrong'
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
