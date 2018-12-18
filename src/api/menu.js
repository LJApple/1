import http from '@/utils/http'

// 获取菜单
export function GetMenuAll() {
  return http({
    url: '/Menu/GetMenuAll',
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
export function AddMenu(param) {
  return http({
    url: '/Menu/AddMenu',
    method: 'post',
    data: param
  })
}

// 修改菜单
export function EditMenu(menuId, param) {
  return http({
    url: `/Menu/EditMenu/${menuId}`,
    method: 'put',
    data: param
  })
}
// 根据上级菜单Id获取下级菜单列表
export function getListByPid(menuId) {
  return http({
    url:`/Menu/ListByPid?menuId=${menuId}`,
    method: 'get'
  })
}

// 获取button功能列表
export function GetMenuButtonList(menuId) {
  return http({
    url: `/Menu/GetMenuButtonList/${menuId}`,
    method: 'get'
  })
}
