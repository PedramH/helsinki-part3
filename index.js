const { application, response } = require("express");
const express = require("express");
const req = require("express/lib/request");
const morgan = require('morgan');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


app.get('/info',(request,response) => {
    let res = '';
    res = `<p>Phonebook has info for ${persons.length} people</p>`
    let currentDate = new Date(Date.now());
    res = `${res}<p>${currentDate}</p>`
    response.send(res)
})


app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const person_id = Number(request.params.id)
    const res = persons.filter(person => person.id === person_id)
    if (!res.length){
        return response.status(404).end()
    }
    response.send(res)
})

app.delete('/api/persons/:id', (request, response) => {
    console.log(`Delete request recieved`)
    const person_id = Number(request.params.id)
    persons = persons.filter(person => person.id !== person_id)
    response.status(204).end()
})

const generate_id = () => {
    return Math.floor(Math.random()*10000000);
}

app.post('/api/persons', (request, response) => {
    if (!request.body.name) {
        return response.status(400).json({ 
          error: 'missing name' 
        })
      }
      if (!request.body.number) {
        return response.status(400).json({ 
          error: 'missing number' 
        })
      }
    if (persons.filter(x => x.name === request.body.name).length){
        return response.status(400).json({ 
            error: `there is already a ${request.body.name} in the phonebook` 
          })
    }
    let new_person = {};
    new_person.id = generate_id();
    new_person.name = request.body.name;
    new_person.number = request.body.number;
    persons = persons.concat(new_person);
    response.json(new_person);
})  






const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
