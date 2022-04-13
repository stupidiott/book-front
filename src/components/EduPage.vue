<template>
  <div style="margin-top: 10px;background-color: #fff">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
    export default {
        name: "EduPage",
        props:{
            currentPage:{
                type: Number,
                default:1
            },
            pageSize:{
                type: Number,
                default: 10
            },
            total:{
                type: Number,
                default: 0
            }
        },
        methods:{
            handleSizeChange(value){
                this.$emit('handleSizeChange',value);
            },
            handleCurrentChange(value){
                this.$emit('handleCurrentChange',value);
            }
        }
    }
</script>

<style scoped>

</style>
