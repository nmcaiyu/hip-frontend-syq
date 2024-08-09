<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="请选择操作" />
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
                            @click="onClick(item.routeName)"
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
import SubNavItem from './components/SubNavItem.vue'
import SubNavItemEmpty from './components/SubNavItemEmpty.vue'
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
            subNav: state => state.constant.subNav,
            sessionSubNav: state => state.session.subNav
        }),
        category() {
            return this.$route.params.category
        },
        navList() {
            let list = []
            if (this.sessionSubNav && this.sessionSubNav[this.category]) {
                list = this.subNav[this.category].filter(item => this.sessionSubNav[this.category].includes(item.routeName))
            } else {
                list = this.subNav[this.category]
            }
            rowSupplement(list, this.rowSize)
            return divideArray(list, this.rowSize)
        }
    },
    created() {
        if (!this.category) {
            this.$router.replace({ name: 'Home' }).catch(err => err)
        }
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        onClick(routeName) {
            this.setSession([ 'redirect', routeName ])
            this.$router.push({ name: routeName }).catch(err => err)
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
