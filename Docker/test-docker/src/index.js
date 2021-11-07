import express from 'express'

const app = express()

let userGoal = 'Learn Docker'

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('./public'))

app.post('/store-goal', (req, res) => {
  const enteredGoal = req.body.goal
  console.log(enteredGoal)
  userGoal = enteredGoal
  res.redirect('/')
})

app.listen(80, () => console.log('Server is running'))
