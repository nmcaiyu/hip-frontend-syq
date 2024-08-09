<template>
	<div class="nav-footer">
		<button class="nav-button" :class="{'nav-button-back': $route.name !== 'OutpatientPay' }" @click="goBack">
			<!-- <svg-icon icon-class="back-arrows-fill" /> -->
			<img :src="`${$publicPath}icons/back-arrows-fill.png`">
			<span>返回</span>
		</button>
		<button class="nav-button nav-button-home" @click="goHome">
			<!-- <svg-icon icon-class="home-fill" /> -->
			<img :src="`${$publicPath}icons/home-fill.png`">
			<span>主页</span>
		</button>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	methods: {
		...mapMutations({
			setSession: 'session/set',
		}), 
		goBack() {
			let delta = -1;
			if (this.$route.name === 'IdentificationInfo') {
				delta = -2;
				this.setSession(['patient', null]);
			} else if (this.$route.name === 'OutpatientPay') {
				return;
			}
			this.$router.go(delta);
		},
		goHome() {
			this.$router.push({ name: 'Home' }).catch((err) => err);
		},
	},
};
</script>

<style lang="scss" scoped>
.nav-footer {
	display: flex;
	justify-content: space-between;
	.nav-button {
		width: 240px;
		height: 74px;
		border: none;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40px;
		color: white;
		cursor: pointer;
	}
	img {
		width: 40px;
	}
	.nav-button-back {
		background: #0bc3a0;
	}
	.nav-button-home {
		background: #3a8fff;
	}
}
</style>
