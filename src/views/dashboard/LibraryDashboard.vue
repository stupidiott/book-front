<template>
  <div class="dashboard">
    <edu-breadcrumb :menu-name="menuName">
    </edu-breadcrumb>
    <div class="container">
      <div class="row">
        <Card
          title="Total Registered Readers"
          :number="number1"
          :backgroundcolor="color1"
          :cla="el1"/>
        <Card
          title="Total Books"
          :number="number2"
          :backgroundcolor="color2"
          :cla="el2"/>
        <Card
          title="Total Book Copies"
          :number="number3"
          :backgroundcolor="color3"
          :cla="el3"/>
        <Card
          title="Total Borrows"
          :number="number4"
          :backgroundcolor="color4"
          :cla="el4"/>
        <Card
          title="Total Fine (UnPaid)"
          :number="number5"
          :backgroundcolor="color5"
          :cla="el5"/>
        <Card
          title="Total Lost Books"
          :number="number6"
          :backgroundcolor="color6"
          :cla="el6"/>
        <Card
          title="Total Damage Books"
          :number="number7"
          :backgroundcolor="color7"
          :cla="el7"/>
        <Card
          title="Total Fine Collected"
          :number="number8"
          :backgroundcolor="color8"
          :cla="el8"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Card from '../../components/Card.vue'
  import {mapState} from "vuex";
  import {getAccountList} from "../../api/account/accountApi";
  import bookApi from "../../api/book/bookApi";
  export default {
    name: 'librarydashboard',
    components: {
      Card
    },
    data () {
      return{
        availableCopy:'',
        query: {
          username: '',
          pageNum: 1,
          pageSize: 10,
          bookName: '',
        },
        menuName:"Library Dashboard",
        number1:'',color1:"#00BFFF",el1:"el-icon-s-custom",
        number2:'',color2:"#40E0D0",el2:"el-icon-reading",
        number3:'',color3:"#FFC0CB",el3:"el-icon-copy-document",
        number4:'',color4:"#D2691E",el4:"el-icon-collection",
        number5:'',color5:"#F0E68C",el5:"el-icon-thumb",
        number6:'',color6:"#E6E6FA",el6:"el-icon-coffee-cup",
        number7:'',color7:"#5F9EA0",el7:"el-icon-scissors",
        number8:'',color8:"#696969",el8:"el-icon-c-scale-to-original"
      }
    },
    mounted() {
      this.userNum()
      this.bookNum()
      this.borrowAndCopyNum()
      this.totalFine()
      this.totalLostAndDamage()
      this.debtHistory()
    },
    computed: {
      // 第一种写法
      ...mapState(['user','token'])
    },
    methods:{
      async userNum() {
        const {data: res} = await getAccountList('/api/account/list', this.query);
        this.loading = false;
        let tableData = res.data.list;
        let count = 0;
        tableData.forEach(item=>{
          if(item.accountType === 4){
            count++;
          }
        })
        this.number1 = count;
        },
      async bookNum() {
        let params = this.query;
        let count = 0;
        const {data: res} = await bookApi.list('/api/book/list', params);
        let tableData = res.data.list.map(item => {
          count += item.status;
          return {
            ...item,
          }
        })
        this.number2 = tableData.length;
        this.availableCopy = count;
      },
      async borrowAndCopyNum(){
        let params = this.query;
        let count = 0;
        this.$http.post('/api/borrow/book/list',params).then(res=>{
          let tableData = res.data.data.list.map(item=>{
            return {
              ...item,
            }
          }).filter(item=>item.deleteFlag === 0&&item.kind===0);
          this.number4 = tableData.length;
          this.number3 = tableData.length + this.availableCopy;
        })
      },
      async totalFine(){
        this.$http.post('/api/account/list',{}).then(res=>{
          let tableData = res.data.data.list.map(item=>{
            return {
              ...item,
            }
          })
          let count = 0;
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].debt!==0) {
              count += tableData[i].debt
            }
          }
          this.number5 = count;
        })
      },
      async totalLostAndDamage(){
        this.$http.post('/api/borrow/book/list', {}).then(res => {
          let tableData = res.data.data.list.map(item => {
            return {
              ...item,
            }
          }).filter(item => item.deleteFlag === 0 && item.kind === 0);
          let lost = 0;
          let damage = 0;
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].lost === 1) lost++;
            if (tableData[i].damage === 1) damage++;
          }
          this.number6  = lost;
          this.number7 = damage;
        })
      },
      async debtHistory(){
        let params = this.query;
        let count = 0;
        params.deleteFlag = 1;
        this.$http.post('/api/borrow/book/list',params).then(res=>{
          let tableData = res.data.data.list.map(item=>{
            return {
              ...item,
            }
          }).filter(item=>item.kind===0);
          for (let i = 0; i < tableData.length; i++){
            let endTime = new Date(tableData[i].endTime).getTime()
            let returnTime = new Date(tableData[i].returnTime).getTime()
            if (tableData[i].lost === 1) count += 10;
            if (tableData[i].damage === 1) count += 10;
            if (returnTime > endTime){
              count+=Math.floor((returnTime - endTime)/86400000)
            }
          }
          this.number8 = count;
        })
      }
    },
  }
</script>

<style scoped>
  .container {
    background-color:white;
  }
</style>

