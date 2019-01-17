const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
var morgan = require('morgan')

const app = express()

//const app = http.createServer((req, res) => {
//  res.writeHead(200, { 'Content-Type': 'text/plain' })
//  res.end('Hello World')
// })

let notes = [
    {
      id: 1,
      content: 'HTML on helppoa',
      date: '2017-12-10T17:30:31.098Z',
      important: true
    },
    {
      id: 2,
      content: 'Selain pystyy suorittamaan vain javascriptiä',
      date: '2017-12-10T18:39:34.091Z',
      important: false
    },
    {
      id: 3,
      content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
      date: '2017-12-10T19:20:14.298Z',
      important: true
    }
  ]
  app.use(express.static('build'))
  app.use(bodyParser.json())
  const logger = (request, response, next) => {
    console.log('Method:',request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(logger);
  // morgan('tiny');
  // app.use(morgan);
  //morgan('combined');
  //app.use(morgan);
  //const app = http.createServer((request, response) => {
  //  response.writeHead(200, { 'Content-Type': 'application/json' })
  //  response.end(JSON.stringify(notes))
  // })
  
  app.get('/api/notes', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
  })
 
  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
  
    if ( note ) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

app.post('/api/notes', (request, response) => {
  console.log('Content of request:', request.body);

  const newNoteFromBody = request.body
  const generateId = () => {
    const maxId = notes.length > 0 ? notes.map(n => n.id).sort((a,b) => a - b).reverse()[0] : 1
    return maxId + 1
  }

  let newNote = {
    id: generateId,
    content: newNoteFromBody.content,
    date: newNoteFromBody.date,
    important: newNoteFromBody.important
  }
  let arrayNotes = notes;
  arrayNotes.push(newNote);
  notes = arrayNotes;
  response.status(200).end()    
  })


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })