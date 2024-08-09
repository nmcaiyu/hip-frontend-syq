<template>
	<div class="container flex-grow flex-column">
		<section class="non-footer">
			<div class="header flex flex-align-center">
				<!-- <svg-icon icon-class="hospital" /> -->
				<img :src="`${$publicPath}icons/hospital.png`">
				<span class="text">自助服务</span>
			</div>
			<div class="nav-container flex-column">
				<div v-for="(row, rowIndex) in routeNameRows" :key="rowIndex" class="nav-row flex flex-justify-between">
					<template v-for="(name, itemIndex) in row">
						<nav-item v-if="name" :key="itemIndex" v-bind="nav[name]" :route-name="name" @click="onClick(name)" />
						<nav-item-empty v-else :key="itemIndex" />
					</template>
				</div>
			</div>
		</section>
		<section class="footer flex flex-align-center">
			<!-- <svg-icon icon-class="warning-fill" /> -->
			<img :src="`${$publicPath}icons/warning-fill.png`">
			<span class="text">温馨提示：请保护好个人信息！</span>
		</section>
	</div>
</template>

<script>
import NavItem from './components/NavItem.vue';
import NavItemEmpty from './components/NavItemEmpty.vue';
import { getPermittedNav } from '@/api';
import { mapState, mapMutations } from 'vuex';
import NavMap from './components/NavMap';
import _ from 'lodash';
import { divideArray, rowSupplement } from '@/utils/helper';

export default {
	components: {
		NavItem,
		NavItemEmpty,
	},
	data() {
		return {
			routeNameRows: [],
			columnCount: 3,
		};
	},
	computed: {
		...mapState({
			nav: (state) => state.constant.nav,
		}),
	},
	created() {
		history.forward();
		getPermittedNav().then((result) => {
			const outPatientList = _.uniq(
				result.outpMenus.filter((item) => this.nav[item.path])
			);
			let subNav = null;
			for (const item of outPatientList) {
				const { remarks } = item;
				if (remarks !== null && remarks !== '') {
					if (!subNav) subNav = {};
					subNav[item.path] = JSON.parse(item.remarks);
				}
			}
			if (subNav) this.setSession(['subNav', subNav]);
			const routeNames = outPatientList.map((item) => item.path);
			rowSupplement(routeNames, this.columnCount);
			this.routeNameRows = divideArray(routeNames, this.columnCount);
		});
	},
	methods: {
		...mapMutations({
			setSession: 'session/set',
		}),
		onClick(routeName) {
			this.setSession(['redirect', routeName]);
			this.$router.push({ name: routeName }).catch((err) => err);
		},
	},
};
</script>

<style lang="scss" scoped>
.non-footer {
	flex-grow: 1;
	padding: 0 60px;
}
.header {
	padding-top: 30px;
	.text {
		margin-left: 25px;
		font-size: 38px;
	}
	// .svg-icon {
	//     color: #588EFF;
	//     font-size: 52px;
	// }
	img {
		width: 40px;
	}
}
.nav-container {
	padding: 30px 40px 0;
	/* row-gap: 25px; */
	.nav-row {
		margin-top: 25px;
	}
	.nav-row:first-child {
		margin-top: 0;
	}
}
.footer {
	padding: 0 60px;
	height: 50px;
	background: #dbe5ff;
	color: #588eff;
	.text {
		margin-left: 5px;
		font-weight: bold;
		font-size: 22px;
	}
	// .svg-icon {
	//     font-size: 26px;
	// }
	img {
		width: 26px;
	}
}
</style>
