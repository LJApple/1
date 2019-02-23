import http from '@/utils/http'

const base = '/Company/'
// 添加功能
export function AddComMa(form) {
  return http({
    url: `${base}Add`,
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
    url: `${base}CompanyList`,
    method: 'get'
  })
}

// 授权系统列表
export function getComSystemAuthList(companyId) {
  return http({
    url: `${base}SystemAuthList/${companyId}`,
    method: 'get'
  })
}
// 系统授权
export function postComSystemAuth(companyId, system) {
  const data = {
    companyId,
    system
  }
  return http({
    url: `${base}SystemAuth`,
    method: 'POST',
    data
  })
}


// 角色授权列表
export function getComRoleAuthList(companyId) {
  return http({
    url: `${base}RoleAuthList/${companyId}`,
    method: 'get'
  })
}
// 系统授权
export function postComRoleAuth(companyId, roleId) {
  const data = {
    companyId,
    roleId
  }
  return http({
    url: `${base}RoleAuth`,
    method: 'POST',
    data
  })
}