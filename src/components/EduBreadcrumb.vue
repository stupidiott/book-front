<template>
  <div style="background-color: #fff;height: 40px">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" style="line-height: 40px;margin-left: 5px">Home</el-breadcrumb-item>
      <el-breadcrumb-item style="line-height: 40px;margin-left: 5px">{{menuName}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
    export default {
        name: "EduBreadcrumb",
        props:{
            menuName:{
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped>

</style>
