import http from '@/utils/http'

const base = '/Db/'
// 添加功能
export function AddSerButton(form) {
  return http({
    url: `${base}Add`,
    method: 'POST',
    data: form
  })
}

// 修改功能
export function editSerButton(id, from) {
    return http({
      url: `${base}Edit/${id}`,
      method: 'PUT',
      data: from
    })
}

// 删除功能
export function delSerButton(id) {
    return http({
      url: `${base}Del/${id}`,
      method: 'DELETE'
    })
}

// 获取功能列表
export function getSerList() {
  return http({
    url: `${base}List`,
    method: 'get'
  })
}