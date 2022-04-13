<template>
    <div class="search">
        <el-input v-model="keyword" clearable placeholder="请输入您想要的图书名称或者作者">
          <button slot="append" class="el-icon-search" @click="searchBook"></button>
        </el-input>
    </div>
</template>

<script>
    export default {
      name: "search",
      data(){
        return {
          keyword: ''
        }
      },
      methods:{
        searchBook(){
          alert(this.keyword);
        }
      }
    }
</script>

<style lang="less">
    .search{
      margin: 100px auto;
      width: 60%;
    }
</style>
