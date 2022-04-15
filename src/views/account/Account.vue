<template>
    <div>
        <!--面包屑-->
        <edu-breadcrumb :menu-name="menuName">
        </edu-breadcrumb>

        <!--搜索条件-->
        <edu-search>
          <el-row :gutter="4">
            <el-col :span="4">
              <el-input v-model="query.username" placeholder="Input username" clearable @keyup.enter.native="searchUser" @click="searchUser" @clear="searchUser"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button icon="el-icon-search" type="primary" @click="searchUser"></el-button>
            </el-col>
          </el-row>
        </edu-search>


        <div style="margin-top: 10px">
          <el-button type="primary" size="small" @click="addAccount" v-show="user.accountType !== 3">Add</el-button>
        </div>
        <!--显示内容-->
        <edu-table :titles="titles"
                   :table-data="tableData"
                   :visible-operation="true"
                   :visible-delete="false"
                   :visible-edit="false"
                   :visible-setting-auth="true"
                   :visible-switch="true"
                   :visible-reset-password="true"
                   @settingAuth="settingAuth"
                   @resetPassword="resetPassword"
                   @editRow="editAccount"
                   @changeStatus="changeStatus">
        </edu-table>
        <edu-page :current-page="query.pageNum"
                  :page-size="query.pageSize"
                  :total="total"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange">
        </edu-page>

      <el-dialog
        title="Add Account"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form ref="accountFormRef" :rules="accountFormRule" :model="accountForm" label-width="120px">
        <el-form-item label="Username：" prop="username">
          <el-input v-model="accountForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Password：" prop="password">
          <el-input v-model="accountForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Usertype：" prop="accountType">
          <edu-select @handleSelectValue="handleSelectAccountType" :value="accountForm.accountType" :options="accountTypeOptions"></edu-select>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitUser">Confirm</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="Reset"
        :visible.sync="resetPasswordDialogVisible"
        width="30%"
      >
        <div class="resetPassword">
          <div>
            <span style="color: red">*</span><span class="title">Enter password：</span>
            <el-input v-model="accountResetPasswordForm.password" type="password"></el-input>
          </div>
          <div style="margin-top: 10px">
            <span style="color: red">*</span><span class="title">Enter again：</span>
            <el-input v-model="accountResetPasswordForm.confirmPassword" type="password"></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetPasswordDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitResetPassword">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>

    import {getAccountList,setAccountAuth,resetPassword} from '@/api/account/accountApi.js'
    import ElRadio from "element-ui/packages/radio/src/radio";
    import {mapState} from 'vuex'
    import common from '@/api/common/common.js'

    export default {
      components: {ElRadio},
      name: "Account",
        data(){
            return{
                menuName: 'Account Management',
                loading: false,
                dialogVisible: false,
                authDialogVisible: false,
                resetPasswordDialogVisible:false,
                accountTypeOptions: [
                  {
                    label: 'Librarian',
                    value: 1
                  },
                  {
                    label: 'Member',
                    value: 4
                  }
                ],
                accountForm:{
                    username: '',
                    password: '',
                    accountType: ''
                },
                accountAuthForm:{
                    id: '',
                    clazzIdList: []
                },
                accountResetPasswordForm:{
                    id: '',
                    password: '',
                    confirmPassword: ''
                },
                query: {
                    username: '',
                    pageNum: 1,
                    pageSize: 10
                },
                titles: [
                    {prop: 'username',label: 'Username' },
                    {prop: 'accountTypeStr',label: 'Type' },
                    {prop: 'createTime',label: 'Create Time'},
                    {prop: 'lastLoginTime',label: 'Recently Login'},
                    // {prop: 'auth',label: '权限'},
                ],
                clazzList: [],
                tableData: [],
                total: 0,
                accountFormRule:{
                    username: [
                        { required: true, message: 'Input username', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Input password', trigger: 'blur' }
                    ],
                    accountType: [
                        { required: true, message: 'Select usertype', trigger: 'blur' }
                    ]
                }
            }
        },

        mounted(){
          this.getAccountList();
        },

        computed:{
          ...mapState(['user'])
        },

        watch:{

        },

        methods:{

            async getAccountList(){

                this.loading = true;

                const {data:res} = await getAccountList('/api/account/list',this.query);

                this.loading = false;

                if(res.code !== 200){
                    return this.$message.error(res.message);
                }

                this.tableData = res.data.list;

                this.tableData.forEach(item=>{
                    item.active = item.status === 1;
                    let authStr = "";
                    if(item.authList && item.authList.length>0){
                      let arrClazzName = item.authList.map(item=>{
                        return item.department+"/"+item.clazzName;
                      })
                      authStr = arrClazzName.join(",")
                    }else {
                        authStr = "全部";
                    }
                    item.auth = authStr;
                    if(item.accountType === 1){
                      item.accountTypeStr = 'Librarian';
                    }else if(item.accountType === 4){
                      item.accountTypeStr = 'Member';
                    }else{
                      item.accountTypeStr = '';
                    }
                })

                this.total = Number.parseInt(res.data.total);

            },
            handleSelectAccountType(value){
              this.accountForm.accountType = value;
            },
            changeStatus(row){
                let active = row.active;
                let params = {};
                params.id = row.id;
                if(active){
                    params.status = 1
                }else {
                    params.status = 0
                }

                this.$http.post("/api/account/update",params).then(res=>{
                    if(res.data.code !== 200){
                        this.$message.warning(res.data.message);
                    }
                    this.getAccountList();
                }).catch(error=>{
                    this.$message.error(error);
                });

                this.tableData.forEach(item=>{
                    if(item.id === row.id){
                        item.active = !item.active;
                        if(item.active){
                            item.status = 1
                        }else {
                            item.status = 0
                        }
                    }
                })
            },

            addAccount(){
              this.dialogVisible = true;
              common.resetFields(this,'accountFormRef');
              this.accountForm = {
                username: '',
                password: '',
                accountType: ''
              };
            },

            submitUser(){
                let vm = this;
                this.$refs.accountFormRef.validate((valid) => {
                    if (valid) {
                        this.$http.post("/api/account/add",vm.accountForm).then(res=>{
                            if(res.data.code !== 200){
                                return this.$message.warning(res.data.message);
                            }
                            this.dialogVisible = false;
                            this.$message.success("添加成功");
                            this.getAccountList();
                        }).catch(error=>{
                            this.$message.error(error);
                        })
                    } else {
                        return false;
                    }
                });
            },

            editAccount(){

            },

            settingAuth(row){
                this.authDialogVisible = true;

                this.accountAuthForm.id = row.id;
                if(row.authList && row.authList.length>0){
                  this.accountAuthForm.clazzIdList = row.authList.map(item=>{
                    return item.clazzId;
                  })
                }else{
                  this.accountAuthForm.clazzIdList = [];
                }
            },

            async submitSettingAuth(){

              let params = this.accountAuthForm;

              const {data:res} = await setAccountAuth('/api/account/setting/auth',params);

              if(res.code !== 200){
                return this.$message.error(res.message);
              }

              this.authDialogVisible = false;
              this.$message.success("设置权限成功");
              // 重新加载数据
              this.getAccountList();

            },

            resetPassword(row){
              this.resetPasswordDialogVisible = true;
              this.accountResetPasswordForm = {};
              this.accountResetPasswordForm.id = row.id;

            },


            async submitResetPassword(){

              if(!this.accountResetPasswordForm.password){
                return this.$message.warning("请输入密码不能为空");
              }

              if(!this.accountResetPasswordForm.password){
                return this.$message.warning("请再次输入密码不能为空");
              }

              if(this.accountResetPasswordForm.password !== this.accountResetPasswordForm.confirmPassword){
                  return this.$message.warning("两次输入的密码不一样");
              }

              let params = this.accountResetPasswordForm;

              const {data:res} = await resetPassword('/api/account/reset/password',params);

              if(res.code !== 200){
                return this.$message.warning(res.message);
              }

              this.resetPasswordDialogVisible = false;
              this.$message.success("重置密码成功");
              // 重新加载数据
              this.getAccountList();
            },

            handleSelectClazz(selectValue){
                this.accountAuthForm.clazzIdList = selectValue;
            },

            handleClose(){
                this.dialogVisible = false;
            },

            searchUser(){
                this.getAccountList();
            },
            handleSizeChange(newPageSize){
                this.query.pageSize = newPageSize;
                this.getAccountList();
            },
            handleCurrentChange(newPageNum){
                this.query.pageNum = newPageNum;
                this.getAccountList();
            }
        }
    }
</script>

<style lang="less" scoped>

  .settingAuth{
    display: flex;
    .title{
      display: block;
      line-height: 40px;
    }
  }

</style>
