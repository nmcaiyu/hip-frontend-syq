<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="价格查询" />
        <section class="main-section flex-grow flex-column">
            <el-table
                :data="lists[currentPage - 1]"
                class="table"
            >
                <el-table-column label="项目类型" prop="type" width="160" />
                <el-table-column label="项目名称" prop="shortName" />
                <el-table-column label="规格" prop="size" />
                <el-table-column label="单位" prop="unit" width="80" />
                <el-table-column label="单价(元)" prop="price" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.price | currency }}
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                layout="pager"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                hide-on-single-page
                @current-change="pageChange"
                class="pagination-wrapper flex flex-justify-center"
            />

            <button class="button" @click="launchKeyboard">输入</button>

            <el-drawer
                ref="drawer"
                :visible.sync="drawer"
                direction="btt"
                class="drawer"
                :show-close="false"
            >
                <el-form
                    ref="form"
                    class="form"
                    :model="formData"
                    :rules="formRules"
                    label-position="left"
                    label-width="140px"
                >
                    <!--
                    <el-form-item label="查询类型" prop="flag">
                        <el-radio v-model="formData.flag" :label="1">药品</el-radio>
                        <el-radio v-model="formData.flag" :label="0">诊疗项目</el-radio>
                    </el-form-item>
                    -->
                    <el-form-item label="项目简称" prop="name">
                        <el-input v-model="formData.name" />
                    </el-form-item>
                </el-form>
                <simple-keyboard
                    v-model="formData.name"
                    layout="alphabet"
                    @on-key-press="onKeyPress"
                />
            </el-drawer>
        </section>
        <nav-footer class="nav-footer" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import SimpleKeyboard from '@/components/SimpleKeyboard'
import { mapState, mapActions } from 'vuex'
import { getItemPrice } from '@/api'
import { divideArray, sleep } from '@/utils/helper'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        SimpleKeyboard
    },
    data() {
        return {
            drawer: false,
            pageSize: 5,
            currentPage: 1,
            lists: [],
            total: 0,
            formData: {
                flag: 1,
                name: null
            },
            formRules: {
                flag: [
                    { required: true, message: '请选择类型', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入项目简称', trigger: 'blur' },
                ]
            }
        }
    },
    computed: {
        ...mapState({
            patient: state => state.session.patient
        })
    },
    mounted() {
        this.$refs.drawer.$el.getElementsByClassName('el-drawer').item(0).style.height = '360px'
    },
    methods: {
        ...mapActions({
            startLoading: 'session/startLoading',
            stopLoading: 'session/stopLoading',
            resetTimer: 'session/resetTimer',
            startTimer: 'session/startTimer'
        }),
        async fetchData() {
            this.resetTimer(this.start).then(() => {
                this.startTimer()
            })

            this.startLoading({ text: '正在查询' })
            await sleep(1)

            const params = {
                ...this.formData
            }
            getItemPrice(params).then(result => {
                this.stopLoading()
                if (result && result.length > 0) {
                    this.lists = divideArray(result, this.pageSize)
                    this.total = result.length
                }
            }).catch(error => {
                this.stopLoading()
                this.handleError(error)
            })
        },
        handleError(error) {
            if (error.code && error.code === 1) {
                this.$alert(error.msg, '提示', {
                    confirmButtonText: '确定',
                    showClose: false
                }).then(() => {
                    this.$router.push({ name: 'Home' }).catch(err=>err)
                })
            }
        },
        pageChange(page) {
            this.currentPage = page
        },
        launchKeyboard() {
            this.drawer = true
        },
        async onKeyPress(button) {
            if (button === '{enter}') {
                let isValid = false
                await this.$refs.form.validate(valid => isValid = valid)

                if (isValid) {
                    this.drawer = false
                    this.fetchData()
                }
            } else if (button === '{escape}') {
                this.drawer = false
            } else {
                this.$refs.form.clearValidate()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.table {
    width: 100%;
}
.button {
    border: none;
    border-radius: 10px;
    background-color: #3A8FFF;
    color: #FFFFFF;
    padding: 20px 20px;
    cursor: pointer;
    font-size: 35px;
    margin-bottom: 40px;
}
.pagination-wrapper {
    padding-bottom: 60px;
}
.form {
    padding: 0 10px;
}
.form ::v-deep {
    .el-form-item__label {
        font-size: 28px;
    }
    .el-radio__inner {
        width: 24px;
        height: 24px;
    }
    .el-radio__label {
        font-size: 24px;
    }
    .el-input {
        font-size: 24px;
    }
    .el-form-item {
        margin-bottom: 28px;
    }
    .el-form-item__error {
        font-size: 20px;
    }
    .el-radio, .el-radio__input {
        line-height: 1.9;
    }
}
</style>
