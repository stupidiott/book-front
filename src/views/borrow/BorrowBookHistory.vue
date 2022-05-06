<template>
  <div class="borrowBookHistory">
    <!--面包屑-->
    <edu-breadcrumb :menu-name="menuName">
    </edu-breadcrumb>

    <!--搜索条件-->
    <edu-search>
      <el-row :gutter="4">
        <el-col :span="4">
          <el-input v-model="query.bookNo" placeholder="enter ISBN" clearable @keyup.enter.native="searchBorrowBook" @click="searchBorrowBook" @clear="searchBorrowBook"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-search" type="primary" @click="searchBorrowBook"></el-button>
        </el-col>
      </el-row>
    </edu-search>

    <!--显示内容-->
    <edu-table :titles="tableTitle"
               :table-data="tableData"
               :visible-operation="false">
    </edu-table>
    <edu-page :current-page="query.pageNum"
              :page-size="query.pageSize"
              :total="total1"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange">
    </edu-page>
    <edu-table :titles="tableTitle"
               :table-data="resveretableData"
               :visible-operation="false">
    </edu-table>
    <edu-page :current-page="query.pageNum"
              :page-size="query.pageSize"
              :total="total2"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange">
    </edu-page>
  </div>
</template>

<script>
    export default {
        name: "borrowBookHistory",
        data(){
          return{
            menuName: 'History',
            query: {
              bookNo: '',
              pageNum: 1,
              pageSize: 10
            },
            tableTitle: [
              {prop: 'bookNo',label: 'Book Id' },
              {prop: 'bookName',label: 'Title'},
              {prop: 'borrowIdentityNo',label: 'borrower' },
              {prop: 'startDate',label: 'Borrow Time'},
              {prop: 'returnDate',label: 'Return Time'},
            ],
            tableData: [],
            resveretableData:[],
            total1: 0,
            total2: 0
          }
        },
        mounted(){
          this.listBorrowBookHistory();
        },
        methods:{
          listBorrowBookHistory(){
            let params = this.query;
            params.deleteFlag = 1;
            this.$http.post('/api/borrow/book/list',params).then(res=>{
              this.tableData = res.data.data.list.map(item=>{
                return {
                  ...item,
                  startDate: item.startTime.substr(0,10),
                  returnDate: item.returnTime ? item.returnTime.substr(0,10) : '--',
                }
              }).filter(item=>item.kind==0);
              this.total1 = this.tableData.length
            })
            this.$http.post('/api/borrow/book/list',params).then(res=>{
              this.resveretableData = res.data.data.list.map(item=>{
                return {
                  ...item,
                  startDate: item.startTime.substr(0,10),
                  returnDate: item.returnTime ? item.returnTime.substr(0,10) : '--',
                }
              }).filter(item=>item.kind==1);
              this.total2 = this.resveretableData.length;
            })
          },
          searchBorrowBook(){
            this.listBorrowBookHistory();
          },
          handleSizeChange(newValue){
            this.query.pageSize = newValue;
            this.listBorrowBookHistory();
          },
          handleCurrentChange(newValue){
            this.query.pageNum = newValue;
            this.listBorrowBookHistory();
          },
        }
    }
</script>

<style lang="less">
  .borrowBookHistory{

  }
</style>
