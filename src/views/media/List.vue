<template>
  <div>
    <!--    搜索表单-->
    <div style="margin-bottom: 20px">
      <el-input style = "width: 240px;" placeholder = "请输入用户名称" v-model="params.name"></el-input>
      <el-input style = "width: 240px; margin-left: 5px;" placeholder = "请输入账号id" v-model="params.author_id"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="load"><i class="el-icon-search"></i>搜索</el-button>
      <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i>重置</el-button>
    </div>
    <el-table :data="tableData" stripe row-key = "id" default-expand-all>
      <el-table-column prop="id" label="编号" width="80%"></el-table-column>
      <el-table-column prop="name" label="名称" ></el-table-column>
      <el-table-column prop="media_id" width="200%" label="媒体id"></el-table-column>
      <el-table-column prop="author_id" label="账号id"></el-table-column>
      <el-table-column prop="media_url" label="账号地址"></el-table-column>
      <el-table-column prop="description"width="200%" label="描述"></el-table-column>
      <el-table-column prop="verified_msg" label="官方信息"></el-table-column>
      <el-table-column prop="avatar_url" label="头像地址">
        <template v-slot="scope">
          <el-image :src="scope.row.avatar_url" :preview-src-list="[scope.row.avatar_url]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="like_num" label="喜欢"></el-table-column>
      <el-table-column prop="fans_num" label="粉丝数"></el-table-column>
      <el-table-column prop="follow_num" label="关注"></el-table-column>
      <el-table-column prop="publish_num" label="发布"></el-table-column>
      <el-table-column prop="category" label="分类"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="100"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" width="100"></el-table-column>
      <el-table-column label="操作" width="300">
        <template v-slot="scope" >
<!--          scope.row 就是当前行数据-->
          <div class="button-group">
            <el-button type="primary" style="margin-bottom: 10px;" @click="$router.push('/editMedia?id=' + scope.row.id)">
              编辑
            </el-button>
<!--            <el-button type="primary" @click="$router.push('/inform Media?id=' + scope.row.id)">-->
<!--              详情-->
<!--            </el-button>-->
            <el-popconfirm style="margin-left:5px"
                title="您确定删除这行数据吗？"
                @confirm="del(scope.row.id)"
            >
              <el-button type="danger" slot="reference">
                删除
              </el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <div style = "margin-top: 20px">
      <el-pagination
          background
          :current-page = "params.pageNum"
          :pagesize="params.pageSize"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import request from "@/utils/request";
import Cookies from "js-cookie";
export default {
  name: ' MediaList',
  data(){
    return{
      admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
      tableData: [],
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        author_id: ''
      },
      rules:{
        name: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
        ]
      }
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      request.get('/media/page', {
        params: this.params
      }).then(res => {
        if(res.code === '200'){
          this.tableData = res.data.list
          this.total = res.data.total
        }
      })
    },
    reset(){
      this.params = {
        pageNum: 1,
        pageSize: 10,
        name: '',
        author_id: ''
      }
      this.load()
    },
    handleCurrentChange(pageNum){
      //点击分页按钮触发分页
      this.params.pageNum = pageNum
      this.load()
    },
    del(id) {
      request.delete("/media/delete/" + id).then(res => {
        if(res.code === '200'){
          this.$notify.success('删除成功')
          this.load()
        }else{
          this.$notify.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>