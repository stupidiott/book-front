<template>
  <el-container>
    <el-header>{{title}}</el-header>

    <el-main :style="{background:backgroundcolor}">
      <div style="float: left"><i :class="cla"  style="font-size:150%"></i>
      </div>
      {{number}}
    </el-main>
  </el-container>
</template>

<script>

  export default {
    name: 'Card',
    props: ['title','number','backgroundcolor','cla'],
    data () {
      return {
      }
    },
    methods: {
      goto(){

      },
    }
  }
</script>

<style scoped>
  .el-container {
    width: 300px;
    display: inline-block;
    margin: 50px 25px;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 100px;
    font-size:xx-large;
  }
</style>
