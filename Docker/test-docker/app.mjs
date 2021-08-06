import express from 'express'

const app = express()

let userGoal = 'Learn Docker'

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send(`<h3>${userGoal}</h3>
  <form action="/store-goal" method="POST">
    <input type="text" name="goal" />
    <button type="submit">Submit</button>
  </form>`)
})

app.post('/store-goal', (req, res) => {
  const enteredGoal = req.body.goal
  console.log(enteredGoal)
  userGoal = enteredGoal
  res.redirect('/')
})

app.listen(80, () => console.log('Server is running'))
