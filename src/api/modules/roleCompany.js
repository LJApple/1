import http from '@/utils/http'

const base = '/RoleCompany/'
// 超级管理员添加系统角色
export function addComRole({ roleName, isDisable, isShow, sort, remark }) {
  const data = {
    roleName, // string 角色名称
    isDisable, // boolean 是否禁用
    isShow, // boolean 是否显示
    sort, // integer 排序
    remark // string 备注
  }
  return http({
    url: `${base}Add`,
    method: 'POST',
    data
  })
}

// 超级管理员编辑系统角色
export function editComRole(id, from) {
    return http({
      url: `${base}Edit/${id}`,
      method: 'PUT',
      data: from
    })
}

// 删除管理员角色
export function delComRole({ id }) {
    return http({
      url: `${base}Del/${id}`,
      method: 'DELETE'
    })
}

// 超级管理员获取所有系统角色
export function getComRoleList() {
    return http({
      url: `${base}List`,
      method: 'GET'
    })
}

// 菜单授权
export function postComMenuAuth({ roleId, menuId }) {
    const data = {
        roleId, // string 角色id
        menuId // array [ menuId string ]
    }
    return http({
      url: `${base}MenuAuth`,
      method: 'POST',
      data
    })
}

// 授权菜单列表
export function getComMenuAuthList({ roleId }) {
    return http({
      url: `${base}MenuAuthList/${roleId}`,
      method: 'GET'
    })
}

// 菜单功能授权
export function postComMenuButtonAuth({ roleId, menuButtonId }) {
    const data = {
        roleId, // string 角色id
        menuButtonId // string 菜单功能Id
    }
    return http({
      url: `${base}MenuButtonAuth`,
      method: 'POST',
      data
    })
}

// 取消菜单功能授权
export function cancleComMenuButtonAuth({ roleId, menuButtonId }) {
    const data = {
        roleId, // string 角色id
        menuButtonId // string 菜单功能Id
    }
    return http({
      url: `${base}CancelMenuButtonAuth`,
      method: 'PUT',
      data
    })
}

// 菜单功能列表
export function getComMenuButtonAuthList({ roleId, menuId }) {
    const url = `${base}MenuButtonAuthList?roleId=${roleId}&menuId=${menuId}`
    return http({
      url,
      method: 'GET'
    })
}

// 数据授权
export function postComDataAuth({ roleId, tableCode, purviewState }) {
  const data = {
    roleId,
    tableCode,
    purviewState
  }
  return http({
    url: `${base}DataAuth`,
    method: 'POST',
    data
  })
}

// 取消数据授权
export function delComDataAuth({ roleId, tableCode, purviewState }) {
  const data = {
    roleId, 
    tableCode,
    purviewState
  }
  return http({
    url: `${base}CancelDataAuth`,
    method: 'DELETE',
    data
  })
}

// 数据授权列表
export function getComDataAuthList(roleId) {
  return http({
    url: `${base}DataAuthList?roleId=${roleId}`,
    method: 'GET'
  })
}

// 字段授权
export function postComFieldAuth({ roleId, tableCode, purviewState }) {
  const data = {
    roleId,
    tableCode,
    purviewState
  }
  return http({
    url: `${base}FieldAuth`,
    method: 'POST',
    data
  })
}
// 取消字段授权
export function delComFieldAuth({ roleId, tableCode, columnCode }) {
  const data = {
    roleId,
    tableCode,
    columnCode
  }
  return http({
    url: `${base}CancelFieldAuth`,
    method: 'DELETE',
    data
  })
}

// 字段授权列表
export function getComFieldAuthList(roleId) {
  return http({
    url: `${base}FieldAuthList/${roleId}`,
    method: 'GET'
  })
}