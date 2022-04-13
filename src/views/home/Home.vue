<template>
    <div class="statistics" style="font-size: 100px">
      Welcome to the LMS
    </div>

</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Home",
        inject: ['reload'],
        data(){
          return{

          }
        },
        mounted(){
          window.onresize = () => {
            return (() => {
              // 采用window.reload()，或者router.go(0)刷新时，整个浏览器进行了重新加载，闪烁，体验不好
              // 使用provide/inject组合
              this.reload();
            })();
          };
        },
        computed:{
          ...mapState(['user'])
        },
        methods: {

        }
    }
</script>

<style lang="less" scoped>
  .statistics{

  }

</style>
