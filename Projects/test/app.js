const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5000

const Sequelize = require('sequelize')
const sequelize = new Sequelize('Sport', 'root', 'Rfgkzrfgkz', {
	dialect: 'mysql',
	host: 'localhost',
	// port: 5000,
	define: {
		timestamps: false,
		freezeTableName: false
	}
})

const Student = sequelize.define('student', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

const Subject = sequelize.define('subject', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

// Connecting model
const Enrolment = sequelize.define('enrolment', {
	grade: {
		// оценка студента по данному курсу
		type: Sequelize.INTEGER,
		allowNull: false
	},
	enrolmentDate: {
		type: Sequelize.DATE
	},
	graduationDate: {
		type: Sequelize.DATE
	}
})

// This creates the `coachId` column in `teams`
Student.belongsToMany(Subject, { through: Enrolment })
Subject.belongsToMany(Student, { through: Enrolment })

run()

async function run() {
	try {
		// Recreate our tables according to our models
		await sequelize.sync({ force: true, match: /Spo$/ })

		await Subject.create({ name: 'JavaScript' })
		const ts = await Subject.create({ name: 'TypeScript' })
		await Subject.create({ name: 'Node.js' })

		await Student.create({ name: 'Tom' })
		await Student.create({ name: 'Mark' })
		const travis = await Student.create({ name: 'Travis' })

		// Set the connected data
		await travis.addSubject(ts, {
			through: {
				grade: 85
			}
		})

		// Get the connected data
		const travisSubjects = await travis.getSubjects()
		console.log(travisSubjects)

		// Delete the connected data
		for (subject of travisSubjects) {
			if (subject.name === 'TypeScript') await subject.enrolment.destroy()
		}
	} catch (err) {
		console.error(err)
	}
}

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT)
