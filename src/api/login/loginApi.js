import request from "../../axios/request";

export function login(url,params) {
  return request.post(url,params)
}
