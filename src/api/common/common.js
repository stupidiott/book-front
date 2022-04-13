function resetFields(_this,formName){
  if(_this.$refs[formName]){
    _this.$refs[formName].resetFields();
  }
}

export default {
  resetFields
}
