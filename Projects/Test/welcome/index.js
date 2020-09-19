module.exports = {
	getMorningMessage(){
		return require('./morning')
	},
	getEveningMessage(){
		 return require('./evening')
	}
}