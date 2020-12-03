class Uploader {
	constructor(file, onProgress) {
		this.file = file
		this.onProgress = onProgress

		this.fileId = encodeURIComponent(
			file.name + '-' + file.size + '-' + file.lastModified
		)
	}

	async getUploadedBytes() {
		const response = await fetch('status', {
			headers: {
				'File-Id': this.fileId
			}
		})
		if (!response.ok) {
			throw new Error("Can't get the uploaded bytes!")
		}
		return Number(await response.text())
	}

	async upload() {
		this.startByte = await this.getUploadedBytes()

		const xhr = (this.xhr = new XMLHttpRequest())

		xhr.upload.onprogress = (e) => this.onProgress(e)

		xhr.onprogress = (e) => {
			console.log('Download in progress...')
			// console.log(e)
		}

		// Hide the progress bar when the upload is finished
		xhr.onloadend = (e) => {
			$progress.hidden = true
		}

		xhr.open('POST', 'upload')

		xhr.setRequestHeader('File-Id', this.fileId)
		xhr.setRequestHeader('Start-Byte', this.startByte)
		xhr.setRequestHeader('File-Type', this.file.type)

		xhr.send(this.file.slice(this.startByte))

		// Return a Promise to have the result of the interaction:
		// 1 - finished successfully (req and res)
		// 2 - aborted successfully
		// 3 - an error occured
		return await new Promise((resolve, reject) => {
			xhr.onload = (e) => {
				// console.log(e)
				resolve(
					'The interaction is successfully finished: the Request is sent and the Response is received'
				)
			}

			xhr.onabort = (e) => {
				// console.log(e)
				resolve('Abort!')
			}

			xhr.onerror = (e) => {
				// console.log(e)
				reject(new Error(xhr.statusText))
			}
		})
	}

	stop() {
		if (this.xhr) {
			this.xhr.abort()
		}
	}
}
