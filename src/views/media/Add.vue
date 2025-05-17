<template>
  <div style="padding:0 20px; width: 80%">
    <h2 style="margin-bottom: 30px">新增用户</h2>

    <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="媒体id" prop="remark">
        <el-input v-model="form.media_id" placeholder="请输入媒体id"></el-input>
      </el-form-item>
      <el-form-item label="账号id" prop="author_id">
        <el-input v-model="form.author_id" placeholder="请输入账号id"></el-input>
      </el-form-item>
      <el-form-item label="账号地址" prop="media_url">
        <el-input v-model="form.media_url" placeholder="请输入账号地址"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="官方信息" prop="verified_msg">
        <el-input v-model="form.verified_msg" placeholder="请输入官方信息"></el-input>
      </el-form-item>
      <el-form-item label="头像地址" prop="avatar_url">
        <el-input v-model="form.avatar_url" placeholder="请输入头像地址"></el-input>
      </el-form-item>
      <el-form-item label="喜欢数" prop="like_num">
        <el-input v-model="form.like_num" placeholder="喜欢数"></el-input>
      </el-form-item>
      <el-form-item label="粉丝数" prop="fans_num">
        <el-input v-model="form.fans_num" placeholder="请输入粉丝数"></el-input>
      </el-form-item>
      <el-form-item label="关注" prop="follow_num">
        <el-input v-model="form.follow_num" placeholder="请输入关注"></el-input>
      </el-form-item>
      <el-form-item label="发布" prop="publish_num">
        <el-input v-model="form.publish_num" placeholder="请输入发布"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="publish_num">
        <el-input v-model="form.category" placeholder="请输入分类"></el-input>
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
  name: 'AddMedia',
  data() {
    return {
      form: {},
      rules: {
        name: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    save(){
      this.$refs["ruleForm"].validate((valid) => {
        if(valid){
          request.post('/media/save', this.form).then(res => {
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

