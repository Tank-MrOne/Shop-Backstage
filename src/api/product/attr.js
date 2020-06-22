/* 
后台用户管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/product/attrInfoList'

export default {

    getCate(id1, id2,id3) {
        // if (page && limit) {
        //     return request({
        //         url: `${api_name}/${page}/${limit}`,
        //         method: 'get'
        //     })
        // }
        // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// a
        return request({
            url: `${api_name}/${id1}/${id2}/${id3}`,
            method: 'get'
        })
    },

   
}
