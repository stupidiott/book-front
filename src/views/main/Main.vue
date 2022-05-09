<template>
  <div class="el-container">
    <div class="el-container">
      <el-container>
        <el-header>
          <div>{{schoolName}}Library Management System</div>
          <div>
            <el-dropdown>
              <el-button type="text" >{{user.username}}</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="setting">
                  <el-button type="text" @click="modifyPassword">Modify</el-button>
                  <el-divider></el-divider>
                  <el-button type="text" @click="showBarcode">Barcode</el-button>
                  <el-divider></el-divider>
                  <el-button type="text" @click="logout">Exit</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-container class="content">
          <el-aside width="200px">
            <el-menu default-active="2"
                     background-color="rgb(51,55,68)"
                     text-color="#fff"
                     active-text-color="#409EFF"
                     :unique-opened="true"
                     :router="true">
              <!--首页-->
              <el-menu-item :index="homeUrl">
                <i class="el-icon-document"></i>
                <span slot="title" class="font-size">Home</span>
              </el-menu-item>
              <!--一级导航菜单-->
              <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                <!--一级菜单icon和名称-->
                <template slot="title">
                  <i :class="item.iconClass"></i>
                  <span class="font-size" style="margin-left: 2px">{{item.name}}</span>
                </template>
                <!--二级子菜单-->
                <el-menu-item :index="child.path" v-for="child in item.children" :key="child.id" v-if="item.children">
                  <span class="font-size" style="margin-left: 16px">{{child.name}}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div>
      <el-dialog
        title="Modify password"
        :visible.sync="modifyPasswordDialogVisible"
        width="30%"
      >
        <el-form ref="accountModifyPasswordFormRef" :rules="accountModifyPasswordFormRule" :model="accountModifyPasswordForm" label-width="180px">
          <el-form-item label="Enter old password：" prop="oldPassword">
            <el-input v-model="accountModifyPasswordForm.oldPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="Enter new password：" prop="newPassword">
            <el-input v-model="accountModifyPasswordForm.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="Enter again：" prop="confirmNewPassword">
            <el-input v-model="accountModifyPasswordForm.confirmNewPassword" type="password"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyPasswordDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitModifyPassword">Confirm</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogVisible"
        width="73%"
        top="5%"
        :before-close="handleClose">
        <div  v-for="(item,index) in trayList2" :key="index">
          <canvas :id="'trayItem'+index"  style="width:200px;height:80px;" :key="index"></canvas>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

  import Storage from '@/utils/localStorage'
  import {mapState} from 'vuex'
  import JsBarcode from "../../../JsBarcode";

  const schoolName = window.PLATFORM_CONFIG.schoolName;

  export default {
    name: 'Main',
    data(){
      return{
        homeUrl: '/home',
        menuList: '',
        modifyPasswordDialogVisible:false,
        dialogVisible:false,
        accountModifyPasswordForm: {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        },
        accountModifyPasswordFormRule:{
          oldPassword: [
            { required: true, message: 'Old password cannot be empty', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: 'New password cannot be empty', trigger: 'blur' }
          ],
          confirmNewPassword: [
            { required: true, message: 'New password cannot be empty', trigger: 'blur' }
          ]
        },
        trayList2:[],
      }
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
    mounted(){
      this.queryAccountMenu();
    },
    methods:{
        queryAccountMenu(){
          this.$http.get("/api/account/menu").then(res=>{
            if(res.data.code !== 200){
              return this.$message.warning(res.data.message);
            }
            this.menuList = JSON.parse(res.data.data);
          }).catch(error=>{
            this.$message.error(error);
          });
        },
        logout(){
            // 删除token
            Storage.removeItem('token');
            // 跳转到首页
            this.$router.push("/login");
        },
      showBarcode(){
        this.$http.post('/api/borrow/book/list',{}).then(res=>{
          this.trayList2.push(this.user.username)
          this.$nextTick(()=>{
            this.trayList2.forEach((item,index)=>{
              JsBarcode('#trayItem'+index, item, this.options);
            })
          })
        })
        this.dialogVisible=true
        this.trayList2=[]
      },
      handleClose(){
          this.dialogVisible = false;
      },
        modifyPassword(){
            this.modifyPasswordDialogVisible = true;
            this.accountModifyPasswordForm = {}
        },
        submitModifyPassword(){

          let vm = this;

          this.$refs.accountModifyPasswordFormRef.validate((valid) => {
            if (valid) {

              if(this.accountModifyPasswordForm.newPassword !== this.accountModifyPasswordForm.confirmNewPassword){
                return this.$message.warning("The two input passwords are not the same");
              }

              this.$http.post("/api/account/modify/password",vm.accountModifyPasswordForm).then(res=>{
                if(res.data.code !== 200){
                  return this.$message.warning(res.data.message);
                }
                this.modifyPasswordDialogVisible = false;
                this.$message.success("Success");
              }).catch(error=>{
                this.$message.error(error);
              })
            } else {
              return false;
            }
          });
        }
    }
  };
</script>


<style scoped="scoped">

  .el-container {
    height: 100%;
  }

  .el-header{
    background: rgb(55,61,65);
    display:flex;
    justify-content: space-between;
    line-height: 60px;
    color: #fff;
    font-size: 22px;
  }

  .content{
    overflow-y: hidden;
  }

  .el-header img{
    vertical-align: middle;
  }

  .el-aside {
    background: rgb(51,55,68);
  }

  .el-main {
    background: rgb(234,237,241);
  }

  .font-size{
    font-size: 16px;
  }

  .setting{
    display: flex;
    flex-direction: column;
  }

  .setting:hover{
    background: #fff !important;
  }

  .el-divider--horizontal{
    margin: 2px auto;
  }

  .el-dropdown-menu{
    background: #fff;
  }

</style>
