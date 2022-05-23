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
  export default {
    name: 'librarydashboard',
    components: {
      Card
    },
    data () {
      return{
        menuName:"Library Dashboard",
        number1:3,color1:"#00BFFF",el1:"el-icon-s-custom",
        number2:2,color2:"#40E0D0",el2:"el-icon-reading",
        number3:1,color3:"#FFC0CB",el3:"el-icon-copy-document",
        number4:4,color4:"#D2691E",el4:"el-icon-collection",
        number5:6,color5:"#F0E68C",el5:"el-icon-thumb",
        number6:2,color6:"#E6E6FA",el6:"el-icon-coffee-cup",
        number7:3,color7:"#5F9EA0",el7:"el-icon-scissors",
        number8:1,color8:"#696969",el8:"el-icon-c-scale-to-original"
      }
    },
  }
</script>

<style scoped>
  .container {
    background-color:white;
  }
</style>

