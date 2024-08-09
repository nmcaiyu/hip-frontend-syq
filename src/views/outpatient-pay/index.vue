<template>
	<div class="main-container flex-grow flex-column">
		<timer />
		<nav-caption caption="门诊缴费单" />
		<section class="main-section flex-grow flex-column flex-align-stretch">
			<div class="flex-grow">
				<el-table :data="unpaidBills" class="table" height="480" v-loading="loading" v-if="tableState == 0">
					<el-table-column label="处方名称" prop="billType" />
					<!-- <el-table-column label="医生" prop="doctorName" /> -->
					<el-table-column label="处方时间" prop="billTime" width="160">
						<template slot-scope="scope">{{ scope.row.billTime.split(' ')[0] }}</template>
					</el-table-column>
					<el-table-column label="费用(元)" prop="fee" width="140" />
					<el-table-column label="操作" width="160">
						<template slot-scope="scope">
							<button class="button-check" @click="check(scope.row.id)">查看明细</button>
						</template>
					</el-table-column>
				</el-table>
				<el-table ref="multipleTable" :data="unpaidBills" class="table" height="480" v-loading="loading" v-if="tableState == 1" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column label="处方名称" prop="billType" />
					<!-- <el-table-column label="医生" prop="doctorName" /> -->
					<el-table-column label="处方时间" prop="billTime" width="160">
						<template slot-scope="scope">{{ scope.row.billTime.split(' ')[0] }}</template>
					</el-table-column>
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
					<!-- <el-table-column label="单价" prop="price" width="140"> -->
					<!--     <template slot-scope="scope"> -->
					<!--         <span>{{ scope.row.price | currency }}</span> -->
					<!--     </template> -->
					<!-- </el-table-column> -->
					<el-table-column label="数量" prop="count" width="140" />
					<el-table-column label="费用(元)" width="140">
						<!-- <template slot-scope="scope"> -->
						<!--     <span>{{ currency(scope.row.price).multiply(scope.row.count) }}</span> -->
						<!-- </template> -->
						<template slot-scope="scope">
							<span>{{ scope.row.price | currency }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-drawer>
			<span class="tip" v-if="tableState == 0">
				已选择
				<template v-if="this.unpaidBills.length > 0">
					{{ this.unpaidBills[0].deptName }}
				</template>
				{{ this.unpaidBills.length }} 条单据，总金额 {{ this.billAmount }} 元
			</span>
			<span class="tip" v-if="tableState == 1 && this.selectList.length > 0">
				已选择
				{{ this.selectList.length }} 条单据，总金额 {{ this.selectList[0].fee }} 元
			</span>
			<button class="button-pay" @click="pay">支付</button>
		</section>
		<nav-footer class="nav-footer" />
		<audio-tip name="choose-outpatient-bill" />
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
	getOutpatientUnpaidBills,
	getOutpatientBillInvoice,
	createOutpatientPayOrder,
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
			unpaidBills: [],
			billInvoice: [],
			drawer: false,
			orderNum: null,
			total: 0,
			currentPage: 1,
			pageSize: 1,
			loading: false,
			methodName: '',
			tableState: null,
			selectList: [],
		};
	},
	computed: {
		...mapState({
			patient: (state) => state.session.patient,
		}),
		billAmount() {
			let amount = currency(0);
			if (this.unpaidBills.length > 0) {
				for (const b of this.unpaidBills) {
					amount = amount.add(b.fee);
				}
			}
			return amount;
		},
	},
	created() {
		this.methodName = this.$route.params.methodName;
		if (this.methodName && this.methodName == 'SOCIAL_SECURITY_CARD') {
			// 判断是医保支付
			this.tableState = 1;
			this.fetchData();
		} else {
			// 走身份证原支付方法
			this.tableState = 0;
			this.fetchData();
		}
	},
	mounted() {
		this.$refs.drawer.$el
			.getElementsByClassName('el-drawer')
			.item(0).style.height = '700px';
	},
	methods: {
		...mapMutations({
			setSession: 'session/set',
		}),
		...mapActions({
			startLoading: 'session/startLoading',
			stopLoading: 'session/stopLoading',
			resetTimer: 'session/resetTimer',
			startTimer: 'session/startTimer',
		}),
		pageChange(page) {
			this.fetchData(page);
			this.currentPage = page;
		},
		async fetchData(page = 1) {
			this.loading = true;
			this.resetTimer(this.start).then(() => {
				this.startTimer();
			});
			await sleep(0.5);
			const params = {
				page,
				limit: this.pageSize,
				patientId: this.patient.patientId,
			};
			getOutpatientUnpaidBills(params).then((result) => {
				this.loading = false;
				if (result.total && result.total > 0) this.total = result.total;
				if (result.list.length > 0) {
					const item = result.list[0];
					if (item.payBills && item.payBills.length > 0) {
						this.unpaidBills = item.payBills;
						this.orderNum = item.orderNum;
					}
				}
			});
		},
		check(billId) {
			this.billInvoice = [];
			this.drawer = true;
			getOutpatientBillInvoice(billId).then((result) => {
				this.billInvoice = result;
			});
		},
		handleSelectionChange(rows) {
			// 仅可以选择一条数据
			if (rows.length > 1) {
				rows.forEach((row, index) => {
					if (index > 0) {
						this.$refs.multipleTable.toggleRowSelection(row, false);
					}
				});
				this.$message.error('仅支持选择一条数据');
				return;
			} else {
				this.selectList = rows;
			}
		},
		currency(val) {
			return currency(val);
		},
		async pay() {
			let data = [];
			let settlementData = [];
			if (this.tableState == 1) {
				if (this.selectList.length == 0) {
					this.$alert('请选择缴费单', '提示', {
						confirmButtonText: '确定',
						showClose: false,
					});
					return;
				} else {
					data = this.selectList.map((b) => b.billNum);
					settlementData = this.selectList
						.map((b) => b.param)
						.join('^');
				}
			} else if (this.tableState == 0) {
				if (this.unpaidBills.length == 0) {
					this.$alert('无可支付缴费单', '提示', {
						confirmButtonText: '确定',
						showClose: false,
					});
					return;
				} else {
					data = this.unpaidBills.map((b) => b.billNum);
					settlementData = this.unpaidBills
						.map((b) => b.param)
						.join('^');
				}
			}
			this.startLoading({ text: '创建支付订单' });
			await sleep(1);
			createOutpatientPayOrder(data).then((result) => {
				this.stopLoading();
				if (result) {
					this.setSession(['paymentBusinessType', 'OUTPATIENT']);
					this.setSession(['paymentAmount', this.billAmount]);
					this.setSession(['paymentOrderNo', result]);
					this.setSession(['settlementData', settlementData]);
					this.$router
						.push({ name: 'SettlementDispatch' })
						.catch((err) => err);
				} else {
					this.$router.push({
						name: 'Result',
						params: {
							icon: 'error',
							title: '支付订单创建失败',
						},
					});
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.table {
	width: 100%;
}
.button-check {
	border: none;
	border-radius: 10px;
	background-color: #3a8fff;
	color: #ffffff;
	padding: 10px 20px;
	cursor: pointer;
	font-size: 24px;
}
.button-pay {
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
