<template>
    <div class="book">
      <!--面包屑-->
      <edu-breadcrumb :menu-name="menuName">
      </edu-breadcrumb>

      <!--搜索条件-->
      <edu-search>
        <el-row :gutter="4">
          <el-col :span="4">
            <el-input v-model="query.bookName" placeholder="enter book name" clearable @keyup.enter.native="searchBook" @click="searchBook" @clear="searchBook"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button icon="el-icon-search" type="primary" @click="searchBook"></el-button>
          </el-col>
        </el-row>
      </edu-search>

      <!--新增按钮-->
      <div style="margin-top: 10px">
        <el-button type="primary" size="small" v-if="user.accountType==1" @click="addBook">Add book</el-button>
        <el-button type="primary" size="small" v-if="user.accountType==1" @click="addLocation">Add location</el-button>
        <el-button type="primary" size="small" v-if="user.accountType==1" @click="addCategory">Add category</el-button>

      </div>

      <!--显示内容-->
      <edu-table :titles="tableTitle"
                 :table-data="tableData"
                 :visible-operation="user.accountType!==4"
                 :visible-delete="user.accountType!==4"
                 :visible-edit="user.accountType!==4"
                 @editRow="editBook"
                 @deleteRow="deleteBook">
      </edu-table>
      <edu-page :current-page="query.pageNum"
                :page-size="query.pageSize"
                :total="total"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange">
      </edu-page>

      <el-dialog
        :title="isModify ? 'Edit Book' : 'Add Book'"
        :visible.sync="dialogVisible"
        width="800px"
        :before-close="handleClose">
        <el-form ref="bookFormRef" :rules="bookFormRul" :model="bookForm" label-width="120px">
          <el-form-item label="ISBN：" prop="bookNo">
            <el-col :span="20">
              <el-input v-model="bookForm.bookNo" :disabled="isModify"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click="getBook">search</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="Inventory：" prop="status">
            <el-input v-model="bookForm.status" ></el-input>
          </el-form-item>
          <el-form-item label="Title：" prop="bookName">
            <el-input v-model="bookForm.bookName"></el-input>
          </el-form-item>
          <el-form-item label="Author：" prop="author">
            <el-input v-model="bookForm.author"></el-input>
          </el-form-item>
          <el-form-item label="Location：" required>
            <el-col :span="8">
              <el-form-item prop="floor">
                <edu-select :options="floorOptions" :value="bookForm.floor" @handleSelectValue="handleSelectFloor"
                            style="width: 100%;"></edu-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="library">
                <edu-select :options="libraryOptions" :value="bookForm.library" @handleSelectValue="handleSelectLibrary"
                            style="width: 100%;"></edu-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="address">
                <el-input v-model="bookForm.address"
                          style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="Category：" prop="categoryName">
            <edu-select :options="categoryNameOptions" :value="bookForm.categoryName" @handleSelectValue="handleSelectCategoryName">
            </edu-select>
          </el-form-item>
          <el-form-item label="Publisher：" prop="publisher">
            <el-input v-model="bookForm.publisher"></el-input>
          </el-form-item>
          <el-form-item label="Description：" prop="remark">
            <el-input type="textarea" rows="8" maxlength="500" show-word-limit v-model="bookForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm">Confirm</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogVisible2"
        width="73%"
        top="5%"
      :before-close="handleClose2"
      >
        <div class="trayContent" >
          <div class="trayItem"  v-for="(item,index) in trayList" :key="index">
            <canvas :id="'trayItem'+index"  style="width:200px;height:80px;" :key="index"></canvas>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :title="isModify1='Add Location'"
        :visible.sync="dialogVisible3"
        width="800px"
        :before-close="handleClose">
        <el-form >
          <el-form-item label="Library Type：" prop="library">
            <el-select v-model="para.parameter_type" placeholder="--------------Select---------------" >
              <el-option
                v-for="item in options1"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="specific location：" prop="parameter_key">
            <el-input v-model="para.parameter_key"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">Cancel</el-button>
          <el-button type="primary" @click="submitLocationForm">Confirm</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="ismodify2='Add Category'"
        :visible.sync="dialogVisible4"
        width="800px"
        :before-close="handleClose">
        <el-form>
          <el-form-item label="category：" prop="temp">
            <el-input v-model="para.temp"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4 = false">Cancel</el-button>
          <el-button type="primary" @click="submitCategoryForm">Confirm</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>

    import bookApi from '@/api/book/bookApi'
    import axios from 'axios'
    import parameterApi from '@/api/parameter/parameterApi'
    import {mapState} from "vuex";
    import JsBarcode from "jsbarcode";
    const bookObj = {
      bookNo: '',
      bookName: '',
      author: '',
      library: '',
      categoryName: '',
      publisher: '',
      remark: '',
      status: '',
      floor: '',
      address: ''
    }

    export default {
        name: "book",
        data(){
          return{
            para:{
              parameter_type:'',
              parameter_key:'',
              parameter_value:'',
              temp:'',
              delete_flag:'0',
            },
            menuName: 'Book List',
            dialogVisible: false,
            dialogVisible2: false,
            dialogVisible3:false,
            dialogVisible4:false,
            visiblebutton:true,
            isModify: false,
            isModify1:false,
            ismodify2:false,
            query: {
              bookName: '',
              pageNum: 1,
              pageSize: 10
            },
            bookForm: JSON.parse(JSON.stringify(bookObj)),
            bookFormRul:{
              bookNo:[
                {required: true,message: 'enter ISBN',trigger: 'blur'}
              ],
              status:[
                {required: true,message: 'enter inventory',trigger: 'blur'}
              ],
              bookName:[
                {required: true,message: 'enter book name',trigger: 'blur'}
              ],
              author:[
                {required: true,message: 'enter author',trigger: 'blur'}
              ],
              library:[
                {required: true,message: 'select area',trigger: 'change'}
              ],
              floor:[
                {required: true,message: 'select floor',trigger: 'change'}
              ],
              address:[
                {required: true,message: 'enter address',trigger: 'blur'}
              ],
              categoryName:[
                {required: true,message: 'select category',trigger: 'change'}
              ],
              publisher:[
                {required: true,message: 'enter publisher',trigger: 'blur'}
              ],
            },
            libraryOptions: [],
            floorOptions: [],
            categoryNameOptions: [],
            tableTitle: [
              {prop: 'bookNo',label: 'ISBN' ,width: 150},
              {prop: 'bookName',label: 'Book Name' ,width: 150},
              {prop: 'author',label: 'Author',width: 150},
              {prop: 'Location',label: 'Location',width: 150},
              {prop: 'categoryName',label: 'Category',width: 100},
              {prop: 'publisher',label: 'Publisher',width: 200},
              {prop: 'status',label: 'Inventory',isHtml: false,width: 100},
              {prop: 'createTime',label: 'Entry Time',width: 200},
              {prop: 'remarkHtml',label: 'Description',isHtml: true},

            ],
            tableData: [],
            total: 0,
            options :{
              format:"CODE128",
              displayValue:true,
              fontSize:18,
              height:100
            },
            trayList:[],

            options1:[
              {value:'library_name',label:'library'},
              {value:'floor_num',label:'floor'}
            ]
          }
        },
        computed:{
        ...mapState(['user']),
          },
        mounted(){
          this.listBook()
          this.listParameter();
        },
        methods: {
          addLocation(){
            this.dialogVisible3 = true;
            this.isModify1 = false
          },
          addCategory(){
            this.dialogVisible4 = true;
            this.ismodify2 = false
          },
          genCode(){
            this.$nextTick(()=>{
              this.trayList.forEach((item,index)=>{
                JsBarcode('#trayItem'+index, item, this.options);
              })
            })
          },
          getBook(){
            this.bookForm.publisher = ''
            this.bookForm.bookName = ''
            this.bookForm.remark = ''
            this.bookForm.author = ''
            let isbn = this.bookForm.bookNo;
            let Url = 'https://openlibrary.org/isbn/' + isbn + '.json';
            axios.get(Url).then(response => {
              let authorUrl = 'https://openlibrary.org/' + response.data.authors[0].key + '.json'
              axios.get(authorUrl).then(response2 =>{
                this.bookForm.author = response2.data.name
                console.log(response2.data)
              })
              this.bookForm.publisher = response.data.publishers[0]
              this.bookForm.bookName = response.data.title
              this.bookForm.remark = response.data.description
              console.log(response.data)
            }).catch(isbn)
            {
              if( isbn === '')
                console.log('error')
            }
          },
          async listBook(){
            let params = this.query;
            const {data: res} = await bookApi.list('/api/book/list',params);
            if(res.code !== 200){
              this.$message.warning(res.message);
            }
            this.tableData = res.data.list.map(item=>{
              return{
                ...item,
                Location : item.floor + ' ' +item.library + '-' + item.address,
                remarkHtml: `<span class="oneLine" title="${item.remark}">${item.remark}</span>`
              }
            })
            this.total = Number.parseInt(res.data.total);
          },
          listParameter(){
            parameterApi.getParameterList('/api/parameter/list?parameterType=library_name').then(res=>{
              this.libraryOptions = res.data.data.list.map(item=>{
                return{
                  label: item.parameterKey,
                  value: item.parameterValue
                }
              });
            })
            parameterApi.getParameterList('/api/parameter/list?parameterType=book_type').then(res=>{
              this.categoryNameOptions = res.data.data.list.map(item=>{
                return{
                  label: item.parameterKey,
                  value: item.parameterValue
                }
              });
            })
            parameterApi.getParameterList('/api/parameter/list?parameterType=floor_num').then(res=>{
              this.floorOptions = res.data.data.list.map(item=>{
                return{
                  label: item.parameterKey,
                  value: item.parameterValue
                }
              });
            })
          },
          searchBook(){
            this.listBook();
          },
          submitForm(){
            let vm = this;
            this.$refs.bookFormRef.validate((valid) => {
              if (valid) {

                let requestObj = this.isModify ? {
                  url: '/api/book/update',
                  message: 'success'
                } : {
                  url: '/api/book/add',
                  message: 'success'
                }

                bookApi.add(requestObj.url,vm.bookForm).then(res=>{
                  if(res.data.code !== 200){
                    this.$message.warning(res.data.message);
                    return;
                  }
                  this.dialogVisible = false;
                  this.$message.success(requestObj.message);
                  this.dialogVisible2 = true;
                  let flag = this.bookForm.status
                  this.trayList=[]
                  for(let i = 1;i <= flag;i++ ){
                    this.trayList.push(this.bookForm.bookNo+i)
                  }
                  this.genCode()
                  this.listBook();

                }).catch(error=>{
                  this.$message.error(error);
                })
              } else {
                return false;
              }
            });
          },
          submitLocationForm(){
            this.para.parameter_value = this.para.parameter_key;
            this.$http.post('/api/parameter/add',this.para).then(res=>{
              if(res.data.code !== 200){
                this.$message.warning(res.data.message);
                return;
              }
              this.dialogVisible3 = false;
              this.$message.success("success");
              this.listParameter()
              // this.dialogVisible2=true;
            })
          },
          submitCategoryForm(){
            this.para.parameter_key = this.para.temp;
            this.para.parameter_value = this.para.temp;
            this.para.parameter_type = "book_type";
            this.$http.post('/api/parameter/add',this.para).then(res=>{
              if(res.data.code !== 200){
                this.$message.warning(res.data.message);
                return;
              }
              this.dialogVisible4 = false;
              this.$message.success("success");
              this.listParameter()
              // this.reload()
              // this.dialogVisible2=true;
            })
          },
          addBook(){
            this.dialogVisible = true;
            this.isModify = false;
            this.bookForm = JSON.parse(JSON.stringify(bookObj))
          },
          editBook(row){
            this.dialogVisible = true;
            this.isModify = true;
            Object.keys(bookObj).forEach(key=>{
              this.bookForm[key] = row[key];
            })
            this.bookForm.id = row.id;

          },
          deleteBook(row){
            this.$confirm('Submission Confirm？','Delete Book',{
              confirmButtonText: 'Confirm',
              cancelButtonText: 'Cancel'
            }).then(()=>{
              let params = {
                bookNo: row.bookNo,
                deleteFlag: 1,
                id:row.id
              }
              bookApi.update("/api/book/update",params).then(res=>{
                if(res.data.code !== 200){
                  this.$message.warning(res.data.message);
                  return;
                }
                this.$message.success("Success");
                this.listBook();
              }).catch(error=>{

              })
            }).catch(()=>{

            })
          },
          handleSelectLibrarynew(value){
            this.para.parameter_type = value;
          },
          handleSelectCategoryName(value){
            this.bookForm.categoryName = value;
          },
          handleSelectLibrary(value){
            this.bookForm.library = value;
          },
          handleSelectFloor(value){
            this.bookForm.floor = value;
          },
          handleClose(){
            this.dialogVisible = false;
          },
          handleClose2(){
            this.dialogVisible2 = false;
          },
          handleSizeChange(newSize){
            this.query.pageSize = newSize;
            this.listBook();
          },
          handleCurrentChange(newValue){
            this.query.pageNum = newValue;
            this.listBook();
          }
        }
    }
</script>

<style lang="less">
  .book{
    .oneLine{
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
     }
    .el-select{
      width: 100%;
    }
  }
  .btn{
    text-align: center;
    margin-top: 15px;
  }
  .trayContent{
    display:flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .trayItem{
    margin-top:35px;
    margin-right:10px;
    width:200px;
    height:80px;
    background:white;
    display:flex;
    flex-wrap:wrap;
    align-items: center;
    justify-content: center;
    border:1px solid #e8e8e8;
  }
</style>
