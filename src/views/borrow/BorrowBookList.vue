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
    <h1>Borrow</h1>
    <edu-table :titles="tableTitle"
               :table-data="tableData"
               :visible-operation="user.accountType==1"
               :visible-return-book="user.accountType==1"
               @returnBook="returnBook">
    </edu-table>
    <edu-page :current-page="query.pageNum"
              :page-size="query.pageSize"
              :total="total"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange">
    </edu-page>
    <h1>Reservation</h1>
    <edu-table :titles="reservetableTitle"
               :table-data="reservetableData"
               :visible-operation="user.accountType==1"
               :visible-return-book="user.accountType==1"
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
    import {mapState} from "vuex";

    export default {
        name: "borrow-book",
        data(){
          return{
            menuName: 'borrow list',
            query: {
              bookNo: '',
              pageNum: 1,
              pageSize: 10,
              borrowIdentityNo: ''
            },
            tableTitle: [
              {prop: 'bookNo',label: 'Borrow Book Id' ,width: 300},
              {prop: 'bookName',label: 'Borrow Book Name' ,width: 300},
              {prop: 'borrowIdentityNo',label: 'borrower' ,width: 240},
              {prop: 'startDate',label: 'Borrow Time',width: 300},
              {prop: 'endDate',label: 'Due Time',width: 300},
              {prop: 'expireFlag',label: 'Expired',width: 300,isHtml: true}
            ],
            reservetableTitle: [
              {prop: 'bookNo',label: 'Reserve Book Id' ,width: 300},
              {prop: 'bookName',label: 'Reserve Book Name' ,width: 300},
              {prop: 'borrowIdentityNo',label: 'borrower' ,width: 240},
              {prop: 'startDate',label: 'Reserve Time',width: 300},
              {prop: 'endDate',label: 'Due Time',width: 300},
              {prop: 'expireFlag',label: 'Expired',width: 300,isHtml: true}
            ],
            tableData: [],
            reservetableData:[],
            total: 0
          }
        },
        mounted(){
          this.listBorrowBook();
        },
        computed: {
        // 第一种写法
        ...mapState(['user','token'])
        // 第二种写法
        // token(){
        //   return this.$store.state.token
        // },
        // user(){
        //   return this.$store.state.user;
        // }
      },
        methods:{
          listBorrowBook(){
            let params = this.query;
            if(this.user.accountType==4){
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

                  }).filter(item=>item.borrowIdentityNo === this.user.username && item.deleteFlag === 0&&item.kind==0);
                  this.total = Number.parseInt(res.data.data.total)-1;
                })
            }
            else{
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
                }).filter(item=>item.deleteFlag === 0&&item.kind==0);
                this.total = Number.parseInt(res.data.data.total);
              })
            }
            if(this.user.accountType==4){
              this.$http.post('/api/borrow/book/list',params).then(res=>{
                this.reservetableData = res.data.data.list.map(item=>{
                  let currentTime = new Date().getTime();
                  let endTime = new Date(item.endTime).getTime();
                  return {
                    ...item,
                    startDate: item.startTime,
                    endDate: item.endTime ? item.endTime : '--',
                    expireFlag: currentTime>endTime ? '<span class="expireFlag">expired</span>' : 'unexpired'
                  }

                }).filter(item=>item.borrowIdentityNo === this.user.username && item.deleteFlag === 0&&item.kind==1);
                this.total = Number.parseInt(res.data.data.total)-1;
              })
            }
            else{
              this.$http.post('/api/borrow/book/list',params).then(res=>{
                this.reservetableData = res.data.data.list.map(item=>{
                  let currentTime = new Date().getTime();
                  let endTime = new Date(item.endTime).getTime();
                  return {
                    ...item,
                    startDate: item.startTime,
                    endDate: item.endTime ? item.endTime: '--',
                    expireFlag: currentTime>endTime ? '<span class="expireFlag">expired</span>' : 'unexpired'
                  }
                }).filter(item=>item.deleteFlag === 0&&item.kind==1);
                this.total = Number.parseInt(res.data.data.total);
              })
            }
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
