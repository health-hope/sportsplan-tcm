<template>
    <div class="step1">
        <!-- 心系证候类型 -->
        <div class="type">
            <BaseZyTempTitle bgClass="jgy_bg_5" :tempTitle="'以往运动习惯'"/>
            <div class="ctn">
                <LayBg/>
                <Cell
                    v-for="(item, i) in quesOptions"
                    :key="`ques${i}`"
                    class="tap_events"
                    @click.native="cellClick(i)"
                    :leftVal="item.questionContent"
                    :rightVal="item.rightVal?item.rightVal:'请选择'"
                />
            </div>
        </div>
        <!-- 选择类型dialog -->
        <div v-transfer-dom v-for="(item, i) in quesOptions" :key="`option${i}`">
            <x-dialog :hide-on-blur="true" v-model="item.showToast" class="dialog">
                <div class="single-c">
                    <LayBg/>
                    <Single class="tap_events" :single="item.options" @itemClick="itemClick"/>
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
    import Cell from '@/components/common/Cell';
    import Single from '@/components/common/SingleElection.vue'
    import { TransferDomDirective as TransferDom, XDialog } from 'vux'
    import { mapState, mapMutations } from 'vuex'
    import { apiSaveCourse } from '@/service/api'
    export default {
        data() {
            return {
                quesOptions: [],
                cellIndex: ''
            }
        },
        components: {
            LayBg,
            BaseZyTempTitle,
            Cell,
            XDialog,
            Single,
        },
        directives: {
            TransferDom
        },
        computed: {
            ...mapState(['userInfo', 'courseKind']),
            ...mapState('step', ['cofigOptions']),
            saveFlag() {
                return this.quesOptions.every((item) => {
                    return item.rightVal
                })
            },
        },
        created() {
            this.quesOptions = this.cofigOptions.quesOptions
        },
        methods: {
            ...mapMutations('step',['setStep3Data']),
            cellClick(index) {
                this.cellIndex = index
                this.$set(this.quesOptions[index], 'showToast', true)
                this.showToast = true;
            },
            // 类型点击
            itemClick(index) {
                this.quesOptions[this.cellIndex].options.map((item, i) => {
                    if (i == index) {
                        this.$set(this.quesOptions[this.cellIndex].options[i], 'check', true)
                        this.$set(this.quesOptions[this.cellIndex], 'rightVal', item.optionContent)
                    } else {
                        this.$set(this.quesOptions[this.cellIndex].options[i], 'check', false)
                    }
                })
                this.$set(this.quesOptions[this.cellIndex], 'showToast', false)
            },
            // 下一步接口 courseKind, userId, userOptions, evaluationId
            async saveCourse () {
                let userOptions = []
                this.quesOptions.map(item => {
                    item.options.map(ls => {
                        if(ls.check) {
                            userOptions.push({
                                "optionCodes": [ls.optionCode],
                                "questionClassify": item.questionClassify,
                                "questionCode": item.questionCode,
                            })
                        }
                    })
                })
                const data = await apiSaveCourse(this.courseKind, this.userInfo.userId, userOptions, this.cofigOptions.evaluationId)
                this.setStep3Data(data)
                this.$router.push('/step3')
            },
            // 保存按钮 
            saveClick() {
                if (this.saveFlag) {
                    this.saveCourse()
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/mixin.scss";
    .step1 {
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
                .sport {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .sp {
                        .img {
                            height: 4.2rem /* 168/40 */;
                            box-sizing: border-box;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            @include border2(0.025rem /* 1/40 */ solid);
                            font-size: 0;
                            .type {
                                width: 7.05rem /* 282/40 */;
                                height: 3.9rem /* 156/40 */;
                                font-size: 0;
                                border: 0;
                            }
                        }
                        .tips {
                            font-size: 0.75rem /* 30/40 */;
                            line-height: 1.05rem /* 42/40 */;
                            margin-top: 0.5rem /* 20/40 */;
                            color: #999999;
                        }
                        & + .sp {
                            margin-left: 0.45rem /* 18/40 */;
                        }
                    }
                    .sport-select {
                        .img {
                            @include border1(0.075rem /* 3/40 */ solid);
                            .img-c {
                                position: relative;
                                .icon {
                                    width: 1.25rem /* 50/40 */;
                                    height: 1.25rem /* 50/40 */;
                                    position: absolute;
                                    right: 0;
                                    top: 0;
                                }
                            }
                        }
                        .tips {
                            color: #333333;
                        }
                    }
                }
            }
        }
    }
    .dialog {
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
                width: 5.925rem /* 237/40 */;
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


