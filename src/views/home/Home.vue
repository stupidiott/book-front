<template>
  <div class="home" >
    <div class="main">
      <div  style="font-size: 100px">
        Welcome to the LMS
      </div>
      <div class="content" v-if="user.accountType==4">
        <table>
          <tr>
            <td class="title">
              Borrow available：
            </td>
            <td>
              <div>You can borrow {{this.borrow}} books now</div>
            </td>
          </tr>
          <tr>
            <td class="title">
              Reserve available：
            </td>
          <td>
            <div>You can borrow {{this.reserve}} books now</div>
          </td>
          </tr>
          <tr>
            <td class="title">
              Borrowing expired：
            </td>
            <td>
              <div >You have {{this.borrowexpireFlag}} books expired</div>
            </td>
          </tr>
          <tr>
            <td class="title">
              Reservation expired：
            </td>
            <td>
              <div >You have {{this.reserveexpireFlag}} books expired</div>
            </td>
          </tr>
          <tr>
            <td class="title">
              Lost books
            </td>
            <td>
              <div >You have lost {{this.lost}} books now</div>
            </td>
          </tr>
          <tr>
            <td class="title">
              Damage books
            </td>
            <td>
              <div >You have damaged {{this.damage}} books now</div>
            </td>
          </tr>
          <tr>
            <td class="title">
              The amount should pay for：
            </td>
            <td>
              <div >{{this.debt}} yuan</div>
            </td>
          </tr>
        </table>
      </div>
      <div class="btn" v-if="user.accountType==4">
        <el-button type="primary" @click="pay" >pay</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Home",
        inject: ['reload'],
        data(){
          return{
            tableData:[],
            debt:0,
            borrow:5,
            reserve:2,
            borrowexpireFlag:'no',
            reserveexpireFlag:'no',
            lost:0,
            damage:0
          }
        },
        mounted(){
          this.notice();
          window.onresize = () => {
            return (() => {
              // 采用window.reload()，或者router.go(0)刷新时，整个浏览器进行了重新加载，闪烁，体验不好
              // 使用provide/inject组合
              this.reload();
            })();
          };
        },
        computed:{
          ...mapState(['user']),
        },
        methods: {
          pay(){
            let url = 'http://127.0.0.1:8081/onlinepay?name=' + this.user.username+'&price='+this.debt+'&paytype=1'
            window.open(url,'_self')
            let params = {
              username: this.user.username
            }
            // this.$http.post('/api/return/expiredbook',params).then(res=>{
            //   if(res.data.code !== 200){
            //     this.$message.warning(res.data.message);
            //     return;
            //   }
            //   this.user.debt = 0;
            //   this.reload();
            // })
          },
           notice(){
             this.$http.post('/api/account/list',{}).then(res=>{
               this.tableData = res.data.data.list.map(item=>{
                   return {
                     ...item,
                   }
                 })
               for (let i = 0; i < this.tableData.length; i++) {
                 if (this.user.username == this.tableData[i].username&&this.tableData[i].debt!=0) {
                   this.$message.warning('You have debts to pay. Please pay the debt or you will not be able to borrow books!.');
                   this.debt = this.tableData[i].debt;
                   this.user.debt = this.debt;
                 }
               }
               })
             this.$http.post('/api/borrow/book/list', {}).then(res => {
               this.tableData = res.data.data.list.map(item => {
                 return {
                   ...item,
                 }
               }).filter(item => item.borrowIdentityNo === this.user.username && item.deleteFlag === 0 && item.kind == 0);
               this.borrow = 5-this.tableData.length;
               let f = 0;
               let lost = 0;
               let damage = 0;
               for (let i = 0; i < this.tableData.length; i++) {
                 if (this.tableData[i].lost === 1) lost++;
                 if (this.tableData[i].damage === 1) damage++;
                 let currentTime = new Date().getTime();
                 let endTime = new Date(this.tableData[i].endTime).getTime();
                 if(currentTime-endTime>0){
                   this.borrowexpireFlag='';
                 }
                 else if(endTime-currentTime<=3558994){
                   f=1;
                 }
               }
               this.damage  = damage;
               this.lost = lost;
               if(f==1)
                 this.$message.warning('The book you have borrow is about to expire')
             })
             this.$http.post('/api/borrow/book/list', {}).then(res => {
               this.tableData = res.data.data.list.map(item => {
                 return {
                   ...item,
                 }
               }).filter(item => item.borrowIdentityNo === this.user.username && item.deleteFlag === 0 && item.kind == 1);
               this.reserve = 2-this.tableData.length;
               let f = 0;
               for (let i = 0; i < this.tableData.length; i++) {
                 let currentTime = new Date().getTime();
                 let endTime = new Date(this.tableData[i].endTime).getTime();
                 this.user.reserve = 0;
                if(currentTime-endTime>0){
                  this.reserveexpireFlag='';
                  this.user.reserve = 1;
                }
                else if(endTime-currentTime<=3558994){
                  f=1;
                }
               }
               if(f==1)
                 this.$message.warning('The book you have reserved is about to expire')
             })
             }
           }


    }
</script>

<style scoped lang="less">
.home{
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
