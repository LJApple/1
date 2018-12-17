import http from '@/utils/http'

export function GetMenuAll() {
  return http({
    url: '/Menu/GetMenuAll',
    method: 'get'
  })
}
