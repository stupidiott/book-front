<template>
  <div class="dashboard">
    <edu-breadcrumb :menu-name="menuName">
    </edu-breadcrumb>
    <div class="container">
      <div class="row">
        <Card
          title="Current Borrowed books"
          :number="number1"
          :backgroundcolor="color1"
          :cla="el1"/>
        <Card
          title="Last Return Books"
          :number="number2"
          :backgroundcolor="color2"
          :cla="el2"/>
        <Card
          title=" Fine Amount (total)"
          :number="number3"
          :backgroundcolor="color3"
          :cla="el3"/>
        <Card
          title="Reserve Status"
          :number="number4"
          :backgroundcolor="color4"
          :cla="el4"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Card from '../../components/Card.vue'
  import {mapState} from "vuex";
  export default {
    name: 'bookdashboard',
    components: {
      Card
    },
    data () {
      return{
        query: {
          bookNo: '',
          pageNum: 1,
          pageSize: 10,
          borrowIdentityNo: ''
        },
        menuName:"Book Dashboard",
        number1:'',color1:"#AFEEEE",el1:"el-icon-reading",
        number2:'',color2:"#BA55D3",el2:"el-icon-copy-document",
        number3:'不会算',color3:"#32CD32",el3:"el-icon-edit-outline",
        number4:'不会算',color4:"#F08080",el4:"el-icon-s-opportunity"
      }
    },
    mounted() {
      this.borrowAndLastBorrowNum()
    },
    computed: {
      // 第一种写法
      ...mapState(['user','token'])
    },
    methods:{
      borrowAndLastBorrowNum() {
        this.$http.post('/api/borrow/book/list',this.query).then(res=>{
          let tableData = res.data.data.list.map(item=>{
            return {
              ...item,
            }
          }).filter(item=>item.borrowIdentityNo === this.user.username && item.deleteFlag === 0&&item.kind===0);
          this.number1 = tableData.length;
          if (tableData.length ===0 )
            this.number2 = '0'
          else {
            this.number2 = tableData[0].bookName
          }
        })
      },
    }

  }
</script>

<style scoped>
  .container {
    background-color:white;
  }
</style>


