import http from '@/utils/http'

const base = '/Company/'
// 添加功能
export function AddComMa(form) {
  return http({
    url: `${base}AddTableColumnData`,
    method: 'POST',
    data: form
  })
}

// 修改功能
export function editComMa(id, from) {
    return http({
      url: `${base}Edit/${id}`,
      method: 'PUT',
      data: from
    })
}

// 删除功能
export function delComMa(id) {
    return http({
      url: `${base}DelTableColumnData/${id}`,
      method: 'DELETE'
    })
}

// 获取功能列表
export function getComMaList() {
  return http({
    url: `${base}GetCompanyList`,
    method: 'get'
  })
}