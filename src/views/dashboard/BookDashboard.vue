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
  export default {
    name: 'bookdashboard',
    components: {
      Card
    },
    data () {
      return{
        menuName:"Book Dashboard",
        number1:3,color1:"#AFEEEE",el1:"el-icon-reading",
        number2:2,color2:"#BA55D3",el2:"el-icon-copy-document",
        number3:100,color3:"#32CD32",el3:"el-icon-edit-outline",
        number4:"normal",color4:"#F08080",el4:"el-icon-s-opportunity"
      }
    }
  }
</script>

<style scoped>
  .container {
    background-color:white;
  }
</style>


