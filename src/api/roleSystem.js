import http from '@/utils/http'

const base = '/RoleSystem/'
// 超级管理员添加系统角色
export function addRole({ roleName, isDisable, isShow, sort, remark }) {
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
export function editRole({ roleName, isDisable, isShow, sort, remark, id }) {
    // id 角色Id
    const data = {
      roleName, // string 角色名称
      isDisable, // boolean 是否禁用
      isShow, // boolean 是否显示
      sort, // integer 排序
      remark // string 备注
    }
    return http({
      url: `${base}Edit${id}`,
      method: 'PUT',
      data
    })
}

// 删除管理员角色
export function delRole({ id }) {
    return http({
      url: `${base}Del/${id}`,
      method: 'DELETE'
    })
}

// 超级管理员获取所有系统角色
export function getRoleList() {
    return http({
      url: `${base}List`,
      method: 'GET'
    })
}

// 菜单授权
export function postMenuAuth({ roleId, menuId }) {
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
export function getMenuAuthList({ roleId }) {
    return http({
      url: `${base}MenuAuthList${roleId}`,
      method: 'GET'
    })
}

// 菜单功能授权
export function postMenuButtonAuth({ roleId, menuButtonId }) {
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
export function cancleMenuButtonAuth({ roleId, menuButtonId }) {
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
export function getMenuButtonAuthList({ roleId, menuId }) {
    const url = `${base}CancelMenuButtonAuth?roleId=${roleId}&menuId=${menuId}`
    return http({
      url,
      method: 'GET'
    })
}