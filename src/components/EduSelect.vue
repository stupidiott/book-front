<template>
  <div>
    <el-select v-model="selectValue" :value="value" :disabled="disabled" clearable :multiple="multiple" :filterable="filterable"  :placeholder="placeholder" @change="handleSelectValue">
      <el-option
        v-for="(item,index) in options"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
    export default {
        name: "EduSelect",
        props:{
            options:{
              type: Array,
              default: []
            },
            value:{
              type: [String,Number,Array]
            },
            disabled:{
              type: Boolean,
              default: false
            },
            multiple:{
              type: Boolean,
              default: false
            },
            filterable:{
              type: Boolean,
              default: false
            },
            placeholder:{
              type: String,
              default: "--Select--"
            }
        },
        watch:{
          value:{
            handler(newValue,oldValue){
              this.selectValue = newValue;
            },
            // immediate:true代表,如果在 wacth 里声明了 value 之后，就会立即先去执行里面的handler方法，如果为 false就跟我们以前的效果一样，不会在绑定的时候就执行
            immediate:true
          }
        },
        data(){
          return{
            selectValue: ''
          }
        },
        methods:{
          handleSelectValue(){
            this.$emit('handleSelectValue',this.selectValue);
          }
        }
    }
</script>

<style scoped>

</style>
