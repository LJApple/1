import http from '@/utils/http'

// 获取菜单
export function GetMenuAll() {
  return http({
    url: '/Menu/LeftTree',
    method: 'get'
  })
}

// 获取菜单树
export function getMenuTree() {
  return http({
    url: '/Menu/Tree',
    method: 'get'
  })
}

// 添加菜单
export function addMenu(param) {
  return http({
    url: '/Menu/Add',
    method: 'post',
    data: param
  })
}

// 删除菜单
export function delMenu(id) {
  return http({
    url: `/Menu/Del/${id}`,
    method: 'DELETE'
  })
}

// 修改菜单
export function editMenu(menuId, param) {
  return http({
    url: `/Menu/Edit/${menuId}`,
    method: 'put',
    data: param
  })
}

// 菜单信息
export function getMenuInfo(id) {
  return http({
    url: `/Menu/Info/${id}`,
    method: 'get'
  })
}
// 根据上级菜单Id获取下级菜单列表
export function getListByPid(pId) {
  const url = pId ? `/Menu/ListByPid?pId=${pId}`: `/Menu/ListByPid`
  return http({
    url,
    method: 'get'
  })
}

// 获取button功能列表
export function getMenuButtonList(menuId) {
  return http({
    url: `/Menu/ButtonList/${menuId}`,
    method: 'get'
  })
}

// 绑定button功能
export function postButtonList(data) {
  return http({
    url: `/Menu/BindButton`,
    method: 'post',
    data
  })
}

// 取消绑定button功能
export function delButtonList(data) {
  return http({
    url: `/Menu/CancelBindButton`,
    method: 'DELETE',
    data
  })
}
