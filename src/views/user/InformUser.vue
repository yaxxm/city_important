<template>
  <div class="user-info-container">
    <!-- 上半部分 -->
    <div class="user-info-top">
      <div class="avatar">
        <img :src="'https://via.placeholder.com/150'" alt="用户头像" />
      </div>
      <div class="user-details">
        <p><strong>用户名：</strong>{{ form.name }}</p>
        <p><strong>性别：</strong>{{ form.sex }}</p>
        <p><strong>邮箱：</strong>{{ form.email }}</p>
        <p><strong>手机号：</strong>{{ form.phone }}</p>
        <p><strong>地址：</strong>{{ form.address }}</p>
        <p><strong>IP出现城市：</strong>{{ form.ip_city }}</p>
        <p><strong>工作单位：</strong>{{ form.work }}</p>
        <p><strong>QQ：</strong>{{ form.QQ }}</p>
        <p><strong>微信：</strong>{{ form.WeChat }}</p>
        <p><strong>账号简介：</strong>{{ form.Introduction }}</p>
        <p><strong>出生日期：</strong>{{ form.birthday }}</p>
        <p><strong>联系人：</strong>{{ form.relatives }}</p>
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
    </div>

    <!-- 模式切换按钮 -->
    <el-button-group style="margin-bottom: 20px;">
      <el-button @click="handleViewModeChange('table')" :type="viewMode === 'table' ? 'primary' : ''">用户列表</el-button>
      <el-button @click="handleViewModeChange('graph')" :type="viewMode === 'graph' ? 'primary' : ''">知识图谱</el-button>
    </el-button-group>

    <!-- 用户列表模式 -->
    <div v-if="viewMode === 'table'">
      <h3>平台</h3>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="编号" width="80"></el-table-column>
        <el-table-column prop="name" label="用户名" width="90"></el-table-column>
        <el-table-column prop="username" label="用户卡号" width="150"></el-table-column>
        <el-table-column prop="sex" label="性别" width="50"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column prop="address" label="住址" width="200"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="100"></el-table-column>
        <el-table-column prop="updatetime" label="更新时间" width="100"></el-table-column>
        <el-table-column label="操作" style="width: 100%">
          <template v-slot="scope">
            <div class="button-group">
              <el-button
                  type="primary"
                  @click="navigateToDetail(scope.row.id)"
                  style="width: 50px"
              >
                详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- BiliBili平台标题 -->
      <h3>BiliBili平台</h3>
      <el-table :data="tableDataBi" stripe style="width: 100%">
        <el-table-column prop="id" label="编号" width="80"></el-table-column>
        <el-table-column prop="name" label="用户名" width="150"></el-table-column>
        <el-table-column prop="meidia_id" label="用户id" width="150"></el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column> <!-- 添加了tooltip -->
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
            <div class="button-group">
              <el-button
                  type="primary"
                  @click="navigateToDetailBi(scope.row.id)"
                  style="width: 50px"
              >
                详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 抖音平台标题 -->
      <h3>抖音平台</h3>
      <el-table :data="tableDataDou" stripe style="width: 100%">
        <el-table-column prop="name" label="用户名" width="150"></el-table-column>
        <el-table-column prop="author_id" label="作者id" width="150"></el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="verified_msg" label="证明信息" width="200"></el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
            <div class="button-group">
              <el-button
                  type="primary"
                  @click="navigateToDetailDou(scope.row.id)"
                  style="width: 50px"
              >
                详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- TikTok平台标题 -->
      <h3>TikTok平台</h3>
      <el-table :data="tableDataTik" stripe style="width: 100%">
        <el-table-column prop="nickName" label="用户名" width="150"></el-table-column>
        <el-table-column prop="uid" label="用户uid" width="150"></el-table-column>
        <el-table-column prop="uniqueId" label="唯一Id" width="150"></el-table-column>
        <el-table-column prop="signature" label="签名" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
            <div class="button-group">
              <el-button
                  type="primary"
                  @click="navigateToDetailTik(scope.row.id)"
                  style="width: 50px"
              >
                详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 知识图谱模式 -->
    <div v-if="viewMode === 'graph'">
      <div id="graph-container" style="height: 600px;"></div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import neo4j from "neo4j-driver";
import cytoscape from 'cytoscape'; // 引入 Cytoscape 用于图形渲染

export default {
  name: "InformUser",
  data() {
    return {
      nodenames:[],
      form: {
        name: "",
        sex: "",
        email: "",
        phone: "",
        address: "",
        ip_city: "",
        work: "",
        QQ: "",
        WeChat: "",
        Introduction: "",
        birthday: "",
        relatives: "",
      },
      tableData: [], // 表格数据
      tableDataBi:[],
      tableDataDou:[],
      tableDataTik:[],
      total: 0, // 总条目数
      totalbi:0,
      totaldou:0,
      totaltik:0,
      params: {
        pageNum: 1,
        pageSize: 1000,
        name: "",
        phone: "",
        names:[]
      },
      viewMode: "table", // 当前视图模式：'table' 或 'graph'
      driver: null, // Neo4j 连接
      session: null, // Neo4j 会话
      graphData: [], // 用于存储知识图谱的数据
    };
  },
  created() {
    //this.load(); // 加载表格数据
    console.log("abc");
    this.fetchUserInfo(); // 加载用户详情
    console.log("abc1");
    // this.$nextTick(()=>{
    //       //this.fetchGraphDataById();
    //       this.changeViewMode("table")
    //     });
  },
  watch: {
    // 监听路由参数中的 id 变化
    '$route.query.id'(newId, oldId) {
      if (newId !== oldId) {
        this.fetchUserInfo(); // 路由参数 id 变化时重新加载用户信息
        
        this.$nextTick(()=>{
          //this.fetchGraphDataById();
          this.changeViewMode("table")
        });

      }
    }
  },
  mounted() {
  },
  methods: {
    // 路由跳转到用户详情
    navigateToDetail(id) {

      this.params.names=[]
      const currentPath = this.$route.fullPath;
      const targetPath = `/informUser?id=${id}`;
      if (currentPath === targetPath) {
        console.log("已在目标路由，无需重复跳转:", targetPath);
        return;
      }
      this.$router.push(targetPath).catch((err) => {
        if (err.name !== "NavigationDuplicated") {
          console.error(err);
        }
      });
    },
    navigateToDetailBi(id) {

      this.params.names=[]
      const currentPath = this.$route.fullPath;
      const targetPath = `/informBiUser?id=${id}`;
      if (currentPath === targetPath) {
        console.log("已在目标路由，无需重复跳转:", targetPath);
        return;
      }
      this.$router.push(targetPath).catch((err) => {
        if (err.name !== "NavigationDuplicated") {
          console.error(err);
        }
      });
    },
    navigateToDetailDou(id) {

      this.params.names=[]
      const currentPath = this.$route.fullPath;
      const targetPath = `/informDouUser?id=${id}`;
      if (currentPath === targetPath) {
        console.log("已在目标路由，无需重复跳转:", targetPath);
        return;
      }
      this.$router.push(targetPath).catch((err) => {
        if (err.name !== "NavigationDuplicated") {
          console.error(err);
        }
      });
    },
    navigateToDetailTik(id) {

      this.params.names=[]
      const currentPath = this.$route.fullPath;
      const targetPath = `/informTikUser?id=${id}`;
      if (currentPath === targetPath) {
        console.log("已在目标路由，无需重复跳转:", targetPath);
        return;
      }
      this.$router.push(targetPath).catch((err) => {
        if (err.name !== "NavigationDuplicated") {
          console.error(err);
        }
      });
    },
    goBack() {
      this.$router.go(-1); // 或者你希望实现的返回逻辑
    },
    // 获取用户信息
    fetchUserInfo() {
      const id = this.$route.query.id;
      if (!id) return;
      request
          .get(`/user/${id}`)
          .then((res) => {
            this.form = res.data;

            console.log("abc2")
          this.fetchGraphDataById()
          console.log("abc3")
          })
          .catch((error) => {
            console.error("用户详情加载失败：", error);
          });
          
    },
    // 加载表格数据
    load() {
      request
          .get("/user/page", { params: this.params })
          .then((res) => {
            if (res.code === "200") {
              this.tableData = res.data.list;
              this.total = res.data.total;
            }
          })
          .catch((error) => {
            console.error("表格数据加载失败：", error);
          });
    },
    loadbi() {
      request
          .get("/userbi/page", { params: this.params })
          .then((res) => {
            if (res.code === "200") {
              this.tableDataBi = res.data.list;
              this.totalbi = res.data.total1;
            }
          })
          .catch((error) => {
            console.error("表格数据加载失败：", error);
          });
    },
    loaddou() {
      request
          .get("/userdou/page", { params: this.params })
          .then((res) => {
            if (res.code === "200") {
              this.tableDataDou = res.data.list;
              this.totaldou = res.data.totaldou;
            }
          })
          .catch((error) => {
            console.error("表格数据加载失败：", error);
          });
    },
    loadtik() {
      request
          .get("/usertik/page", { params: this.params })
          .then((res) => {
            if (res.code === "200") {
              this.tableDataTik = res.data.list;
              this.totaltik = res.data.totaltik;
            }
          })
          .catch((error) => {
            console.error("表格数据加载失败：", error);
          });
    },

    async loadbynames() {
      console.log(this.params.names)
      this.tableData =[];
      this.tableDataBi = [];
      this.tableDataDou = [];
      this.tableDataTik = [];
      let rsp=await request.post("/user/pagebynames",this.params.names)
      let rspbi=await request.post("/userbi/pagebynames",this.params.names)
      let rspdou=await request.post("/userdou/pagebynames",this.params.names)
      let rsptik=await request.post("/usertik/pagebynames",this.params.names)
      console.log(rsp)
      console.log(rspbi)
      console.log(rspdou)
      console.log(rsptik)
      if(rsp.code=="200"){
        console.log(rsp.data)
        
        let rspdata=rsp.data;
        for (var item of rspdata) {
          this.tableData.push(item);
          console.log(item);
        }
              this.total = rsp.data.length;
      }
      if(rspbi.code=="200"){
        console.log(rspbi.data)

        let rspdatabi=rspbi.data;
        for (var item of rspdatabi) {
          this.tableDataBi.push(item);
          console.log(item);
        }
        this.total1 = rspbi.data.length;
      }
      if(rspdou.code=="200"){
        console.log(rspdou.data)

        let rspdatadou=rspdou.data;
        for (var item of rspdatadou) {
          this.tableDataDou.push(item);
          console.log(item);
        }
        this.totaldou = rspdou.data.length;
      }
      if(rsptik.code=="200"){
        console.log(rsptik.data)

        let rspdatatik=rsptik.data;
        for (var item of rspdatatik) {
          this.tableDataTik.push(item);
          console.log(item);
        }
        this.totaltik = rsptik.data.length;
      }
    },

    


    // 分页切换
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.load();
      this.loadbi();
      this.loaddou();
      this.loadtik();
    },
    changeViewMode(mode) {
      console.log('切换视图模式:', mode);
      this.viewMode = mode;

      // 如果切换到图谱模式，在渲染图谱后处理
      if (mode === 'graph') {
        this.$nextTick(() => {
          const container = document.getElementById('graph-container');
          console.log('切换到图谱模式后，图谱容器:', container);
          if (container) {
            this.fetchGraphData();
            this.renderGraph();  // 渲染图谱
          } else {
            console.error('图谱容器未找到');
          }
        });
      }
      else{
        this.$nextTick(() => {
          this.fetchGraphDataById();
          //this.loadbynames();
          // const container = document.getElementById('graph-container');
          // console.log('切换到图谱模式后，图谱容器:', container);
          // if (container) {
          //   this.fetchGraphData();
          //   this.renderGraph();  // 渲染图谱
          // } else {
          //   console.error('图谱容器未找到');
          // }
        });
      }
    },
    // 点击按钮切换视图模式
    handleViewModeChange(mode) {
      this.changeViewMode(mode);
    },
    async fetchGraphData() {
      console.log('当前视图模式:', this.viewMode);  // 检查 viewMode 的值
      console.log("abc")
      try {
        // 更详细的错误日志
        console.log('开始获取图谱数据');

        let wherecql=""
        if(this.form.name!=null && this.form.name!=undefined &&  this.form.name!=""){
          wherecql=" where p.name='"+this.form.name+"'  or f.name='"+this.form.name+"'"
        }
        else{
          return;

        }

        this.driver = neo4j.driver(
            'bolt://175.178.217.62:7687',
            neo4j.auth.basic('neo4j', '12345678')
        );
        console.log(this.form)

        
        console.log(`MATCH (p:Person)-[:FRIEND_WITH]->(f:Person) `+wherecql+` RETURN p.name AS personName, f.name AS friendName `)

        const session = this.driver.session();
        const query = `
          MATCH (p:Person)-[r]->(f:Person) ${wherecql}
          RETURN p.name AS personName, f.name AS friendName, type(r) AS relationType,
          p.category as startcategory,f.category as endcategory
        `;
        const result = await session.run(query);
        // const result = await session.run(
        //     `MATCH (p:Person)-[r]->(f:Person) `+wherecql+` RETURN p.name AS personName, f.name AS friendName `
        //       // 限制返回数据量
        // );

        console.log('查询结果记录数:', result.records.length);

        if (result.records.length === 0) {
          console.log('没有找到图谱数据');
          this.$message.warning('未找到图谱数据');
          return;
        }
        // 提取并格式化图谱数据
        // this.graphData = result.records.map(record => ({
        //   nodes: [
        //     { data: { id: record.get('personName'), label: record.get('personName'), type: 'person' } },
        //     { data: { id: record.get('friendName'), label: record.get('friendName'), type: 'person' } },
        //   ],
        //   edges: [
        //     { data: { source: record.get('personName'), target: record.get('friendName') } },
        //   ],
        // }));
        this.graphData = {
          nodes: [],
          edges: []
        };

        const nodeSet = new Set(); // 用于避免重复节点
        result.records.forEach(record => {
          const personName = record.get('personName');
          const friendName = record.get('friendName');
          const relationType = record.get('relationType');
          const startcategory = record.get('startcategory');
          const endcategory = record.get('endcategory');

          // 添加节点
          if (!nodeSet.has(personName)) {
            this.graphData.nodes.push({ data: { id: personName, label: personName, type: 'person',category:startcategory } });
            nodeSet.add(personName);
          }
          if (!nodeSet.has(friendName)) {
            this.graphData.nodes.push({ data: { id: friendName, label: friendName, type: 'person',category:endcategory } });
            nodeSet.add(friendName);
          }

          // 添加边
          this.graphData.edges.push({
            data: { source: personName, target: friendName, label: relationType }
          });
        });
        console.log('返回的图谱数据:', this.graphData);
        this.$nextTick(() => {
          if (this.viewMode === 'graph') {  // 仅在切换到图谱模式后渲染
            this.renderGraph();
          }
        });
      } catch (error) {
        console.error('图谱数据获取详细错误:', error);
        this.$message.error(`图谱数据获取失败: ${error.message}`);
      } finally {
        if (this.driver) {
          await this.driver.close();
        }
      }
    },


    async fetchGraphDataById() {
      // console.log('当前视图模式:', this.viewMode);  // 检查 viewMode 的值
      console.log("abc4")
      try {
        // 更详细的错误日志
        // console.log('开始获取图谱数据');

        this.driver = neo4j.driver(
            'bolt://175.178.217.62:7687',
            neo4j.auth.basic('neo4j', '12345678')
        );
        console.log(this.form)

        let wherecql=""
        if(this.form.name!=null && this.form.name!=undefined &&  this.form.name!=""){
          wherecql=" where p.name='"+this.form.name+"'  or f.name='"+this.form.name+"'"
        }
        else{
          return;
        }
        console.log(`MATCH (p:Person)-[:FRIEND_WITH]->(f:Person) `+wherecql+` RETURN p.name AS personName, f.name AS friendName `)

        const session = this.driver.session();
        const result = await session.run(
            `MATCH (p:Person)-[r]->(f:Person) `+wherecql
            +` RETURN p.name AS personName, f.name AS friendName,p.category as startcategory,f.category as endcategory `
              // 限制返回数据量
        );

        // console.log('查询结果记录数:', result.records.length);

        // if (result.records.length === 0) {
        //   console.log('没有找到图谱数据');
        //   this.$message.warning('未找到图谱数据');
        //   return;
        // }
        // 提取并格式化图谱数据
        this.graphData = result.records.map(record => ({
          nodes: [
            { data: { id: record.get('personName'), label: record.get('personName'), type: 'person',category:record.get('startcategory') } },
            { data: { id: record.get('friendName'), label: record.get('friendName'), type: 'person' ,category:record.get('endcategory')} },
          ],
          edges: [
            { data: { source: record.get('personName'), target: record.get('friendName') } },
          ],
        }));


        let nodes=this.graphData.flatMap(item => item.nodes);
        this.nodenames=[];
        this.params.names=[]
        nodes.forEach(item=>{
          console.log(item)
          console.log(item.data.label)
          this.nodenames.push(item.data.label)
          this.params.names.push(item.data.label)
        })

        this.loadbynames()
        //console.log(nodes)
        // console.log('返回的图谱数据:', this.graphData);
        // this.$nextTick(() => {
        //   if (this.viewMode === 'graph') {  // 仅在切换到图谱模式后渲染
        //     this.renderGraph();
        //   }
        // });
      } catch (error) {
        console.error('图谱数据获取详细错误:', error);
        this.$message.error(`图谱数据获取失败: ${error.message}`);
      } finally {
        if (this.driver) {
          await this.driver.close();
        }
      }
    },


    // 渲染知识图谱
    renderGraph() {
      // 增加更多健壮性检查
      const container = document.getElementById('graph-container');
      if (!container) {
        console.error('图谱容器不存在');
        this.$message.error('图谱容器未找到');
        return;
      }

      if (!this.graphData || this.graphData.length === 0) {
        this.$message.warning('没有可用的图谱数据');
        return;
      }

      try {
        // 确保打印图谱数据
        console.log('图谱数据:', this.graphData);
        console.log(this.graphData.nodes)
        console.log("123123123")

        // const elements = {
        //   nodes: this.graphData.flatMap(item => item.nodes),
        //   edges: this.graphData.flatMap(item => item.edges)
        // };

        // console.log('图谱渲染元素:', elements);

        // 使用 Cytoscape 渲染图谱
        const cy = cytoscape({
          container: container,
          // elements: elements,
          elements: {
            nodes: this.graphData.nodes,
            edges: this.graphData.edges
          },
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#D291BC', // 节点颜色为粉色
                'label': 'data(label)',
                'width': '60px',
                'height': '60px',
                'font-size': '8px',
                'color': '#ffffff', // 标签字体颜色
                'text-valign': 'center',
                'text-halign': 'center',
                'overlay-padding': '6px'
              }
            },
            {
              selector: 'edge',
              style: {
                'label': 'data(label)', // 从数据中获取标签
                'line-color': '#999999', // 边的颜色
                'curve-style': 'bezier', // 使用贝塞尔曲线样式
                'target-arrow-shape': 'triangle', // 边箭头形状
                'target-arrow-color': '#999999', // 箭头颜色
                'font-size': '15px', // 标签字体大小
                'text-outline-width': 0.5, // 标签文字轮廓宽度
                'text-outline-color': '#000000', // 标签文字轮廓颜色
                'text-margin-y': -10 // 标签相对于边的垂直偏移量
              }
            }
          ],
          layout: {
            name: 'cose',
            animate: true,
            fit: true,
            padding: 10,
            nodeRepulsion: 5000,
            idealEdgeLength: 50,
            edgeElasticity: 200,
            gravity: 1,
            numIter: 500,
            initialTemp: 150,
            coolingFactor: 0.95
          }
        });
        cy.nodes().forEach(function(node){


          // console.log("ababababab")
          // console.log(node.data("category"))
          // console.log(node[0].data.category)
          let category=node.data("category")
          if(category==undefined){
                  // return '#D291BC'; // 粉色
                  node.style({ 'background-color': '#D291BC' })
                }
                else{
                  if(category.indexOf("weibo")!==-1){
                    // return "#FF6633";
                    node.style({ 'background-color': '#FF6633' })
                  }
                  else if(category.indexOf("douban")!==-1){
                    // return "#CCCCFF";
                    node.style({ 'background-color': '#CCCCFF' })

                  }
                  else if(category.indexOf("tiktok")!==-1){
                    // return "#FFCC66";
                    node.style({ 'background-color': '#FFCC66' })

                  }
                  else if(category.indexOf("douyin")!==-1){
                    // return "#CCFFFF";
                    node.style({ 'background-color': '#CCFFFF' })

                  }
                  else if(category.indexOf("bilibili")!==-1){
                    // return "#99FFFF";
                    node.style({ 'background-color': '#99FFFF' })

                  }
                  
                  
                  
                }
          




        })

        // Log cytoscape instance to see if it's properly initialized
        console.log('Cytoscape实例:', cy);
      } catch (error) {
        console.error('图谱渲染详细错误:', error);
        this.$message.error('图谱渲染出现问题');
      }
    }
  },
};
</script>

<style scoped>
.user-info-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.user-info-top {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.user-details {
  flex: 1;
}

.user-details p {
  margin: 5px 0;
  font-size: 16px;
}

.button-group {
  display: flex;
  flex-direction: column;
}
#graph-container {
  width: 100%;
  height: 600px; /* 确保图谱容器有足够的高度 */
}
.el-table {
  margin-top: 20px;
}
</style>
