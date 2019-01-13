import http from '@/utils/http'
const base = '/Menu/'

// 获取菜单
export function getMenuAll() {
  return http({
    url: `${base}LeftTree`,
    method: 'get'
  })
}

// 获取菜单树
export function getMenuTree() {
  return http({
    url: `${base}Tree`,
    method: 'get'
  })
}

// 添加菜单
export function addMenu(param) {
  return http({
    url: `${base}Add`,
    method: 'post',
    data: param
  })
}

// 删除菜单
export function delMenu(id) {
  return http({
    url: `${base}${id}`,
    method: 'DELETE'
  })
}

// 修改菜单
export function editMenu(menuId, param) {
  return http({
    url: `${base}/Edit/${menuId}`,
    method: 'put',
    data: param
  })
}

// 菜单信息
export function getMenuInfo(id) {
  return http({
    url: `${base}/Info/${id}`,
    method: 'get'
  })
}
// 根据上级菜单Id获取下级菜单列表
export function getListByPid(pId) {
  const url = pId ? `${base}ListByPid?pId=${pId}`: `/Menu/ListByPid`
  return http({
    url,
    method: 'get'
  })
}

// 获取button功能列表
export function getMenuButtonList(menuId) {
  return http({
    url: `${base}ButtonList/${menuId}`,
    method: 'get'
  })
}

// 绑定button功能
export function postButtonList(data) {
  return http({
    url: `${base}BindButton`,
    method: 'post',
    data
  })
}

// 取消绑定button功能
export function delButtonList(data) {
  return http({
    url: `${base}CancelBindButton`,
    method: 'DELETE',
    data
  })
}
