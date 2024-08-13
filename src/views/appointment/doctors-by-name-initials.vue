<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="按医生姓名挂号" />
        <section class="main-section flex-grow flex-column">
            <div
                v-if="pageableDoctorList && pageableDoctorList.total > 0"
                class="doctor-list-container flex-grow flex-column"
            >
                <doctor-item
                    v-for="(d, i) in pageableDoctorList.pages[currentPage - 1]"
                    :key="i"
                    :doctor="d"
                />
            </div>
            <el-pagination
                v-if="pageableDoctorList && pageableDoctorList.total > 0"
                background
                layout="pager"
                :total="pageableDoctorList.total"
                :page-size="pageSize"
                hide-on-single-page
                @current-change="pageChange"
                class="doctor-pagination flex flex-justify-center"
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
                    <el-form-item label="姓名缩写" prop="nameInitials">
                        <el-input v-model="formData.nameInitials" />
                    </el-form-item>
                </el-form>
                <simple-keyboard
                    v-model="formData.nameInitials"
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
import DoctorItem from './components/DoctorItem.vue'
import SimpleKeyboard from '@/components/SimpleKeyboard'
import { mapMutations, mapActions } from 'vuex'
import { getDoctorsByNameInitials } from '@/api'
import { divideArray } from '@/utils/helper'
import { sleep } from '@/utils/helper'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        DoctorItem,
        SimpleKeyboard
    },
    data() {
        return {
            pageSize: 3,
            pageableDoctorList: null,
            currentPage: 1,
            bookType: null,
            drawer: false,
            formData: {
                nameInitials: null
            },
            formRules: {
                nameInitials: [
                    { required: true, message: '请输入拼音首字母', trigger: 'blur' },
                ]
            }
        }
    },
    created() {
        this.bookType = this.$route.name.includes('Today') ? 1 : 2
    },
    mounted() {
        this.$refs.drawer.$el.getElementsByClassName('el-drawer').item(0).style.height = '360px'
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        ...mapActions({
            startLoading: 'session/startLoading',
            stopLoading: 'session/stopLoading'
        }),
        launchKeyboard() {
            this.drawer = true
        },
        pageChange(page) {
            this.currentPage = page
        },
        onKeyPress(button) {
            if (button === '{enter}') {
                let isValid = false
                this.$refs.form.validate(valid => isValid = valid)

                if (isValid) {
                    this.drawer = false
                    this.startLoading({ text: '正在查询' })


                    const params = {
                        bookType: this.bookType,
                        initials: this.formData.nameInitials
                    }
                    getDoctorsByNameInitials(params).then(result => {
                        this.stopLoading()
                        if (result && result.length > 0) {
                            this.pageableDoctorList = {
                                total: result.length,
                                pages: divideArray(result, this.pageSize)
                            }
                        }
                    })
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
.doctor-list-container {
    row-gap: 40px;
}
.doctor-pagination {
    padding-bottom: 30px;
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
