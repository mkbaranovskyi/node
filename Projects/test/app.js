const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5000
const crypto = require('crypto')

const Sequelize = require('sequelize')
const { Op, QueryTypes, Model } = require('sequelize')
const sequelize = new Sequelize('Sport', 'root', 'Rfgkzrfgkz', {
	dialect: 'mysql',
	host: 'localhost',
	define: {
		timestamps: true
	}
})

const Student = sequelize.define('Student', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

const Subject = sequelize.define('Subject', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

// Connecting model
const Enrolment = sequelize.define('Enrolment', {
	grade: {
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
		await sequelize.sync({ force: true })
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
