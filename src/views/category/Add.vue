<template>
  <div style="padding:0 20px; width: 80%">
    <h2 style="margin-bottom: 30px">新增分类</h2>

    <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>

    <div style="text-align: center; margin-top: 30px">
      <el-button type="primary" @click="save" size="medium">提交</el-button>
<!--      <el-button type="danger">返回列表</el-button>-->
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: 'AddCategory',
  data() {
    return {
      form: {},
      rules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    save(){
      this.$refs["ruleForm"].validate((valid) => {
        if(valid){
          request.post('/category/save', this.form).then(res => {
            if(res.code === '200'){
              this.$notify.success('新增成功')
              this.$refs['ruleForm'].resetFields()
            }else{
              this.$notify.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

