const localStorage = window.localStorage;

export default {
  getItem(key){
    try {
      return JSON.parse(localStorage.getItem(key))
    }catch (e) {
      return null;
    }
  },
  setItem(key,obj){
    localStorage.setItem(key,JSON.stringify(obj));
  },
  removeItem(key){
    localStorage.removeItem(key);
  },
  clear(){
    localStorage.clear();
  },
  keys(){
    return localStorage.keys();
  }
}
