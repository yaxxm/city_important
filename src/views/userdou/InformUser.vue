<template>
  <div class="user-info-container">
    <el-card class="user-info-card" v-loading="loading">
      <!-- 用户基本信息 -->
      <div class="user-info-header">
        <div class="user-avatar">
          <el-avatar 
            :size="120" 
            :src="form.avatar_url || defaultAvatar"
            @error="handleAvatarError"
          >
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
          </el-avatar>
        </div>
        <div class="user-basic-info">
          <h2>{{ form.name }}</h2>
          <p class="user-id">ID: {{ form.author_id }}</p>
          <p class="user-signature">{{ form.description }}</p>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ form.like_num }}</span>
            <span class="stat-label">获赞</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ form.fans_num }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ form.follow_num }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ form.publish_num }}</span>
            <span class="stat-label">作品</span>
          </div>
        </div>
      </div>

      <!-- 详细信息 -->
      <el-collapse v-model="activeCollapse" class="user-details">
        <el-collapse-item title="详细信息" name="1">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="认证信息">{{ form.verified_msg || '未认证' }}</el-descriptions-item>
            <el-descriptions-item label="媒体地址">
              <el-link type="primary" :href="form.media_url" target="_blank">{{ form.media_url }}</el-link>
            </el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>

      <!-- 视图切换 -->
      <div class="view-mode-switch">
        <el-radio-group v-model="viewMode" size="large">
          <el-radio-button label="table">用户列表</el-radio-button>
          <el-radio-button label="graph">知识图谱</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 用户列表模式 -->
      <div v-if="viewMode === 'table'" class="table-section">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="抖音平台">
            <el-table 
              :data="tableData" 
              stripe 
              border
              v-loading="tableLoading"
              class="platform-table"
            >
              <el-table-column prop="name" label="用户名" min-width="120"></el-table-column>
              <el-table-column prop="author_id" label="作者ID" min-width="120"></el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
              <el-table-column prop="verified_msg" label="认证信息" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-view"
                    @click="navigateToDetail(scope.row.id)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="其他平台">
            <el-table 
              :data="tableData1" 
              stripe 
              border
              v-loading="tableLoading"
              class="platform-table"
            >
              <el-table-column prop="name" label="用户名" min-width="120"></el-table-column>
              <el-table-column prop="username" label="用户卡号" min-width="120"></el-table-column>
              <el-table-column prop="sex" label="性别" width="80"></el-table-column>
              <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
              <el-table-column prop="address" label="住址" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-view"
                    @click="navigateToDetail1(scope.row.id)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="BiliBili平台">
            <el-table 
              :data="tableDataBi" 
              stripe 
              border
              v-loading="tableLoading"
              class="platform-table"
            >
              <el-table-column prop="name" label="用户名" min-width="120"></el-table-column>
              <el-table-column prop="meidia_id" label="用户ID" min-width="120"></el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-view"
                    @click="navigateToDetailBi(scope.row.id)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="TikTok平台">
            <el-table 
              :data="tableDataTik" 
              stripe 
              border
              v-loading="tableLoading"
              class="platform-table"
            >
              <el-table-column prop="nickName" label="用户名" min-width="120"></el-table-column>
              <el-table-column prop="uid" label="用户ID" min-width="120"></el-table-column>
              <el-table-column prop="uniqueId" label="唯一ID" min-width="120"></el-table-column>
              <el-table-column prop="signature" label="签名" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-view"
                    @click="navigateToDetailTik(scope.row.id)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 知识图谱模式 -->
      <div v-if="viewMode === 'graph'" class="graph-section">
        <div id="graph-container" class="graph-container"></div>
      </div>

      <!-- 返回按钮 -->
      <div class="action-buttons">
        <el-button 
          type="primary" 
          icon="el-icon-back"
          @click="goBack"
          class="back-button"
        >
          返回列表
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
import neo4j from "neo4j-driver";
import cytoscape from 'cytoscape';

export default {
  name: "InformUserDou",
  data() {
    return {
      loading: false,
      tableLoading: false,
      activeCollapse: ['1'],
      activeTab: '0',
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      nodenames: [],
      form: {
        name: "",
        author_id: "",
        description: "",
        verified_msg: "",
        avatar_url: "",
        media_url: "",
        like_num: 0,
        fans_num: 0,
        follow_num: 0,
        publish_num: 0
      },
      tableData: [],
      tableData1: [],
      tableDataBi: [],
      tableDataTik: [],
      total: 0,
      total1: 0,
      totalbi: 0,
      totaltik: 0,
      params: {
        pageNum: 1,
        pageSize: 1000,
        name: "",
        names: []
      },
      viewMode: "table",
      driver: null,
      session: null,
      graphData: []
    };
  },
  created() {
    this.fetchUserInfo();
  },
  watch: {
    '$route.query.id'(newId, oldId) {
      if (newId !== oldId) {
        this.fetchUserInfo();
        this.$nextTick(() => {
          this.changeViewMode("table");
        });
      }
    }
  },
  methods: {
    handleAvatarError() {
      this.form.avatar_url = this.defaultAvatar;
      this.$notify.warning('头像加载失败，已使用默认头像');
    },
    navigateToDetail(id) {
      this.params.names = [];
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
    navigateToDetail1(id) {
      this.params.names = [];
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
      this.params.names = [];
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
    navigateToDetailTik(id) {
      this.params.names = [];
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
      this.$router.push('/userDouList');
    },
    fetchUserInfo() {
      const id = this.$route.query.id;
      if (!id) {
        this.$notify.error('未找到用户ID');
        this.$router.push('/userDouList');
        return;
      }

      this.loading = true;
      request.get(`/userdou/${id}`)
        .then((res) => {
          if (res.code === '200') {
            this.form = res.data;
            this.fetchGraphDataById();
          } else {
            this.$notify.error(res.msg || '加载用户数据失败');
          }
        })
        .catch((error) => {
          console.error("用户详情加载失败：", error);
          this.$notify.error('加载用户数据失败：' + error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchGraphDataById() {
      try {
        this.driver = neo4j.driver(
          'bolt://175.178.217.62:7687',
          neo4j.auth.basic('neo4j', '12345678')
        );

        let wherecql = "";
        if (this.form.name) {
          wherecql = ` where p.name='${this.form.name}' or f.name='${this.form.name}'`;
        } else {
          return;
        }

        const session = this.driver.session();
        const result = await session.run(
          `MATCH (p:Person)-[r]->(f:Person) ${wherecql}
           RETURN p.name AS personName, f.name AS friendName, p.category as startcategory, f.category as endcategory`
        );

        this.graphData = result.records.map(record => ({
          nodes: [
            { data: { id: record.get('personName'), label: record.get('personName'), type: 'person', category: record.get('startcategory') } },
            { data: { id: record.get('friendName'), label: record.get('friendName'), type: 'person', category: record.get('endcategory') } },
          ],
          edges: [
            { data: { source: record.get('personName'), target: record.get('friendName') } },
          ],
        }));

        let nodes = this.graphData.flatMap(item => item.nodes);
        this.nodenames = [];
        this.params.names = [];
        nodes.forEach(item => {
          this.nodenames.push(item.data.label);
          this.params.names.push(item.data.label);
        });

        await this.loadbynames();
      } catch (error) {
        console.error('图谱数据获取详细错误:', error);
        this.$notify.error(`图谱数据获取失败: ${error.message}`);
      } finally {
        if (this.driver) {
          await this.driver.close();
        }
      }
    },
    async loadbynames() {
      this.tableLoading = true;
      try {
        const [rsp, rspbi, rspdou, rsptik] = await Promise.all([
          request.post("/user/pagebynames", this.params.names),
          request.post("/userbi/pagebynames", this.params.names),
          request.post("/userdou/pagebynames", this.params.names),
          request.post("/usertik/pagebynames", this.params.names)
        ]);

        if (rsp.code === "200") {
          this.tableData = rsp.data;
          this.total = rsp.data.length;
        }
        if (rspbi.code === "200") {
          this.tableDataBi = rspbi.data;
          this.totalbi = rspbi.data.length;
        }
        if (rspdou.code === "200") {
          this.tableDataDou = rspdou.data;
          this.totaldou = rspdou.data.length;
        }
        if (rsptik.code === "200") {
          this.tableDataTik = rsptik.data;
          this.totaltik = rsptik.data.length;
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$notify.error('加载数据失败：' + error.message);
      } finally {
        this.tableLoading = false;
      }
    },
    changeViewMode(mode) {
      this.viewMode = mode;
      if (mode === 'graph') {
        this.$nextTick(() => {
          this.renderGraph();
        });
      }
    },
    renderGraph() {
      const container = document.getElementById('graph-container');
      if (!container) {
        this.$notify.error('图谱容器未找到');
        return;
      }

      if (!this.graphData || this.graphData.length === 0) {
        this.$notify.warning('没有可用的图谱数据');
        return;
      }

      try {
        const cy = cytoscape({
          container: container,
          elements: {
            nodes: this.graphData.flatMap(item => item.nodes),
            edges: this.graphData.flatMap(item => item.edges)
          },
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#D291BC',
                'label': 'data(label)',
                'width': '60px',
                'height': '60px',
                'font-size': '8px',
                'color': '#ffffff',
                'text-valign': 'center',
                'text-halign': 'center',
                'overlay-padding': '6px'
              }
            },
            {
              selector: 'edge',
              style: {
                'label': 'data(label)',
                'line-color': '#999999',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#999999',
                'font-size': '15px',
                'text-outline-width': 0.5,
                'text-outline-color': '#000000',
                'text-margin-y': -10
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

        cy.nodes().forEach(function(node) {
          let category = node.data("category");
          if (!category) {
            node.style({ 'background-color': '#D291BC' });
          } else {
            if (category.indexOf("weibo") !== -1) {
              node.style({ 'background-color': '#FF6633' });
            } else if (category.indexOf("douban") !== -1) {
              node.style({ 'background-color': '#CCCCFF' });
            } else if (category.indexOf("tiktok") !== -1) {
              node.style({ 'background-color': '#FFCC66' });
            } else if (category.indexOf("douyin") !== -1) {
              node.style({ 'background-color': '#CCFFFF' });
            } else if (category.indexOf("bilibili") !== -1) {
              node.style({ 'background-color': '#99FFFF' });
            }
          }
        });
      } catch (error) {
        console.error('图谱渲染详细错误:', error);
        this.$notify.error('图谱渲染出现问题');
      }
    }
  }
};
</script>

<style scoped>
.user-info-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.user-info-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.user-avatar {
  margin-right: 20px;
}

.user-basic-info {
  flex: 1;
}

.user-basic-info h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #303133;
}

.user-id {
  color: #909399;
  margin: 5px 0;
}

.user-signature {
  color: #606266;
  margin: 10px 0;
}

.user-stats {
  display: flex;
  gap: 20px;
  margin-left: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.user-details {
  margin: 20px 0;
}

.view-mode-switch {
  margin: 20px 0;
  text-align: center;
}

.table-section {
  margin-top: 20px;
}

.platform-table {
  margin-top: 10px;
}

.graph-section {
  margin-top: 20px;
}

.graph-container {
  width: 100%;
  height: 600px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}

.back-button {
  min-width: 120px;
}
</style>
