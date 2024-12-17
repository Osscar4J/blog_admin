import BaseApi from './baseApi'
import SparkMD5 from 'spark-md5'

let OSS = require('ali-oss')
let ossClient = null

const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice

function getFileMd5(file) {
	let chunkSize = 1024 * 1024 * 100
	let chunks = Math.ceil(file.size / chunkSize)
	let currentChunk = 0
	let spark = new SparkMD5.ArrayBuffer()
	let fileReader = new FileReader()

	return new Promise((resolve, reject) => {
		fileReader.onload = (e) => {
			spark.append(e.target.result)
			currentChunk++
			if (currentChunk < chunks) {
				loadNext();
			} else {
				resolve(spark.end())
			}
		}

		function loadNext() {
			let start = currentChunk * chunkSize, end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
			fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
		}
		loadNext()
	})
}

export default Object.create(BaseApi, {
	baseUrl: { value: '/file' },

	checkShard: {
		value: function (params) {
			return BaseApi.request({ url: this.baseUrl + '/checkShard', method: 'POST', data: params.data }, params)
		},
		enumerable: true
	},

	multiUpload: {
		value: async function (params) {
			return new Promise(async (resolve, reject) => {

				let file = params.data.file
				let md5 = await getFileMd5(file)
				let { data } = await this.checkShard({
					toast: false,
					data: { md5: md5 }
				})
				if (data.content.url) {
					if (params.progress) {
						params.progress(1, 1)
					}
					let res = { content: data.content.url }
					resolve(res)
					return res
				}

				params.data.md5 = md5

				let chunkSize = 1024 * 256 // 每片256K
				let chunks = Math.ceil(file.size / chunkSize)
				let currentChunk = 0

				function getChunkFile() {
					if (currentChunk >= chunks)
						return null

					let start = currentChunk * chunkSize, end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
					currentChunk++
					return {
						file: blobSlice.call(file, start, end),
						currShard: currentChunk
					}
				}
				params.data.totalShard = chunks

				let upload = async current => {
					let chunk = getChunkFile()
					if (chunk) {
						params.data.file = chunk.file
						params.data.currShard = chunk.currShard
						let { data } = await BaseApi.postFile({ url: this.baseUrl + '/multipartUpload', method: 'POST', data: params.data }, params)

						if (params.progress) {
							params.progress(current, chunks)
						}

						if (data.content)
							resolve(data)
					}
				}

				let concurrent = 5
				let loops = Math.ceil(chunks / concurrent)
				for (let i = 0; i < loops; i++) {
					for (let c = 0; c < concurrent; c++)
						upload(currentChunk + 1)
				}
			})
		},
		enumerable: true
	},

	getStsInfo: {
		value: async function () {
			return new Promise(async (resolve, reject) => {
				BaseApi.request({ url: this.baseUrl + '/sts' }, {
					success(res) {
						resolve(res.data)
					}
				})
			})
		},
		enumerable: true
	},

	ossUpload: {
		value: async function (params) {
			if (!ossClient) {
				let stsInfo = await this.getStsInfo()
				ossClient = new OSS({
					region: stsInfo.content.region,
					accessKeyId: stsInfo.content.accessKey,
					accessKeySecret: stsInfo.content.accessKeySecret,
					stsToken: stsInfo.content.securityToken,
					bucket: stsInfo.content.bucket
				});
			}
			return new Promise(async (resolve, reject) => {
				const res = await ossClient.multipartUpload(params.data.filename, params.data.file, {
					progress: params.progress
				})
				res.fullUrl = "https://static.zhaolianqi.cn/" + params.data.filename
				resolve(res)
			})
		},
		enumerable: true
	}
})
