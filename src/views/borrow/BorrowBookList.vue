<template>
  <div class="borrowBookList">
    <!--面包屑-->
    <edu-breadcrumb :menu-name="menuName">
    </edu-breadcrumb>

    <!--搜索条件-->
    <edu-search>
      <el-row :gutter="4">
        <el-col :span="4">
          <el-input v-model="query.bookNo" placeholder="enter book id" clearable @keyup.enter.native="searchBorrowBook" @click="searchBorrowBook" @clear="searchBorrowBook"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-search" type="primary" @click="searchBorrowBook"></el-button>
        </el-col>
      </el-row>
    </edu-search>

    <!--显示内容-->
    <edu-table :titles="tableTitle"
               :table-data="tableData"
               :visible-operation="true"
               :visible-return-book="true"
               @returnBook="returnBook">
    </edu-table>
    <edu-page :current-page="query.pageNum"
              :page-size="query.pageSize"
              :total="total"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange">
    </edu-page>
  </div>
</template>

<script>
    export default {
        name: "borrow-book",
        data(){
          return{
            menuName: 'borrow list',
            query: {
              bookNo: '',
              pageNum: 1,
              pageSize: 10
            },
            tableTitle: [
              {prop: 'bookNo',label: 'Book Id' ,width: 300},
              {prop: 'bookName',label: 'Book Name' ,width: 300},
              // {prop: 'borrowIdentityNo',label: '借书人身份证号' ,width: 240},
              {prop: 'startDate',label: 'Borrow Time',width: 300},
              {prop: 'endDate',label: 'Due Time',width: 300},
              {prop: 'expireFlag',label: 'Expired',width: 300,isHtml: true}
            ],
            tableData: [],
            total: 0
          }
        },
        mounted(){
          this.listBorrowBook();
        },
        methods:{
          listBorrowBook(){
            let params = this.query;
            this.$http.post('/api/borrow/book/list',params).then(res=>{
              this.tableData = res.data.data.list.map(item=>{
                let currentTime = new Date().getTime();
                let endTime = new Date(item.endTime).getTime();
                return {
                  ...item,
                  startDate: item.startTime.substr(0,10),
                  endDate: item.endTime ? item.endTime.substr(0,10) : '--',
                  expireFlag: currentTime>endTime ? '<span class="expireFlag">expired</span>' : 'unexpired'
                }
              });
              this.total = Number.parseInt(res.data.data.total);
            })
          },
          searchBorrowBook(){
            this.listBorrowBook();
          },
          returnBook(row){

            this.$confirm('submission confirmed？','confirm',{
              confirmButtonText: 'confirm',
              cancelButtonText: 'cancel'
            }).then(()=>{
              let params = {
                borrowBookId: row.id,
                bookNo : row.bookNo,
              }
              this.$http.post('/api/return/book',params).then(res=>{
                if(res.data.code !== 200){
                  this.$message.warning(res.data.message);
                  return;
                }
                this.$message.success("success");
                this.listBorrowBook();
              }).catch(error=>{})
            }).catch(()=>{})
          },
          handleSizeChange(newValue){
            this.query.pageSize = newValue;
            this.listBorrowBook();
          },
          handleCurrentChange(newValue){
            this.query.pageNum = newValue;
            this.listBorrowBook();
          },
        }
    }
</script>

<style lang="less">
  .borrowBookList{
    .expireFlag{
      color: red;
    }
  }
</style>
