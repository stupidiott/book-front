import request from "../../axios/request";

function getParameterList(url) {
  return request.get(`${url}`)
}


export default {
  getParameterList
}
