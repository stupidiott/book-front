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
                Borrow Date：
              </td>
              <td>
                <div>{{this.borrowdate}}</div>
              </td>
            </tr>
            <tr>
              <td class="title">
                Return Date：
              </td>
              <td>
                <div >{{this.returndate}}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="btn">
          <el-button type="primary" @click="borrowBook" :disabled="btnDisabled">Submit</el-button>
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
            borrowdate:'',
            returndate:'',
            borrowBookForm:{
              borrowIdentityNo: '',
              bookNo: '',
              startTime: '',
              endTime: '',
              status:''
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
              this.borrowdate = +year + '-' + month + '-' + day;

              date.setDate(date.getDate() + 10)//10days 过期
              day = this.judzero(date.getDate());
              month = this.judzero(date.getMonth()+1);
              year = date.getFullYear();
              this.returndate = +year + '-' + month + '-' + day;


            }, 1000)

          },
          judzero(num){
            if(num<10)
              num = '0' + num;
            return num;
          },
          borrowBook(){
            this.btnDisabled = false;
            this.borrowBookForm.borrowIdentityNo = this.user.username;
            this.borrowBookForm.startTime = this.borrowdate;
            this.borrowBookForm.endTime = this.returndate;
            let params = this.borrowBookForm;
            this.$http.post('/api/borrow/book/add',params).then(res=>{
              if(res.data.code != 200){
                this.$message.warning('Fail！');
                return;
              }
              this.$router.push({
                path: '/borrowBookList'
              })
              this.$message.success('Success！');
            })
          }
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
