/* 
后台用户管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {

    getList(page, limit) {
        if (page && limit) {
            return request({
                url: `${api_name}/${page}/${limit}`,
                method: 'get'
            })
        }
        return request({
            url: `${api_name}/getTrademarkList`,
            method: 'get'
        })
    },

    getById(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method: 'get'
        })
    },

    remove(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'delete'
        })
    },

    add(trademark) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data:trademark
        })
    },

    update(trademark){
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data:trademark
        })
    }
}
