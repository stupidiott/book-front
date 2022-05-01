<template>
  <div class="borrowBook">
      <!--面包屑-->
      <edu-breadcrumb :menu-name="menuName">
      </edu-breadcrumb>
      <div class="main">
        <div class="content">
          <table>
<!--            <tr class="borrowIdentityNo">-->
<!--              <td class="title">-->
<!--                借阅人身份证号：-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="borrowBookForm.borrowIdentityNo" placeholder="请输入借阅人身份证号"></el-input>-->
<!--              </td>-->
<!--            </tr>-->
            <tr class="bookNo">
              <td class="title">
                Title：
              </td>
              <td>
                <el-select v-model="borrowBookForm.bookNo" filterable placeholder="Select a book ">
                  <el-option
                    v-for="(item,index) in bookOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value" >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.status }} copies</span>
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="title">
                Current time：
              </td>
              <td>
                <div>{{this.borrowdate}}</div>
              </td>
            </tr>
            <tr>
              <td class="title">
                Borrow due Date：
              </td>
              <td>
                <div >{{this.returndate}}</div>
              </td>
            </tr>
            <tr>
              <td class="title">
                Advance due time：
              </td>
              <td>
                <div >{{this.reservetime}}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="btn">
          <el-button type="primary" @click="borrowBook(0)" :disabled="btnDisabled">borrow</el-button>
          <el-button type="primary" @click="borrowBook(1)" :disabled="btnDisabled">reserve</el-button>
        </div>
      </div>
  </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "borrow-book",
        data(){
          return{
            menuName: 'Borrow book',
            btnDisabled: false,
            bookOptions: [],
            tableData: [],
            borrowdate:'',
            returndate:'',
            reservetime:'',
            borrowBookForm:{
              borrowIdentityNo: '',
              bookNo: '',
              startTime: '',
              endTime: '',
              status:'',
              kind:''
            }
          }
        },
        mounted(){
          this.listBook();
          this.time();
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
          listBook(){
            if(this.user.debt!=0){
              this.$router.push({
                path: '/home'
              })
              return;
            }
            this.$http.post('/api/borrow/book/list', {}).then(res => {
              this.tableData = res.data.data.list.map(item => {
                return {
                  ...item,
                }
              }).filter(item => item.borrowIdentityNo === this.user.username && item.deleteFlag === 0 && item.kind == 1);
              if (this.tableData.length > 0) {
                let currentTime = new Date().getTime();
                let endTime = new Date(this.tableData[0].endTime).getTime();
                if(currentTime-endTime>0){
                  this.$message.warning('Your book which you have reserved is overdue, please cancel it')
                  this.$router.push({
                    path: '/borrowBookList'
                  })
                  return;
                }
                this.$confirm('You have the book reserved,Do you want to Check out it?','Check out',{
                  confirmButtonText: 'Check out',
                  cancelButtonText: 'not right now'
                }).then(()=>{
                    let params = {
                      borrowBookId: this.tableData[0].id,
                      bookNo : this.tableData[0].bookNo,
                    }
                    this.$http.post('/api/return/book',params).then(res=>{
                      if(res.data.code !== 200){
                        this.$message.warning(res.data.message);
                        return;
                      }})
                  this.borrowBookForm.bookNo = this.tableData[0].bookNo
                  this.borrowBook(0)
                })
              }})
            this.$http.post('/api/book/list',{}).then(res=>{
              this.bookOptions = res.data.data.list.map(item=>{
                return{
                  ...item,
                  label: item.bookName,
                  value: item.bookNo,
                  status: item.status
                }
              }).filter(item=>item.status !== 0)
            }).catch(error=>{})
          },
          time() {
            this.timing = setInterval(() => {
              let date = new Date();
              let day = this.judzero(date.getDate());
              let month = this.judzero(date.getMonth()+1);
              let year = date.getFullYear();
              let seconds = this.judzero(date.getSeconds());
              let min = this.judzero(date.getMinutes());
              let hour = this.judzero(date.getHours());
              this.borrowdate = +year + '-' + month + '-' + day+' '+hour+':'+min+':'+seconds;

              //图书馆不会半夜开门不需要判断
              hour = this.judzero(date.getHours() + 4);
              this.reservetime = +year + '-' + month + '-' + day+' '+hour+':'+min+':'+seconds;

              date.setDate(date.getDate() + 10)//10days 过期
              day = this.judzero(date.getDate());
              month = this.judzero(date.getMonth()+1);
              year = date.getFullYear();
              hour = this.judzero(date.getHours());
              this.returndate = +year + '-' + month + '-' + day+' '+hour+':'+min+':'+seconds;


            }, 1000)

          },
          judzero(num){
            if(num<10)
              num = '0' + num;
            return num;
          },
          borrowBook(kind){
            if(this.borrowBookForm.bookNo==''){
              this.$message.warning('Please select a book !');
              return;
            }
            if(kind==0) {
              this.$http.post('/api/borrow/book/list', {}).then(res => {
                this.tableData = res.data.data.list.map(item => {
                  return {
                    ...item,
                  }
                }).filter(item => item.borrowIdentityNo === this.user.username && item.deleteFlag === 0 && item.kind == 0);

                if (this.tableData.length > 4) {
                  this.$message.warning('You can only borrow no more than FIVE books !');
                } else {
                  for (let i = 0; i < this.tableData.length; i++) {
                    if (this.borrowBookForm.bookNo === this.tableData[i].bookNo) {
                      this.$message.warning('DO NOT borrow the same book !');
                      return
                    }
                  }
                  this.btnDisabled = false;
                  this.borrowBookForm.borrowIdentityNo = this.user.username;
                  this.borrowBookForm.startTime = this.borrowdate;
                  this.borrowBookForm.endTime = this.returndate;
                  this.borrowBookForm.kind = kind;
                  let params = this.borrowBookForm;
                  this.$http.post('/api/borrow/book/add', params).then(res => {
                    if (res.data.code != 200) {
                      this.$message.warning('Fail！');
                      return;
                    }
                    this.$router.push({
                      path: '/borrowBookList'
                    })
                    this.$message.success('Success！');
                  })
                }
              })
            }
            else{
              this.$http.post('/api/borrow/book/list', {}).then(res => {
                this.tableData = res.data.data.list.map(item => {
                  return {
                    ...item,
                  }
                }).filter(item => item.borrowIdentityNo === this.user.username && item.deleteFlag === 0 && item.kind == 1);

                if (this.tableData.length > 0) {
                  this.$message.warning('You can only reserve one books !');
                  return
                }
                  this.btnDisabled = false;
                  this.borrowBookForm.borrowIdentityNo = this.user.username;
                  this.borrowBookForm.startTime = this.borrowdate;
                  this.borrowBookForm.endTime = this.reservetime;
                  this.borrowBookForm.kind = kind;
                  let params = this.borrowBookForm;
                  this.$http.post('/api/borrow/book/list', {}).then(res => {
                    this.tableData = res.data.data.list.map(item => {
                      return {
                        ...item,
                      }
                    }).filter(item => item.borrowIdentityNo === this.user.username && item.deleteFlag === 0 && item.kind == 0);
                    for (let i = 0; i < this.tableData.length; i++) {
                      if (this.borrowBookForm.bookNo === this.tableData[i].bookNo) {
                        this.$message.warning('DO NOT reserve the book you have borrowed !');
                        return
                      }
                    }
                    this.$http.post('/api/borrow/book/add', params).then(res => {
                      if (res.data.code != 200) {
                        this.$message.warning('Fail！');
                        return;
                      }
                      this.$router.push({
                        path: '/borrowBookList'
                      })
                      this.$message.success('Success！');
                    })
                    })
                    })

                }

            }
            // this.btnDisabled = false;
            // this.borrowBookForm.borrowIdentityNo = this.user.username;
            // this.borrowBookForm.startTime = this.borrowdate;
            // this.borrowBookForm.endTime = this.returndate;
            // let params = this.borrowBookForm;
            // this.$http.post('/api/borrow/book/add',params).then(res=>{
            //   if(res.data.code != 200){
            //     this.$message.warning('Fail！');
            //     return;
            //   }
            //   this.$router.push({
            //     path: '/borrowBookList'
            //   })
            //   this.$message.success('Success！');
            // })
          }

    }


</script>

<style scoped lang="less">
  .borrowBook{
    height: 100%;
    .main{
      margin-top: 15px;
      .content{
        background: #fff;
        font-size: 14px;
        table{
          width: 100%;
          border: 1px solid #eee;
          .title{
            width: 200px;
            background: #eee;
            text-align: right;
          }
        }
      }
      .btn{
        text-align: center;
        margin-top: 15px;
      }
    }
  }
</style>

<style lang="less">
  .borrowBook{
    .borrowIdentityNo{
      .el-input{
        width: 15%;
      }
    }
    .bookNo{
      .el-input{
        width: 220px;
      }
    }
  }
</style>
