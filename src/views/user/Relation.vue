<template>
  <div style="width:100%;">
    <!--    搜索表单-->
    <div style="margin-bottom: 20px">
      <el-input style = "width: 240px;" placeholder = "请输入名称" v-model="params.name"></el-input>
      <el-input style = "width: 240px; margin-left: 5px;" placeholder = "请输入关系名称" v-model="params.phone"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="relation"><i class="el-icon-search"></i>搜索</el-button>
      <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i>重置</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" >

      <el-table-column prop="startname" label="开始人员" width="200"></el-table-column>
      <el-table-column prop="startcategory" label="开始人员分类" width="200"></el-table-column>
      <el-table-column prop="relation" label="关系" width="200"></el-table-column>
      <el-table-column prop="endname" label="结束人员" width="200"></el-table-column>
      <el-table-column prop="endcategory" label="结束人员分类" width="200"></el-table-column>

      <!-- <el-table-column prop="id" label="编号" width="80%"></el-table-column>
      <el-table-column prop="name" label="用户名" width="90%"></el-table-column>
      <el-table-column prop="username" label="用户卡号" width="150"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="address" label="住址" width="200"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="100"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" width="100"></el-table-column> -->
      <!-- <el-table-column label="操作">
        <template v-slot="scope">
          <div class="button-group">
            <el-button type="primary"style="margin-bottom: 10px;" @click="$router.push('/editUser?id=' + scope.row.id)">
              编辑
            </el-button>
            <el-button type="primary" @click="$router.push('/informUser?id=' + scope.row.id)">
              详情
            </el-button>
            <el-popconfirm
                title="您确定删除这行数据吗？"
                @confirm="del(scope.row.id)"
            >
              <el-button style="margin-left: 5px" type="danger" slot="reference">
                删除
              </el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column> -->
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

import neo4j, { session } from "neo4j-driver";

export default {
  name: 'User',
  data(){
    return{
      tableData: [],
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        phone: ''
      }
    }
  },
  created() {
    //this.load()
    this.relation()
  },
  methods:{


    async relation(){

      console.log(this.params)

      this.driver = neo4j.driver(
          'bolt://175.178.217.62:7687',
          neo4j.auth.basic('neo4j', '12345678')
      );

      let query=` match (m)-[r]->(n) `
 
      
if(this.params.name.length>0){
  query=query+` where (toLower(m.name) contains toLower("${this.params.name}") or toLower(n.name) contains toLower("${this.params.name}") ) `
}
else{
  query=query+` where 1=1 `
}
if(this.params.phone.length>0){
  query=query+` and toLower(type(r)) contains toLower('${this.params.phone}')  `

}
else{
  query=query+` and 1=1 `
}
      
query=query+`
 with count(1) as cnt match (m)-[r]->(n)`

if(this.params.name.length>0){
  query=query+` where (toLower(m.name) contains toLower("${this.params.name}") or toLower(n.name) contains toLower("${this.params.name}") ) `
}
else{
  query=query+` where 1=1 `
}
if(this.params.phone.length>0){
  query=query+` and toLower(type(r)) contains toLower('${this.params.phone}')  `

}
else{
  query=query+` and 1=1`
}
query=query+
`
 return m.name as startname,m.category as startcategory,
type(r) as relation,
n.name as endname,n.category as endcategory,cnt  skip ${10*(this.params.pageNum-1)} limit ${this.params.pageSize}`

console.log(query)

      const session = this.driver.session();
      const result = await session.run(query);
      console.log('查询结果记录数:', result.records.length);
      let cnt=0
      if(result.records.length>0){
        cnt=parseInt(result.records[0].get("cnt"))
      }
      else{
        this.tableData = []
          this.total = 0;

      }

      let data=[]
      result.records.forEach(record => {

        
          // const personName = record.get('personName');
          // const friendName = record.get('friendName');
          // const relationType = record.get('relationType');
          // const startcategory=record.get("startcategory")
          // const endcategory=record.get("endcategory")

          data.push({
            "startname":record.get("startname"),
            "startcategory":record.get("startcategory"),
            "relation":record.get("relation"),
            "endname":record.get("endname"),
            "endcategory":record.get("endcategory"),

          })


          console.log(data.length)
          this.tableData = data
          this.total = cnt;//data.length

      })



    },



    load(){
      // fetch('http://localhost:9092/user/list').then(res => res.json()).then(res => {
      //   console.log(res)
      //   this.tableData = res
      // })


      







      request.get('/user/page', {
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
        phone: ''
      }
      //this.load()
      this.relation()
    },
    handleCurrentChange(pageNum){
      //点击分页按钮触发分页
      this.params.pageNum = pageNum
      //this.load()
      this.relation()
    },
    del(id) {
      request.delete("/user/delete/" + id).then(res => {
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