<template>
	<div class="main-container flex-grow flex-column">
		<timer />
		<nav-caption caption="门诊缴费记录" />
		<section class="main-section flex-grow flex-column">
			<div>
				<el-table :data="paidBills" class="table" height="370" v-loading="loading">
					<el-table-column label="处方时间" prop="billTime" width="160" />
					<el-table-column label="处方编号" prop="billType" />
					<el-table-column label="费用(元)" prop="fee" width="140" />
					<el-table-column label="操作" width="160">
						<template slot-scope="scope">
							<button class="button-check" @click="check(scope.row.id)">查看明细</button>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<el-pagination v-if="total > 0" background layout="pager" :total="total" :page-size="pageSize" hide-on-single-page @current-change="pageChange" class="pagination-wrapper flex flex-justify-center" />

			<el-drawer ref="drawer" :visible.sync="drawer" direction="btt" class="drawer">
				<span slot="title" class="drawer-title">单据明细</span>
				<el-table :data="billInvoice" class="table" height="600">
					<el-table-column label="项目名称" prop="itemName" />
					<el-table-column label="规格" prop="specs" />
					<el-table-column label="单价" prop="price" width="140">
						<template slot-scope="scope">
							<span>{{ scope.row.price | currency }}</span>
						</template>
					</el-table-column>
					<el-table-column label="数量" prop="count" width="140" />
					<el-table-column label="费用(元)" width="140">
						<template slot-scope="scope">
							<span>{{ currency(scope.row.price).multiply(scope.row.count) }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-drawer>

			<span class="tip">
				已选择
				<template v-if="this.paidBills.length > 0">
					{{ this.paidBills[0].deptName }}
				</template>
				{{ this.paidBills.length }} 条单据，总金额 {{ this.billAmount }} 元
			</span>
			<button class="button-print" @click="print">打印</button>
		</section>
		<nav-footer class="nav-footer" />
		<audio-tip name="choose-outpatient-payment-record" />
       
	</div> 
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState, mapActions } from 'vuex';
import {
	getOutpatientPaidBills,
	getOutpatientBillInvoice,
	printOutpatientPaidBill,
} from '@/api';
import AudioTip from '@/components/AudioTip';
import { sleep } from '@/utils/helper';
import currency from 'currency.js';

export default {
	components: {
		Timer,
		NavFooter,
		NavCaption,
		AudioTip,
	},
	data() {
		return {
			paidBills: [],
			billInvoice: [],
			drawer: false,
			orderNum: null,
			total: 0,
			currentPage: 1,
			pageSize: 1,
			loading: false,
		};
	},
	computed: {
		...mapState({
			patient: (state) => state.session.patient,
		}),
		billAmount() {
			let amount = currency(0);
			if (this.paidBills.length > 0) {
				for (const b of this.paidBills) {
					amount = amount.add(b.fee);
				}
			}
			return amount;
		},
	},
	created() {
		this.fetchData()
	},
	mounted() {
		this.$refs.drawer.$el
			.getElementsByClassName('el-drawer')
			.item(0).style.height = '700px';
	},
	methods: {
		...mapActions({
			startLoading: 'session/startLoading',
			stopLoading: 'session/stopLoading',
		}),
		pageChange(page) {
			this.fetchData(page);
			this.currentPage = page;
		},
		async fetchData(page = 1) {
			this.loading = true;
			await sleep(0.5);
			const params = {
				page,
				limit: this.pageSize,
				patientId: this.patient.patientId,
			};
			getOutpatientPaidBills(params)
				.then((result) => {
					this.loading = false;
					if (result.total && result.total > 0)
						this.total = result.total;
					if (result.list.length > 0) {
						const item = result.list[0];
						if (item.payBills && item.payBills.length > 0) {
							this.paidBills = item.payBills;
							this.orderNum = item.orderNum;
						}
					}
				})
				.catch((error) => {
					this.loading = false;
					this.handleError(error);
				});
		},
		check(billId) {
			this.billInvoice = [];
			this.drawer = true;
			getOutpatientBillInvoice(billId)
				.then((result) => {
					this.billInvoice = result;
				})
				.catch((error) => {
					this.handleError(error);
				});
		},
		currency(val) {
			return currency(val);
		},
		async print() {
			if (this.orderNum) {
				this.startLoading({ text: '正在打印' });
				await sleep(1);
				const params = {
					orderNum: this.orderNum,
					printType: 2,
				};
				printOutpatientPaidBill(params)
					.then((result) => {
						this.stopLoading();
						if (result && result.printCode === '1') {
							const params = {
								icon: 'success',
								title: '操作成功',
								subTitle: '正在打印中，请不要走开',
							};
							this.$router
								.push({ name: 'Result', params })
								.catch((err) => err);
						} else if (!result || result.printCode === '2') {
							if (result.printMsg)
								console.error('===', result.printMsg);
							const params = {
								icon: 'warning',
								title: '打印失败',
								subTitle: '请联系工作人员',
							};
							this.$router
								.push({ name: 'Result', params })
								.catch((err) => err);
						}
					})
					.catch((error) => {
						this.handleError(error);
					});
			} else {
				this.$router
					.push({
						name: 'Result',
						params: { icon: 'info', title: '无可打印单据' },
					})
					.catch((err) => err);
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
::v-deep .el-table.table .el-table__header-wrapper .cell{
    font-size: 20px;
}
::v-deep .el-table.table .el-table__body-wrapper .cell, .el-table.table .el-table__body-wrapper .el-table__empty-text{

    font-size: 16px;
}
::v-deep .el-table .el-table__cell{
        padding: 0;
}
.table {
	width: 100%;
}
.button-check {
	border: none;
	border-radius: 10px;
	background-color: #3a8fff;
	color: #ffffff;
	padding: 6px 14px;
	cursor: pointer;
	font-size: 16px;
}
.button-print {
	border: none;
	border-radius: 10px;
	background-color: #3a8fff;
	color: #ffffff;
	padding: 14px;
	cursor: pointer;
	font-size: 26px;
	margin-bottom: 10px;
}
.tip {
	font-size: 20px;
	color: #606266;
	font-weight: 500;
	margin-bottom: 10px;
}
.pagination-wrapper {
	padding-bottom: 20px;
}
</style>
