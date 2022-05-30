<template>
  <div class="borrowBookList">
    <!--面包屑-->
    <edu-breadcrumb :menu-name="menuName">
    </edu-breadcrumb>

    <!--搜索条件-->
    <edu-search>
      <el-row :gutter="4">
        <el-col :span="4">
          <el-button icon="el-icon-search" type="primary" v-if='user.accountType==1' @click="barcodereturn">ScannerBarcode</el-button>
        </el-col>
        <el-col :span="4">
          <el-input v-model="query.bookNo" placeholder="enter book ISBN" clearable @keyup.enter.native="searchBorrowBook" @click="searchBorrowBook" @clear="searchBorrowBook"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-search" type="primary" @click="searchBorrowBook"></el-button>
        </el-col>
        <el-col :span="4">
          <el-input v-model="searchID" placeholder="enter book id" clearable @keyup.enter.native="searchBorrowBook" @click="searchBorrowBook" @clear="searchBorrowBook"></el-input>
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
               :visible-operation="true"
               :visible-return-book="user.accountType==1"
               :visible-setting-auth="true"
               :visible-switch1="true"
               :visible-switch2="true"
               :visible-barcode="true"
               @returnBook="returnBook"
               @showBarcode="showBarcode"
               @setDamage="setDamage"
               @setLost="setLost">
    </edu-table>
    <edu-page :current-page="query.pageNum"
              :page-size="query.pageSize"
              :total="total1"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange">
    </edu-page>
    <h1>Reservation</h1>
    <edu-table :titles="reservetableTitle"
               :table-data="reservetableData"
               :visible-operation="true"
               :visibleCancelReserve="true"
               :visible-barcode="true"
               @returnBook="returnBook"
               @showBarcode="showBarcode">>
    </edu-table>
    <edu-page :current-page="query.pageNum"
              :page-size="query.pageSize"
              :total="total2"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange">
    </edu-page>
    <el-dialog
      :visible.sync="dialogVisible"
      width="73%"
      top="5%"
      :before-close="handleClose">
      <div  v-for="(item,index) in trayList" :key="index">
        <canvas :id="'trayItem'+index"  style="width:200px;height:80px;" :key="index"></canvas>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible2"
      width="30%"
      top="20%"
      :before-close="handleClose2">
      <el-form>
        <el-form-item>
          <el-input v-model="returnID" placeholder="Put your mouse cursor here" clearable @keyup.enter.native="returnBook2" @click="returnBook2" @clear="returnBook2"></el-input>
        </el-form-item>
        <img  src="./scanner.png">
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="returnBook2">Return</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import JsBarcode from "jsbarcode";
export default {
  name: "borrow-book",
  data(){
    return{
      menuName: 'borrow list',
      searchID:'',
      returnID:'',
      query: {
        bookNo: '',
        pageNum: 1,
        pageSize: 10,
        borrowIdentityNo: ''
      },
      tableTitle: [
        {prop: 'bookNo',label: 'Borrow Book ISBN' ,width: 200},
        {prop: 'bookId',label: 'Borrow Book Id' ,width: 200},
        {prop: 'bookName',label: 'Borrow Book Name' ,width: 200},
        {prop: 'borrowIdentityNo',label: 'Borrower' ,width: 140},
        {prop: 'startDate',label: 'Borrow Time',width: 150},
        {prop: 'endDate',label: 'Due Time',width: 150},
        {prop: 'expireFlag',label: 'Expired',width: 120,isHtml: true}
      ],
      reservetableTitle: [
        {prop: 'bookNo',label: 'Reserve Book ISBN' ,width: 200},
        {prop: 'bookId',label: 'Reserve Book Id' ,width: 200},
        {prop: 'bookName',label: 'Reserve Book Name' ,width: 200},
        {prop: 'borrowIdentityNo',label: 'Borrower' ,width: 140},
        {prop: 'startDate',label: 'Reserve Time',width: 200},
        {prop: 'endDate',label: 'Due Time',width: 200},
        {prop: 'expireFlag',label: 'Expired',width: 200,isHtml: true}
      ],
      tableData: [],
      tableData2: [],
      tableData3:[],
      reservetableData:[],
      total1: 0,
      total2: 0,
      dialogVisible:false,
      dialogVisible2:false,
      url:"12345678",
      drawTiming:'',
      options :{
        format:"CODE128",
        displayValue:true,
        fontSize:18,
        height:100
      },
      trayList:[]
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
              expireFlag: currentTime>endTime ? '<span class="expireFlag">expired</span>' : 'unexpired',
              lost: item.lost === 1,
              damage: item.damage === 1
            }

          }).filter(item=>item.borrowIdentityNo === this.user.username && item.deleteFlag === 0&&item.kind==0);
          this.total1 = this.tableData.length;
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
              expireFlag: currentTime>endTime ? '<span class="expireFlag">expired</span>' : 'unexpired',
              lost: item.lost === 1,
              damage: item.damage === 1
            }
          }).filter(item=>item.deleteFlag === 0&&item.kind==0);
          this.total1 = this.tableData.length;
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
              expireFlag: currentTime>endTime ? '<span class="expireFlag">expired</span>' : 'unexpired',
              lost: item.lost === 1,
              damage: item.damage === 1
            }

          }).filter(item=>item.borrowIdentityNo === this.user.username && item.deleteFlag === 0&&item.kind==1);
          this.total2 = this.reservetableData.length
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
              expireFlag: currentTime>endTime ? '<span class="expireFlag">expired</span>' : 'unexpired',
              lost: item.lost === 1,
              damage: item.damage === 1
            }
          }).filter(item=>item.deleteFlag === 0&&item.kind==1);
          this.total2 = this.reservetableData.length;
        })
      }
    },
    listBorrowBook2(){
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

          }).filter(item=>item.borrowIdentityNo === this.user.username && item.deleteFlag === 0&&item.kind==0&&item.bookId === this.searchID);
          this.total1 = this.tableData.length;
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
          }).filter(item=>item.deleteFlag === 0&&item.kind==0&&item.bookId === this.searchID);
          this.total1 = this.tableData.length;
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

          }).filter(item=>item.borrowIdentityNo === this.user.username && item.deleteFlag === 0&&item.kind==1&&item.bookId === this.searchID);
          this.total2 = this.reservetableData.length
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
          }).filter(item=>item.deleteFlag === 0&&item.kind==1&&item.bookId === this.searchID);
          this.total2 = this.reservetableData.length;
        })
      }
    },
    searchBorrowBook(){
      if(this.searchID==='')
        this.listBorrowBook();
      else
        this.listBorrowBook2()
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
    returnBook2(){
      this.$http.post('/api/borrow/book/list', {}).then(res=>{
        this.tableData2 = res.data.data.list.map(item=>{
          return {
            ...item,
          }
        }).filter(item=>item.deleteFlag === 0&&item.kind==0&&item.bookId===this.returnID);
        if(this.tableData2.length===0)
          this.$message.warning('error book id')
        else{
          let params = {
            borrowBookId: this.tableData2[0].id,
            bookNo : this.tableData2[0].bookNo,
          }
          this.$http.post('/api/return/book',params).then(res=>{
            if(res.data.code !== 200){
              this.$message.warning(res.data.message);
              return;
            }
            this.$message.success("success");
            this.listBorrowBook();
            this.returnID = ''
          }).catch(error=>{})
        }
      })
    },
    showBarcode(row){
      this.$http.post('/api/borrow/book/list',{}).then(res=>{
        this.tableData3 = res.data.data.list.map(item=>{
          return {
            ...item,
            bookId:item.bookId
          }
        }).filter(item=>item.borrowIdentityNo === this.user.username&&item.bookNo === row.bookNo||this.user.accountType==1&&item.bookId === row.bookId);
        this.trayList.push(this.tableData3[0].bookId)
        this.$nextTick(()=>{
          this.trayList.forEach((item,index)=>{
            JsBarcode('#trayItem'+index, item, this.options);
          })
        })
      })
      this.dialogVisible=true
      this.trayList=[]
    },
    handleSizeChange(newValue){
      this.query.pageSize = newValue;
      this.listBorrowBook();
    },
    handleCurrentChange(newValue){
      this.query.pageNum = newValue;
      this.listBorrowBook();
    },
    handleClose(){
      this.dialogVisible = false
    },
    barcodereturn(){
      this.dialogVisible2 = true
    },
    handleClose2(){
      this.dialogVisible2 = false
    },
    setLost(row){
      let lost = row.lost;
      let params = {};
      params.id = row.id;
      if(lost){
        params.lost = 1
      }else {
        params.lost = 0
      }

      this.$http.post("/api/borrow/book/update",params).then(res=>{
        if(res.data.code !== 200){
          this.$message.warning(res.data.message);
        }
      }).catch(error=>{
        this.$message.error(error);
      });

    },
    setDamage(row){
      let damage = row.damage;
      let params = {};
      params.id = row.id;
      if(damage){
        params.damage = 1
      }else {
        params.damage = 0
      }

      this.$http.post("/api/borrow/book/update",params).then(res=>{
        if(res.data.code !== 200){
          this.$message.warning(res.data.message);
        }
      }).catch(error=>{
        this.$message.error(error);
      });

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
.el-dialog .el-dialog__body{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
