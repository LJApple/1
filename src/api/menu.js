import http from '@/utils/http'

// 获取菜单
export function GetMenuAll() {
  return http({
    url: '/Menu/GetMenuAll',
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
