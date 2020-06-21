<template>
  <div>
    <el-button type="primary" plain icon="el-icon-plus" @click="showAdd">添加</el-button>
    <el-table v-loading="loading" :data="trademarks" border style="width: 100% ; margin:20px 0;">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌Logo">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" style="width:100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showUpdate(scope.row)"
          >修改文本</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTrademark(scope.row)"
          >删除文本</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size="limit"
      layout=" prev, pager, next, jumper, -> ,sizes, total"
      :total="total"
      @current-change="getTrademarks"
      @size-change="handleSizeChange"
    ></el-pagination>

    <el-dialog :title="form.id ?'修改品牌':'添加品牌'" :visible.sync="isShowDialog">
      <el-form :rules="rules" ref="ruleForm" :model="form">
        <el-form-item label="品牌名称" label-width="120px" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="120px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload "
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      trademarks: [],
      total: 0,
      page: 1,
      limit: 3,
      isShowDialog: false,
      form: {
        tmName: "",
        logoUrl: ""
      },
      loading: false,
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        logoUrl: [{ required: true, message: "请上传Logo图片" }]
      }
    };
  },
  mounted() {
    this.getTrademarks();
  },
  methods: {
    async getTrademarks(page = 1) {
      this.page = page;
      this.loading = true;
      const result = await this.$API.trademark.getList(page, this.limit);
      this.loading = false;
      if (result.code === 200) {
        const { records, total } = result.data;
        this.trademarks = records;
        this.total = total;
      } else {
        this.$message({
          type: "warning",
          message: "获取分页列表失败"
        });
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTrademarks(1);
    },
    showAdd() {
      this.form = {
        tmName: "",
        logoUrl: ""
      };
      this.isShowDialog = true;
    },
    showUpdate(trademark) {
      this.isShowDialog = true;
      this.form = { ...trademark };
    },

    handleAvatarSuccess(res, file) {
      this.form.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 < 500;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG /PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 500kb!");
      }
      return isJPG && isLt2M;
    },
    addOrUpdate() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          const trademark = this.form;
          let result;
          if (trademark.id) {
            result = await this.$API.trademark.update(trademark);
          } else {
            result = await this.$API.trademark.add(trademark);
          }

          if (result.code === 200) {
            this.$message.success(`${trademark.id ? "更新" : "添加"}成功`);
            this.isShowDialog = false;
            this.getTrademarks(trademark.id ? this.page : 1);
          } else {
            this.$message.error(`${trademark.id ? "更新" : "添加"}失败`);
          }
        } else {
          console.log("校验不通过");
          return false;
        }
      });
    },
    deleteTrademark(trademark) {
      this.$confirm(`确定删除${trademark.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger"
      })
        .then(async () => {
          const result = await this.$API.trademark.remove(trademark.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getTrademarks(
              this.trademarks.length === 1 ? this.page - 1 : this.page
            );
          } else {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>