import axios from 'axios'
const service=axios.create({
	baseURL:process.env.API_ROOT,
	timeout:15000
})
export default service
