import request from "../../axios/request";

export function getAccountList(url,params) {
  return request.post(url,params)
}

export function setAccountAuth(url,params) {
  return request.post(url,params)
}

export function resetPassword(url,params) {
  return request.post(url,params)
}

export function queryAccount(url) {
  return request.get(url)
}
