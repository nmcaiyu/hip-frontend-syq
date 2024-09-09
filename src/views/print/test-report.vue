<template>
	<div class="main-container flex-grow flex-column">
		<object id="TestOcx" hidden="hidden" width="" height="" classid="clsid:AC5F1EE4-B264-4330-9550-BB9241ACA7DE">
		</object>
		<!-- <timer />
        <nav-caption caption="检验报告" />
        <section class="main-section flex-grow flex-column">
            <span class="tip">
                未打印：{{ unprinted }} 张，
                未出报告：{{ unreported }} 张，
                已打印：{{ total - unprinted - unreported }} 张，
                总共：{{ total }} 张
            </span>
            <div class="flex-grow">
                <el-table
                    ref="table"
                    :data="lists[currentPage - 1]"
                    class="table"
                    height="420"
                    v-loading="loading"
                >
                    <el-table-column label="日期" prop="testDate" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.testDate | formatHisDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="姓名" prop="name" width="160" />
                    <el-table-column label="医生" prop="doctorName" width="160" />
                    <el-table-column label="项目" prop="testName" />
                    <el-table-column label="状态" prop="printed" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.printed === 0 ? '未打印' : '' }}
                            {{ scope.row.printed === 1 ? '已打印' : '' }}
                            {{ scope.row.printed === 2 ? '未出报告' : '' }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-pagination
                v-if="total > 0"
                background
                layout="pager"
                :total="total"
                :page-size="pageSize"
                hide-on-single-page
                @current-change="pageChange"
                class="pagination-wrapper flex flex-justify-center"
            />

            <span class="tip">注意：如未取到报告，请联系检验科窗口或导诊人员</span>
            <button class="button-print" @click="print">打印</button>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="choose-appointment-log" /> -->
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState, mapActions } from 'vuex';
import { getTestRecords, printTestReports } from '@/api';
import AudioTip from '@/components/AudioTip';
import { divideArray, sleep } from '@/utils/helper';
import { MessageBox } from 'element-ui';

export default {
	components: {
		Timer,
		NavFooter,
		NavCaption,
		AudioTip,
	},
	data() {
		return {
			currentPage: 1,
			pageSize: 5,
			total: 0,
			lists: [],
			unprinted: 0,
			unreported: 0,
			records: [],
			loading: false,
		};
	},
	computed: {
		...mapState({
			patient: (state) => state.session.patient,
		}),
	},
	created() {
		// this.fetchData()
	},
	mounted() {
		this.getTransferAdhibition();
	},
	methods: {
		getTransferAdhibition() {
			this.$message({
				message: '请稍后报告正在打印，请留意机器下方打印出口',
				type: 'info',
				duration: 30000,  // 持续时间为20秒，20秒后自动关闭
				showClose: true,
				customClass: 'custom-message'
			});

			let obj = document.getElementById('TestOcx');
			let str = `1@${this.patient.patientId}@MOREINFO`;
			/**获取本机桌面路径
			 * BOOL ShellExecute(BSTR FilePath, BSTR Param, LONG ShowCmd);
			 * FilePath:exe文件的路径
			 * Param:传给exe的参数
			 * ShowCmd:exe显示方式，0为隐藏执行，其他值参考windows api:ShellExecute
			 * 返回值:TRUE成功，FALSE失败
			 **/
			obj.ShellExecute('d:\\rmlis6\\rmlis6_report.exe', str, 0);
            // 跳转回首页
			this.$router.push({ name: 'Home' });
		},
		...mapActions({
			startLoading: 'session/startLoading',
			stopLoading: 'session/stopLoading',
		}),
		fetchData() {
			this.loading = true;
			getTestRecords(this.patient.patientId)
				.then((result) => {
					this.loading = false;
					this.total = result.length;
					this.lists = divideArray(result, this.pageSize);
					this.records = result;
					for (const r of result) {
						if (r.printed === 0) this.unprinted++;
						if (r.printed === 2) this.unreported++;
					}
				})
				.catch((error) => {
					this.loading = false;
					this.handleError(error);
				});
		},
		pageChange(page) {
			this.currentPage = page;
		},
		submit() {
			this.fetchData();
		},
		print() {
			if (this.unprinted > 0) {
				this.startLoading({ text: '正在打印' });
				const unprintedRecords = this.records.filter(
					(r) => r.printed === 0
				);
				const data = unprintedRecords.map((r) => {
					return {
						reportNo: r.reportNo,
						pdfPath: r.pdfpath,
					};
				});
				printTestReports(data)
					.then(() => {
						this.stopLoading();
						const params = {
							icon: 'success',
							title: '操作成功',
							subTitle: '正在打印中，请不要走开',
						};
						this.$router
							.push({ name: 'Result', params })
							.catch((err) => err);
					})
					.catch((error) => {
						this.stopLoading();
						if (error.code && error.code === 1) {
							const params = {
								icon: 'warning',
								title: '打印失败',
								subTitle: '请联系工作人员',
							};
							this.$router
								.push({ name: 'Result', params })
								.catch((err) => err);
						} else {
							this.handleError(error);
						}
					});
			} else {
				this.$alert('无可打印报告', '提示', {
					confirmButtonText: '确定',
					showClose: false,
				});
			}
		},
		handleError(error) {
			if (error.code && error.code === 1) {
				this.$alert(error.msg, '提示', {
					confirmButtonText: '确定',
					showClose: false,
				}).then(() => {
					this.$router.push({ name: 'Home' }).catch((err) => err);
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.table {
	width: 100%;
}
.button-print {
	border: none;
	border-radius: 10px;
	background-color: #3a8fff;
	color: #ffffff;
	padding: 20px 20px;
	cursor: pointer;
	font-size: 35px;
	margin-bottom: 20px;
}
.tip {
	font-size: 20px;
	color: #606266;
	font-weight: 500;
	margin-bottom: 20px;
}
.pagination-wrapper {
	padding-bottom: 20px;
}
</style>

<style>
  /* 自定义样式 */
  .custom-message {
    font-size: 60px !important; /* 放大字体 */
    padding: 20px 30px !important; /* 增加内边距 */
    max-width: 100% !important; /* 限制最大宽度 */
    border-radius: 10px !important; /* 圆角边框 */
    background-color: #f5f5f5 !important; /* 背景颜色 */
    color: black !important; /* 设置字体颜色为黑色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important; /* 添加阴影 */
  }

  .custom-message .el-message__content {
    font-size: 60px !important; /* 放大字体 */
    text-align: center !important; /* 文字居中 */
	color: black !important; /* 设置字体颜色为黑色 */
  }
</style>