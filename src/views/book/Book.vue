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
        <el-button type="primary" size="small" @click="addBook">Add book</el-button>
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
          <el-form-item label="Book Id：" prop="bookNo">
            <el-input v-model="bookForm.bookNo" :disabled="isModify"></el-input>
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
          <el-form-item label="Location：" prop="library">
            <edu-select :options="libraryOptions" :value="bookForm.library" @handleSelectValue="handleSelectLibrary">
            </edu-select>
          </el-form-item>
          <el-form-item label="Category：" prop="categoryName">
            <edu-select :options="categoryNameOptions" :value="bookForm.categoryName" @handleSelectValue="handleSelectCategoryName">
            </edu-select>
          </el-form-item>
          <el-form-item label="Publisher：" prop="publisher">
            <el-input v-model="bookForm.publisher"></el-input>
          </el-form-item>
          <el-form-item label="Description：" prop="remark">
            <el-input type="textarea" rows="8" maxlength="200" show-word-limit v-model="bookForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm">Confirm</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>

    import bookApi from '@/api/book/bookApi'

    import parameterApi from '@/api/parameter/parameterApi'
    import {mapState} from "vuex";

    const bookObj = {
      bookNo: '',
      bookName: '',
      author: '',
      library: '',
      categoryName: '',
      publisher: '',
      remark: '',
      status: ''
    }

    export default {
        name: "book",
        data(){
          return{
            menuName: 'Book List',
            dialogVisible: false,
            isModify: false,
            query: {
              bookName: '',
              pageNum: 1,
              pageSize: 10
            },
            bookForm: JSON.parse(JSON.stringify(bookObj)),
            bookFormRul:{
              bookNo:[
                {required: true,message: 'enter book id',trigger: 'blur'}
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
                {required: true,message: 'select location',trigger: 'change'}
              ],
              categoryName:[
                {required: true,message: 'select category',trigger: 'change'}
              ],
              publisher:[
                {required: true,message: 'enter publisher',trigger: 'blur'}
              ],
            },
            libraryOptions: [],
            categoryNameOptions: [],
            tableTitle: [
              {prop: 'bookNo',label: 'Book Id' },
              {prop: 'bookName',label: 'Book Name' },
              {prop: 'author',label: 'Author'},
              {prop: 'library',label: 'Location'},
              {prop: 'categoryName',label: 'Category'},
              {prop: 'publisher',label: 'Publisher'},
              {prop: 'status',label: 'Inventory',isHtml: false},
              {prop: 'createTime',label: 'Entry Time'},
              {prop: 'remarkHtml',label: 'Description',isHtml: true},

            ],
            tableData: [],
            total: 0,
          }
        },
      computed:{
        ...mapState(['user'])
      },
        mounted(){
          this.listBook()
          this.listParameter();
        },
        methods: {
          async listBook(){
            let params = this.query;
            const {data: res} = await bookApi.list('/api/book/list',params);
            if(res.code !== 200){
              this.$message.warning(res.message);
            }
            this.tableData = res.data.list.map(item=>{
              return{
                ...item,

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
                  this.listBook();
                }).catch(error=>{
                  this.$message.error(error);
                })
              } else {
                return false;
              }
            });
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
                id: row.id,
                deleteFlag: 1
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
          handleSelectCategoryName(value){
            this.bookForm.categoryName = value;
          },
          handleSelectLibrary(value){
            this.bookForm.library = value;
          },
          handleClose(){
            this.dialogVisible = false;
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

</style>
