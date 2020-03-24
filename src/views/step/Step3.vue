<template>
    <div class="step3">
        <!-- 心系证候类型 -->
        <div class="type">
            <BaseZyTempTitle bgClass="jgy_bg_5" :tempTitle="'以往运动习惯'"/>
            <div class="ctn">
                <LayBg/>
                <Cell
                    class="tap_events"
                    @click.native="cellClick('1')"
                    :leftVal="'每周训练日'"
                    :rightVal="rightVal1"
                />
                <Cell
                    class="tap_events"
                    @click.native="cellClick('2')"
                    :leftVal="'计划开始日期'"
                    :rightVal="rightVal2"
                />
            </div>
        </div>
        <!-- 调理日dialog -->
        <div v-transfer-dom>
            <x-dialog :hide-on-blur="true" v-model="showToast1" class="dialog1">
                <div class="multiple-c">
                    <LayBg/>
                    <Multiple
                        @multipleClick="multipleClick"
                        @multipleSure="multipleSure"
                        :multiple="multiple"
                        :counts="counts"
                    />
                    <div class="multipleIcon">请选择{{ counts }}天训练日</div>
                </div>
            </x-dialog>
        </div>
        <!-- 选择调理日期dialog -->
        <div v-transfer-dom>
            <x-dialog :hide-on-blur="true" v-model="showToast2" class="dialog2">
                <div class="dataTime-c">
                    <LayBg/>
                    <datetime-view
                        class="datetime"
                        :startDate="startDate"
                        :endDate="endDate"
                        v-model="datetime"
                        ref="datetime"
                        :format="format"
                    ></datetime-view>
                    <div
                        class="btn111 tap_events"
                        :style="{backgroundImage: 'url(btn_bg_Evaluation_yellow_activation.png)'} | PUBLIC_PATH"
                        @click="dateTimeSure"
                    >确定</div>
                </div>
            </x-dialog>
        </div>
        <div
            @click="saveClick"
            :class="saveFlag?'save tap_events':'save saveSelect tap_events'"
            :style="{backgroundImage: saveFlag?'url(btn_bg_condition_yellow_program.png)':'url(btn_bg_condition_yellow_program_enabled.png)'} | PUBLIC_PATH"
        >下一步</div>
    </div>
</template>
<script>
    import LayBg from '@/components/common/LayBg';
    import BaseZyTempTitle from '@/components/common/BaseZyTempTitle';
    import Multiple from '@/components/common/MultipleSelection.vue'
    import Cell from '@/components/common/Cell';
    import { TransferDomDirective as TransferDom, XDialog, DatetimeView, Picker } from 'vux'
    import { mapState, mapMutations } from 'vuex'
    import { apiSavePlan, apiSetPlan } from '@/service/api'
    export default {
        data() {
            return {
                counts: '',
                rightVal1: '请选择',
                rightVal2: '请选择',
                showToast1: false,
                showToast2: false,
                format: 'YYYY-MM-DD',
                datetime: '',
                startDate: '',
                endDate: '',
                multiple: [{ name: "周一", id: "1" }, { name: "周二", id: "2" }, { name: "周三", id: "3" }, { name: "周四", id: "4" }, { name: "周五", id: "5" }, { name: "周六", id: "6" }, { name: "周日", id: "7" }],
                weeklyExerciseDays: []
            }
        },
        components: {
            LayBg,
            BaseZyTempTitle,
            Cell,
            XDialog,
            Multiple,
            DatetimeView,
            Picker
        },
        directives: {
            TransferDom
        },
        computed: {
            ...mapState(['userInfo', 'courseKind', 'course']),
            ...mapState('step', ['cofigOptions', 'step3Data']),
            saveFlag() {
                let val = '请选择'
                if(this.rightVal1.indexOf(val) < 0 && this.rightVal2.indexOf(val) < 0){
                    return true
                }else {
                    return false
                }
            },
        },
        created() {
            this.startDate = this.step3Data.beginDateStart
            this.endDate = this.step3Data.beginDateEnd
            this.counts = this.step3Data.weeklyExerciseFrequencies[0].weeklyExerciseDayCount
        },
        methods: {
            ...mapMutations('step',['setStep3Data']),
            ...mapMutations(['setCourse', 'setCheck']),
            cellClick(val) {
                if (val == 1) {
                    // 每周调理日回显示
                    this.multiple = [{ name: "周一", id: "1" }, { name: "周二", id: "2" }, { name: "周三", id: "3" }, { name: "周四", id: "4" }, { name: "周五", id: "5" }, { name: "周六", id: "6" }, { name: "周日", id: "7" }]
                    if (this.weeklyExerciseDays.length) {
                        this.multiple.forEach((item, i) => {
                            this.weeklyExerciseDays.forEach(ele => {
                                if (item.id == ele) {
                                    this.$set(this.multiple[i], 'check', true)
                                }
                            })
                        })
                    }
                }
                if(val == 2) {
                    if(this.rightVal2.indexOf('-') >= 0) {
                        this.datetime = this.rightVal2
                        this.$refs.datetime.render()
                    }else {
                        this.datetime = this.startDate
                        this.$refs.datetime.render()
                    }
                }
                this[`showToast${val}`] = true;
            },
            // 多选点击
            multipleClick(index) {
                this.$set(this.multiple[index], 'check', !this.multiple[index].check)
            },
            // 多选点击确定
            multipleSure(val, arr) {
                this.rightVal1 = val
                this.showToast1 = false
                this.weeklyExerciseDays = arr
            },
            dateTimeSure() {
                if(!this.datetime) this.datetime = this.startDate
                this.rightVal2 = this.datetime
                this.showToast2 = false
            },
            // 下一步接口 courseKind, userId, evaluationId, beginDate, weeklyExerciseDays, weekCount
            async savePlan () {
                const data = await apiSavePlan(this.courseKind, this.userInfo.userId, this.cofigOptions.evaluationId, this.rightVal2.replace(/\-/g,''), this.weeklyExerciseDays, this.step3Data.weekCountOptions[0].weekCount)
                this.setCourse(data.courseId)
                // 清空日历选中的记录
                this.setCheck('no')
                this.$router.replace('/plan')
            },
            // 保存按钮 
            async saveClick() {
                if (this.saveFlag) {
                    // 先退出计划 userId courseKind exitWay
                    const data = await apiSetPlan(this.userInfo.userId, this.courseKind, 2)
                    this.savePlan()
                }
            }
        }
    }
</script>
<style lang="scss">
    .datetime .dp-item:nth-child(1) .scroller-indicator::after {
        content: "年";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        height: 34px;
        line-height: 34px;
        color: #999999;
        margin-left: 30px;
    }
    .datetime .dp-item:nth-child(2) .scroller-indicator::after {
        content: "月";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        height: 34px;
        line-height: 34px;
        color: #999999;
        margin-left: 20px;
    }
    .datetime .dp-item:nth-child(3) .scroller-indicator::after {
        content: "日";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        height: 34px;
        line-height: 34px;
        color: #999999;
        margin-left: 20px;
    }
</style>
<style lang="scss" scoped>
    @import "@/assets/style/mixin.scss";
    .step3 {
        width: 100%;
        min-height: 100%;
        padding: 0.8rem /* 32/40 */ 0.75rem /* 30/40 */ 4.6rem /* 184/40 */;
        box-sizing: border-box;
        @include bg_color1();
        .type {
            @include bg_color6();
            @include box_shodow1(0 0.3rem /* 12/40 */ 1rem /* 40/40 */ 0);
            border-radius: 0.2rem /* 8/40 */;
            & + .type {
                margin-top: 0.8rem /* 32/40 */;
            }
            .ctn {
                position: relative;
                padding: 1.3rem /* 52/40 */ 1.05rem /* 42/40 */;
                box-sizing: border-box;
            }
        }
    }
    .dialog1,
    .dialog2 {
        /deep/ .weui-dialog {
            width: 17.25rem /* 690/40 */;
            max-width: 100%;
            border-radius: 0.2rem /* 8/40 */;
            overflow: auto;
        }
        .single-c,
        .dataTime-c,
        .multiple-c {
            padding: 1rem /* 40/40 */ 1.05rem /* 42/40 */;
            box-sizing: border-box;
            position: relative;
            .multipleIcon {
                position: absolute;
                left: -0.75rem /* 30/40 */;
                top: -1.2rem /* 48/40 */;
                width: 7.2rem;
                height: 1.7rem /* 68/40 */;
                @include bg_color();
                @include box_shodow2(0 0.3rem 0.75rem 0);
                border-radius: 0 0.85rem 0.85rem 0;
                font-size: 0.7rem /* 28/40 */;
                @include font_color6();
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                z-index: 99999999;
            }
            .gender {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 12.925rem /* 517/40 */;
                margin: 1.125rem /* 69/40 */ auto;
                .g1 {
                    width: 5rem /* 200/40 */;
                    height: 5rem /* 200/40 */;
                    box-sizing: border-box;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        width: 4.5rem /* 180/40 */;
                        height: 4.5rem /* 180/40 */;
                        border-radius: 50%;
                    }
                }
                .check {
                    @include border1(0.15rem solid);
                }
            }
        }
    }
    .save {
        width: 10.25rem /* 410/40 */;
        height: 2.5rem /* 100/40 */;
        @include bg_color();
        @include box_shodow(0 0.3rem /* 12/40 */ 0.75rem /* 30/40 */ 0);
        border-radius: 1.25rem /* 50/40 */;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 1rem /* 40/40 */;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 9.7275rem /* 389.1/40 */ 2rem /* 80/40 */;
    }
    .saveSelect {
        @include bg_color8();
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 9.7275rem /* 389.1/40 */ 2rem;
    }
    .btn111 {
        width: 100%;
        height: 2.4rem;
        @include box_shodow2(0 0.3rem 0.75rem 0);
        border-radius: 1.25rem;
        font-size: 0.9rem;
        @include font_color6();
        @include bg_color();
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 14.6275rem 1.9rem;
        margin: auto;
        margin-top: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
</style>