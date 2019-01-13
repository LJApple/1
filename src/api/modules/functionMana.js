import http from '@/utils/http'

const base = '/Button/'
// 添加功能
export function AddFunButton(form) {
  return http({
    url: `${base}AddButton`,
    method: 'POST',
    data: form
  })
}

// 修改功能
export function editFunButton(id, from) {
    return http({
      url: `${base}EditButton/${id}`,
      method: 'PUT',
      data: from
    })
}

// 删除功能
export function delFunButton(id) {
    return http({
      url: `${base}DelButton/${id}`,
      method: 'DELETE'
    })
}

// 获取功能列表
export function getFunButtonList() {
  return http({
    url: `${base}GetButtonList`,
    method: 'get'
  })
}