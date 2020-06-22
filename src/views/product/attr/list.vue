<template>
  <!-- <el-form :inline="true" >
    <el-form-item label="一级分类">
      <el-select  placeholder="请选择一级分类">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
   <el-form-item label="二级分类">
      <el-select  placeholder="请选择二级分类">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select  placeholder="请选择三级分类">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
  </el-form>-->
  <div>
    <el-card>
      <CategorySelector @categoryChange="handlCategoryChange" />
    </el-card>
    <el-card style="margin:10px 0">
      <el-button style="margin-bottom:10px" type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table :data="attrs" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="180"></el-table-column>
        <el-table-column label="属性列表">
          <template slot-scope="scope">
            <el-tag
              style="margin-right:5px"
              type="info"
              v-for="(item, index) in scope.row.attrValueList"
              :key="item.id"
            >{{item.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="150">
          <template>
            <el-tooltip class="item" effect="dark" content="点击修改" placement="bottom">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="点击删除" placement="bottom">
              <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrs: [],
      loading: false
    };
  },
  async mounted() {
    const result1 = await this.$API.category.getCategorys1();
    console.log(result1.data);

    const result2 = await this.$API.category.getCategorys2(2);
    console.log(result2.data);

    const result3 = await this.$API.category.getCategorys3(13);
    console.log(result3.data);

    const result4 = await this.$API.attr.getCate(2, 13, 61);
    console.log(result4);
  },
  methods: {
    handlCategoryChange({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.attrs = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.attrs = [];
      } else if (level === 3) {
        this.category3Id = categoryId;
        this.getAttrs();
      }
    },

    async getAttrs() {
      this.loading = true;
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getCate(
        category1Id,
        category2Id,
        category3Id
      );
      this.attrs = result.data;
      this.loading = false;
    }
  }
};
</script>
<style>
.box {
  width: 400px;

  .top {
    text-align: center;
  }

  .left {
    float: left;
    width: 60px;
  }

  .right {
    float: right;
    width: 60px;
  }

  .bottom {
    clear: both;
    text-align: center;
  }

  .item {
    margin: 4px;
  }

  .left .el-tooltip__popper,
  .right .el-tooltip__popper {
    padding: 8px 10px;
  }
}
</style>
