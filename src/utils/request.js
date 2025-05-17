import axios from 'axios'
import router from '@/router'
import Cookies from 'js-cookie'

// 创建 Axios 实例，注意 baseURL 已改为相对路径
const request = axios.create({
    //baseURL: 'http://localhost:9092/api',
    baseURL: '/api', // ✅ 使用相对路径，便于通过 Nginx 反向代理
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8'

        // 从 cookie 获取登录用户信息
        const adminJson = Cookies.get('admin')
        if (adminJson) {
            const token = JSON.parse(adminJson).token
            config.headers['token'] = token
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        let res = response.data

        // 如果返回是字符串，尝试转 JSON（兼容服务端字符串返回）
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }

        // 统一处理未登录/登录过期等情况
        if (res.code === '401') {
            router.push('/login')
        }

        return res
    },
    error => {
        console.error('接口响应错误:', error)
        return Promise.reject(error)
    }
)

export default request
