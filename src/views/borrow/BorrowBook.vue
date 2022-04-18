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
                  <el-option v-for="(item,index) in bookOptions" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="title">
                Borrow Date：
              </td>
              <td>
                <div id="BorrowDate"> </div>
              </td>
            </tr>
            <tr>
              <td class="title">
                Return Date：
              </td>
              <td>
                <div id="ReturnDate"> </div>
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
            menuName: '借阅图书',
            btnDisabled: false,
            bookOptions: [],
            borrowBookForm:{
              borrowIdentityNo: '',
              bookNo: '',
              startTime: '',
              endTime: '',
            }
          }
        },
        mounted(){
          this.listBook();
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
                  value: item.bookNo
                }
              }).filter(item=>item.status !== 0)
            }).catch(error=>{})
          },
          borrowBook(){
            this.btnDisabled = false;
            this.borrowBookForm.borrowIdentityNo = this.user.username;
            this.borrowBookForm.startTime = new Date();
            this.borrowBookForm.endTime = new Date(new Date().getTime() + 24*60*60*1000*10);
            alert(this.borrowBookForm.endTime)
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


    window.onload=function(){
      setInterval(function(){
        let date = new Date();
        let year=date.getFullYear(); //获取当前年份
        let mon = date.getMonth() + 1; //获取当前月份
        let da = date.getDate(); //获取当前日
        let bd = document.getElementById('BorrowDate');
        bd.innerHTML=+year+'-'+mon+'-'+da;
        let date2 = new Date(date.getTime() + 24*60*60*1000*10);
        let year2 = date2.getFullYear(); //获取当前年份
        let mon2 = date2.getMonth() + 1; //获取当前月份
        let da2 = date2.getDate(); //获取当前日
        let rd = document.getElementById('ReturnDate');
        rd.innerHTML=+year2+'-'+mon2+'-'+da2;
      },1)
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
