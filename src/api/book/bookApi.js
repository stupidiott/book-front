import request from "../../axios/request";

function list(url,params) {
  return request.post(url,params)
}

function add(url,params) {
  return request.post(url,params)
}

function update(url,params) {
  return request.post(url,params)
}

export default {
  list,
  add,
  update,
}
