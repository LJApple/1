import http from '@/utils/http'

export function login(account, password, companyId) {
  const data = {
    account,
    password,
    companyId
  }
  return http({
    url: '/Login',
    method: 'post',
    data
  })
}
