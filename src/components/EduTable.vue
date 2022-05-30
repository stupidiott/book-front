<template>
  <div style="margin-top: 10px">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#409EFF',color:'#fff'}"
      :cell-style="cellStyle"
      border
      style="width: 99.8%">
      <!--表头-->
      <el-table-column v-for="(item,index) in titles" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
        <template slot-scope="scope">
          <div v-html="scope.row[item.prop]" v-if="item.isHtml"></div>
          <div v-text="scope.row[item.prop]" v-else></div>
        </template>
      </el-table-column>
      <el-table-column label="Activate" v-if="visibleSwitch">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.active" @change="changeStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Lost" v-if="visibleSwitch1">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.lost" @change="setLost(scope.row)" :disabled='user.accountType!==1'></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Damage" v-if="visibleSwitch2">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.damage" @change="setDamage(scope.row)" :disabled='user.accountType!==1'></el-switch>
        </template>
      </el-table-column>

      <!--操作列-->
      <el-table-column
        fixed="right"
        label="Operate"
         v-if="visibleOperation">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editRow(scope.row)" v-if="visibleEdit">Edit</el-button>
          <el-button type="text" size="small" @click="deleteRow(scope.row)" v-if="visibleDelete">Delete</el-button>
          <el-button type="text" size="small" @click="resetPassword(scope.row)" v-if="visibleResetPassword">Reset</el-button>
          <el-button type="text" size="small" @click="returnBook(scope.row)" v-if="visibleReturnBook">Return</el-button>
          <el-button type="text" size="small" @click="returnBook(scope.row)" v-if="visibleCancelReserve">Cancel</el-button>
          <el-button type="text" size="small" @click="showBarcode(scope.row)" v-if="visibleBarcode">Barcode</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        name: "EduTable",
        props:{
            tableData:{
              type: Array,
              default: []
            },
            titles:{
                type: Array,
                default: []
            },
            visibleOperation:{
                type: Boolean,
                default: true
            },
            visibleEdit:{
                type: Boolean,
                default: false
            },
            visibleDelete:{
                type: Boolean,
                default: false
            },
            visibleSettingAuth:{
                type: Boolean,
                default: false
            },
            visibleResetPassword:{
              type: Boolean,
              default: false
            },
            visibleSwitch:{
                type: Boolean,
                default: false
            },
          visibleSwitch1:{
            type: Boolean,
            default: false
          },
          visibleSwitch2:{
            type: Boolean,
            default: false
          },
          visibleReturnBook:{
            type: Boolean,
            default: false
          },
            visibleCancelReserve:{
                type: Boolean,
                default: false
            },
          visibleBarcode:{
            type: Boolean,
            default: false
          },
        },
        computed:{
          ...mapState(['user'])
        },
        methods:{
            editRow(row){
                this.$emit('editRow',row);
            },
            deleteRow(row){
                this.$emit('deleteRow',row);
            },
            settingAuth(row){
                this.$emit('settingAuth',row);
            },
            resetPassword(row){
                this.$emit('resetPassword',row);
            },
            returnBook(row){
                this.$emit('returnBook',row);
            },
            changeStatus(row){
                this.$emit('changeStatus',row);
            },
            setLost(row){
            this.$emit('setLost',row);
          },
            setDamage(row){
            this.$emit('setDamage',row);
          },
            cellStyle({row, column, rowIndex, columnIndex}) {
              if(row.deleteFlag === 1 && column.property === 'deleteFlagStr'){
                return 'color:red'
              }
            },
            showBarcode(row){
            this.$emit('showBarcode',row);
            },
        }
    }
</script>

<style scoped>

</style>
