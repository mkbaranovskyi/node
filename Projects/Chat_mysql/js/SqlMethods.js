const mysql = require('mysql2')

const connection = mysql
	.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'Rfgkzrfgkz',
		database: 'Chat'
	})
	.promise()

class SqlMethods {
	static async getRooms() {
		const sql_query = `SELECT tableName from Rooms;`
		const result = await connection.execute(sql_query)
		return result[0].map((item) => item.tableName)
	}

	static async checkRoomExists(roomName) {
		const sql_params = [roomName]
		const sql_query = `SELECT EXISTS ( SELECT * FROM Rooms WHERE tableName = ? );`
		const result = await connection.execute(sql_query, sql_params)
		return Boolean(Object.values(result[0][0])[0])
	}

	static async createNewRoom(roomName) {
		const sql_query = `CREATE TABLE ${roomName} (
			ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
			Username CHAR(16) NOT NULL,
			Message TEXT NOT NULL,
			PostDate DATETIME NOT NULL,
			LastEdit TIMESTAMP
		);`
		const sql_result = await connection.execute(sql_query)
		return sql_result[0]
	}

	static async addRoomToTheList(roomName) {
		const sql_params = [roomName]
		const sql_query = `INSERT Rooms (tableName, createdAt) VALUES (?, NOW());`
		const result = await connection.execute(sql_query, sql_params)
		return result
	}

	static async getMessages(options) {
		console.log(options)
		const sql_params = [options.nextMessageID]
		const sql_query = `SELECT * FROM ${options.roomName} WHERE ID >= ?;`
		const sql_result = await connection.execute(sql_query, sql_params)
		return sql_result[0]
	}

	static async insertMessage(msg) {
		const sql_params = [msg.Username, msg.Message]
		const sql_query = `INSERT ${msg.roomName} (Username, Message, PostDate) VALUES (?, ?, NOW())`
		const sql_result = await connection.execute(sql_query, sql_params)
		return sql_result
	}
}

module.exports = SqlMethods
