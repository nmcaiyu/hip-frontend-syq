<template>
	<div class="main-container flex-grow flex-column">
		<timer />
		<nav-caption caption="住院费用清单详情" />
		<section class="main-section flex-grow flex-column">
			<div class="date-wrapper flex flex-align-center">
				<div class="date-info">
					{{ isSingleDay ? '' : '起始' }}日期：
					{{ time | formatHisDate }}
				</div>
				<div v-if="!isSingleDay" class="flex flex-align-center datepicker-wrapper">
					<div class="date-info">结束日期：</div>
					<date-picker v-model="endDate" value-type="format" placeholder="选择结束日期" />
					<!-- <el-date-picker
                        v-model="endDate"
                        placeholder="选择结束日期"
                        type="date"
                        value-format="yyyyMMdd"
                        class="date-picker"
                        popper-class="date-picker-popper"
                    /> -->
				</div>
				<button v-if="!isSingleDay" class="date-picker-button" @click="submit">查询</button>
			</div>
			<div class="flex-grow">
				<el-table :data="pageable.lists[this.currentPage - 1]" class="table" max-height="325" v-loading="loading">
					<!-- <el-table-column label="日期" prop="item_NAME" width="150">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fee_DTIME ? scope.row.fee_DTIME.split(' ')[0] : '' }}</span>
                        </template>
                    </el-table-column> -->
					<el-table-column label="项目名称" prop="itemName" />
					<el-table-column label="规格" prop="itemSpec" />
					<!-- <el-table-column label="单价(元)" prop="price" width="130">
                        <template slot-scope="scope">
                            <span>{{ scope.row.price | currency }}</span>
                        </template>
                    </el-table-column> -->
					<el-table-column label="数量" prop="totalAmount" width="80">
						<template slot-scope="scope">
							<span>{{ parseInt(scope.row.totalAmount) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="总价(元)" width="140">
						<template slot-scope="scope">
							<span>{{ scope.row.totalCosts | currency }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<el-pagination v-if="pageable.total > 0" background layout="pager" :total="pageable.total" :page-size="pageSize" hide-on-single-page @current-change="pageChange" class="pagination-wrapper flex flex-justify-center" />
		</section>
		<nav-footer class="nav-footer" />
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState } from 'vuex';
import { getInpatientInvoiceDetail } from '@/api';
import { getDate, formatDate, divideArray, sleep } from '@/utils/helper';

export default {
	components: {
		Timer,
		NavFooter,
		NavCaption,
	},
	props: {
		isSingleDay: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			currentPage: 1,
			pageSize: 4,
			pageable: {
				total: 0,
				lists: [],
			},
			startDate: '',
			endDate: '',
			loading: false,
            time:'',
		};
	},
	computed: {
		...mapState({
			patient: (state) => state.session.patient,
		}),
	},
	created() {
		const today = formatDate(getDate(), { divider: '' });
		if (this.isSingleDay) {
			this.startDate = today;
		} else {
			this.startDate = this.patient.indTime;
		}
        this.time = this.changeTimeFormat(this.startDate)
		this.endDate = formatDate(getDate(), { divider: '-' });
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.loading = true;
			const params = {
				inpatientNum: this.patient.inpatientNum,
				startDate: this.changeTimeFormat(this.startDate),
				endDate: this.changeTimeFormatInfo(this.endDate),
			};
			getInpatientInvoiceDetail(params).then((result) => {
				if (result == null) {
					this.$alert('此时间段内暂无费用清单详情', '提示', {
						confirmButtonText: '确定',
						showClose: false,
					}).then(() => {
						this.$router.push({ name: 'Home' }).catch((err) => err);
					});
				}
				this.loading = false;
				this.currentPage = 1;
				this.pageable.total = result.length;
				this.pageable.lists = divideArray(result, this.pageSize);
			});
		},
		submit() {
			this.fetchData();
		},
		pageChange(page) {
			this.currentPage = page;
		},
		changeTimeFormat(value) {
			const year = value.slice(0, 4);
			const month = value.slice(5, 7);
			const day = value.slice(8, 10);
			return `${year}${month}${day}`;
		},
		changeTimeFormatInfo(value) {
			const year = value.slice(0, 4);
			const month = value.slice(5, 7);
			const day = value.slice(8, 10);
			return `${year}${month}${day}`;
		},
	},
};
</script>

<style lang="scss" scoped>
.table {
	width: 100%;
}
.pagination-wrapper {
	padding-bottom: 20px;
}
.date-wrapper {
	padding-bottom: 10px;
	// column-gap: 20px;
}
.date-info {
	font-size: 24px;
}
.date-picker-button {
	border: none;
	border-radius: 7px;
	background-color: #3a8fff;
	color: #ffffff;
	padding: 5px 20px;
	cursor: pointer;
	font-size: 24px;
}
.datepicker-wrapper,
.date-picker-button {
	margin-left: 20px;
}
</style>
