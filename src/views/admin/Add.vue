<template>
  <div style="padding:0 20px; width: 80%">
    <h2 style="margin-bottom: 30px">新增管理员</h2>

        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
<!--          <el-form-item label="密码" prop="password">-->
<!--            <el-input v-model="form.password" placeholder="请输入密码"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入联系方式"></el-input>
          </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
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
  name: 'AddAdmin',
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
        return callback(new Error('请输入合法的手机号'));
      }
      callback()
    };
    return {
      form: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        phone: [
          {validator: checkPhone, trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    save(){
      this.$refs["ruleForm"].validate((valid) => {
        if(valid){
          request.post('/admin/save', this.form).then(res => {
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

