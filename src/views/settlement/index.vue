<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="请选择结算方式" />
        <section class="main-section flex-grow">
            <div class="sub-nav-container flex-column">
                <div
                    v-for="(row, i1) in navList"
                    :key="i1"
                    class="sub-nav-row flex flex-justify-between"
                >
                    <template
                        v-for="(item, i2) in row"
                    >
                        <sub-nav-item
                            v-if="item"
                            :key="i2"
                            v-bind="item"
                            @click="onClick(item)"
                        />
                        <sub-nav-item-empty
                            v-else
                            :key="i2"
                        />
                    </template>
                </div>
            </div>
        </section>
        <nav-footer class="nav-footer" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import SubNavItem from '../sub-nav/components/SubNavItem.vue'
import SubNavItemEmpty from '../sub-nav/components/SubNavItemEmpty.vue'
import { mapState, mapMutations } from 'vuex'
import { divideArray, rowSupplement } from '@/utils/helper'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        SubNavItem,
        SubNavItemEmpty
    },
    data() {
        return {
            rowSize: 3,
        }
    },
    computed: {
        ...mapState({
            settlementMethods: state => state.constant.settlementMethods
        }),
        redirect() {
            return this.$route.params.redirect
        },
        navList() {
            const list = []
            for (const [k, v] of Object.entries(this.settlementMethods)) {
                list.push({
                    type: k,
                    ...v
                })
            }
            rowSupplement(list, this.rowSize)
            return divideArray(list, this.rowSize)
        }
    },
    created() {
        if (!this.redirect) {
            this.$router.replace({ name: 'Home' }).catch(err => err)
        }
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        onClick(item) {
            this.setSession([ 'redirect', this.redirect ])
            this.setSession([ 'settlementType', item.type ])
            if (item.type === 'HEALTH_INSURANCE') {
                this.$alert('请先插入医保卡', '提示', {
                    confirmButtonText: '确定',
                    showClose: false,
                }).then(() => {
                    this.$router.push({ name: this.redirect }).catch(err => err)
                });
            }
            this.$router.push({ name: this.redirect }).catch(err => err)
        }
    }
}
</script>

<style lang="scss" scoped>
.sub-nav-container {
    /* gap: 30px 60px; */
    .sub-nav-row {
        margin-top: 30px;
    }
    .sub-nav-row:first-child {
        margin-top: 0;
    }
}
</style>
