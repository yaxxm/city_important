<template>
  <div class="home-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-card class="search-card">
        <div class="search-header">
          <h2>关系图谱查询</h2>
        </div>
        <el-form :inline="true" :model="formSearch" class="search-form">
          <el-form-item label="昵称">
            <el-input 
              v-model="formSearch.name" 
              placeholder="请输入昵称"
              prefix-icon="el-icon-user"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="关系">
            <el-input 
              v-model="formSearch.relation" 
              placeholder="请输入关系"
              prefix-icon="el-icon-connection"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="onSubmit"
              class="search-button"
              :loading="loading"
            >
              <i class="el-icon-search"></i>
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 图谱展示区域 -->
    <div class="graph-section">
      <el-card class="graph-card">
        <div class="graph-header">
          <div class="graph-title">
            <i class="el-icon-data-analysis"></i>
            <span>关系图谱可视化</span>
          </div>
          <div class="graph-controls">
            <el-tooltip content="重置视图" placement="top">
              <el-button 
                type="text" 
                icon="el-icon-refresh"
                @click="resetView"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip content="全屏显示" placement="top">
              <el-button 
                type="text" 
                icon="el-icon-full-screen"
                @click="toggleFullscreen"
                circle
              ></el-button>
            </el-tooltip>
          </div>
        </div>
        <div id="graph-container" class="graph-container"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Cookies from "js-cookie";
import * as d3 from "d3";
import neo4j from "neo4j-driver";
import cytoscape from 'cytoscape';

export default {
  name: 'HomeView',
  data() {
    return {
      loading: false,
      viewMode: "graph",
      graphData: [],
      formSearch: {
        name: "",
        relation: ""
      },
      admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
      isFullscreen: false
    }
  },
  created() {
    this.graphinit();
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.fetchGraphData().finally(() => {
        this.loading = false;
      });
    },

    resetView() {
      const container = document.getElementById('graph-container');
      if (container) {
        const svg = d3.select(container).select('svg');
        if (!svg.empty()) {
          svg.transition().duration(500).call(
            d3.zoom().transform,
            d3.zoomIdentity
          );
        }
      }
    },

    toggleFullscreen() {
      const container = document.getElementById('graph-container');
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          this.$message.error(`全屏模式错误: ${err.message}`);
        });
        this.isFullscreen = true;
      } else {
        document.exitFullscreen();
        this.isFullscreen = false;
      }
    },

    async relationAdd(){
      this.dialogVisible = false
      try{


        this.driver = neo4j.driver(
            'bolt://175.178.217.62:7687',
            neo4j.auth.basic('neo4j', '12345678')
        );

      } catch (error) {
        console.error('图谱数据获取详细错误:', error);
        this.$message.error(`图谱数据获取失败: ${error.message}`);
      } finally {
        if (this.driver) {
          await this.driver.close();
        }
      }

    },

    graphinit(){

      this.$nextTick(() => {
          const container = document.getElementById('graph-container');
          console.log('切换到图谱模式后，图谱容器:', container);
          if (container) {
            this.fetchGraphData();
            //this.renderGraph();  // 渲染图谱
          } else {
            console.error('图谱容器未找到');
          }
        });


    },


    async fetchGraphData() {
      try {
        this.driver = neo4j.driver(
            'bolt://175.178.217.62:7687',
            neo4j.auth.basic('neo4j', '12345678')
        );

        const session = this.driver.session();

        let wherecql = " WHERE 1=1 ";
        if (this.formSearch.name) {
          const nameVal = this.formSearch.name;
          wherecql += ` AND (
      (p.name CONTAINS '${nameVal}' OR p.nickname CONTAINS '${nameVal}')
      OR
      (f.name CONTAINS '${nameVal}' OR f.nickname CONTAINS '${nameVal}')
      ) `;
        }
        if (this.formSearch.relation) {
          wherecql += ` AND type(r)='${this.formSearch.relation}' `;
        }


        const query = `
      MATCH (p)-[r]->(f) ${wherecql}
      RETURN p, f, type(r) AS relationType
    `;
        const result = await session.run(query);

        this.graphData = { nodes: [], edges: [] };
        const nodeSet = new Set();

        result.records.forEach(record => {
          const pNode = record.get('p');
          const fNode = record.get('f');
          const relationType = record.get('relationType');

          // === 获取唯一 ID ===
          const pId = pNode.properties.userID || pNode.identity.toString();
          const fId = fNode.properties.userID || fNode.identity.toString();

          // === 获取显示名称（label）===
          const pLabel = pNode.properties.nickname || pNode.properties.name || pId;
          const fLabel = fNode.properties.nickname || fNode.properties.name || fId;

          const pCategory = pNode.labels[0] || 'Unknown';
          const fCategory = fNode.labels[0] || 'Unknown';

          if (!nodeSet.has(pId)) {
            this.graphData.nodes.push({
              id: pId,
              label: pLabel,
              type: 'person',
              category: pCategory
            });
            nodeSet.add(pId);
          }

          if (!nodeSet.has(fId)) {
            this.graphData.nodes.push({
              id: fId,
              label: fLabel,
              type: 'person',
              category: fCategory
            });
            nodeSet.add(fId);
          }

          this.graphData.edges.push({
            source: pId,
            target: fId,
            label: relationType
          });
        });

        this.$nextTick(() => {
          if (this.viewMode === 'graph') {
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
    }
    ,
    renderGraph() {
      const container = document.getElementById('graph-container');
      if (!container) {
        console.error('图谱容器不存在');
        this.$message.error('图谱容器未找到');
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;

      // 清除旧内容
      d3.select(container).selectAll("svg").remove();

      const svg = d3.select(container).append('svg')
          .attr('width', width)
          .attr('height', height);

      const g = svg.append('g');

      // 缩放功能
      const zoom = d3.zoom()
          .scaleExtent([0.1, 10])
          .on('zoom', () => {
            g.attr('transform', d3.zoomTransform(svg.node()));
          });
      svg.call(zoom);

      const simulation = d3.forceSimulation(this.graphData.nodes)
          .force('link', d3.forceLink(this.graphData.edges)
              .id(d => d.id)
              .distance(80)         // 推荐80~120，拉开连线节点
              .strength(0.8)
          )
          .force('charge', d3.forceManyBody()
              .strength(-150)       // 节点之间的斥力，避免挤一堆
          )
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collide', d3.forceCollide()
              .radius(28)           // 节点碰撞避免重叠（节点半径20 + 缓冲）
              .strength(0.9)
          ).force('x', d3.forceX(width / 2).strength(0.05)
          ).force('y', d3.forceY(height / 2).strength(0.05))
      ;

// === 自动缩放整个图谱到视图中心 ===
      simulation.on('end', () => {
        const allNodes = this.graphData.nodes;
        const xExtent = d3.extent(allNodes, d => d.x);
        const yExtent = d3.extent(allNodes, d => d.y);

        const graphWidth = xExtent[1] - xExtent[0];
        const graphHeight = yExtent[1] - yExtent[0];

        const scale = 0.9 / Math.max(graphWidth / width, graphHeight / height);
        const translateX = width / 2 - (xExtent[0] + graphWidth / 2) * scale;
        const translateY = height / 2 - (yExtent[0] + graphHeight / 2) * scale;

        svg.transition().duration(500).call(
            zoom.transform,
            d3.zoomIdentity.translate(translateX, translateY).scale(scale)
        );
      });


      // 边
      const link = g.append('g')
          .selectAll('.link')
          .data(this.graphData.edges)
          .enter().append('line')
          .attr('class', 'link')
          .attr('stroke', '#999')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrowhead)');

      // 边标签
      const linkText = g.append('g')
          .selectAll('.link-text')
          .data(this.graphData.edges)
          .enter().append('text')
          .attr('class', 'link-text')
          .attr('font-size', '10px')
          .attr('fill', 'black')
          .attr('text-anchor', 'middle')
          .text(d => d.label || '');

      // 节点分组
      const nodeGroup = g.append('g')
          .selectAll('.node-group')
          .data(this.graphData.nodes)
          .enter().append('g')
          .attr('class', 'node-group')
          .on('click', (event, d) => {
            if (d.link) {
              window.open(d.link, '_blank');
            }
          });

      // 颜色映射
      const labelColorMap = {
        'DouyinUser': '#FF88C2',
        'XiaohongshuUser': '#00BCD4',
        'WeiboUser': '#FF9800',
        'TestUser': '#FFD700',
        'FacebookUser': '#3b5998',
        'LinkedinUser': '#0077B5',
        'Person': '#D291BC',
        'Event': '#9E9E9E'
      };

      // 节点圆圈
      nodeGroup.append('circle')
          .attr('class', 'node')
          .attr('r', 20)
          .attr('fill', (d) => {
            const fillColor = labelColorMap[d.category] || '#A3D9A5';
            d._fillColor = fillColor; // 存下来给 stroke 用
            return fillColor;
          })
          .attr('stroke', (d) => {
            const baseColor = d3.color(d._fillColor);
            return baseColor ? baseColor.darker(1).formatHex() : '#000';
          })
          .attr('stroke-width', 1)
          .call(d3.drag()
              .on('start', (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
              })
              .on('drag', (event, d) => {
                d.x = event.x;
                d.y = event.y;
              })
              .on('end', (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
              })
          );


      // 节点标签文字
      nodeGroup.append('text')
          .style('fill', '#ffffff')
          .style('font-size', '8px')
          .attr('dx', 0)
          .attr('dy', 4)
          .attr('text-anchor', 'middle')
          .text(d => d.label || d.id);

      // 悬停提示（tooltip）
      nodeGroup.append('title')
          .text(d => {
            let intro = '';
            if (d.extra) {
              intro += d.extra.nickname ? `昵称: ${d.extra.nickname}\n` : '';
              intro += d.extra.gender ? `性别: ${d.extra.gender}\n` : '';
              intro += d.extra.location ? `地区: ${d.extra.location}\n` : '';
              intro += d.extra.introduction ? `简介: ${d.extra.introduction}` : '';
            }
            return intro || d.label;
          });

      // 箭头定义
      svg.append('defs').append('marker')
          .attr('id', 'arrowhead')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 20)
          .attr('refY', 0)
          .attr('orient', 'auto')
          .attr('markerWidth', 6)
          .attr('markerHeight', 6)
          .append('path')
          .attr('d', 'M0,-2L10,0L0,2')
          .attr('fill', '#999');

      // 模拟器 tick 更新位置
      simulation.on('tick', function () {
        nodeGroup.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        linkText
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2);
      });
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.search-section {
  margin-bottom: 20px;
}

.search-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-header {
  margin-bottom: 20px;
}

.search-header h2 {
  font-size: 24px;
  color: #1a237e;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.custom-input :deep(.el-input__inner) {
  border-radius: 8px;
  height: 40px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__inner:focus) {
  border-color: #1a237e;
  box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
}

.search-button {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  border: none;
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.graph-section {
  height: calc(100vh - 200px);
}

.graph-card {
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.graph-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.graph-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a237e;
}

.graph-title i {
  font-size: 20px;
}

.graph-controls {
  display: flex;
  gap: 8px;
}

.graph-controls .el-button {
  padding: 8px;
}

.graph-container {
  height: calc(100% - 60px);
  background-color: #fff;
  min-height: 1000px;
  position: relative;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form .el-form-item {
    margin-right: 0;
    width: 100%;
  }

  .graph-section {
    height: calc(100vh - 300px);
  }
}

/* 全屏模式样式 */
:fullscreen .graph-container {
  height: 100vh;
  background-color: #fff;
}

/* 动画效果 */
.search-card,
.graph-card {
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>