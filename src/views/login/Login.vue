<template>
  <div class="login-container" ref="loginRef">
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="repulse"
      class="login-bg"
    >
    </vue-particles>
    <div class="login-box">
      <h2>Welcome to the LMS</h2>
      <el-form :model="loginForm" class="login-form">
        <el-form-item>
          <el-input prop="username"
                    prefix-icon="el-icon-user"
                    placeholder="请输入用户名"
                    v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            type="password"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="primary" native-type="login" @click.prevent="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

  import {login} from '@/api/login/loginApi.js'
  import {queryAccount} from "../../api/account/accountApi";

  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: 'admin'
        }
      };
    },
    mounted(){
        this.$refs.loginRef.style.height=`${document.documentElement.clientHeight}px`;
    },
    methods:{
      login(){

        login("/api/user/login",JSON.stringify(this.loginForm)).then(res=>{
            console.log(res);
            if(res.data.code !== 200){
                return this.$message.error(res.data.message);
            }
            // 设置cookie
            this.$cookies.set('token',res.data.data);
            this.$store.dispatch('asyncUpdateToken',res.data.data);
            queryAccount("/api/account/query").then(res=>{
              this.$store.dispatch('asyncUpdateUser',res.data.data);
            }).catch(error=>{
              this.$message.error(error.data.message);
            })
            // 跳转到首页
            this.$router.push('/main');
        }).catch(error=>{
            this.$message.error(error.data.message);
        })
      }
    }
  }
</script>
<style scoped>

  .login-container{
    padding: 0;
    margin: 0;
    overflow-y: hidden;
  }

  .login-bg{
    background: url(../../assets/login_bg.png) no-repeat;
    background-size: cover;
    overflow-y: hidden;
  }
  .login-box{
    width: 320px;
    height: 260px;
    background: rgba(255,255,255,0.6);
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%);
    text-align: center;
  }
  .login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
