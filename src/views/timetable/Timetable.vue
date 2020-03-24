<template>
    <div class="timeTable" v-if="dayPlans.length">
        <div class="ctn">
            <LayBg/>
            <ul>
                <li v-for="(item, i) in dayPlans" :key="`li${i}`">
                    <template v-if="!item.rest">
                        <div
                            class="tit vux-1px"
                            v-for="(item1, i1) in item.moduleList"
                            :key="`module${i1}`"
                            @click="listClick(item1, item.courseSeq)"
                        >
                            <div class="tit1"><span class="date">{{ item.exerciseDate | datefilter }}</span>星期{{ item.weekInfo }}</div>
                            <div class="tit2">
                                <div class="tit2-1">
                                    <img
                                        v-if="!item1.finish"
                                        :src="'img_exerciseplan_checkmark_enabled.png' | PUBLIC_PATH"
                                    >
                                    <img
                                        v-else
                                        :src="'img_exerciseplan_checkmark_activation.png' | PUBLIC_PATH"
                                    >
                                    <div class="w380">{{ item1.moduleName }}</div>
                                </div>
                                <div class="tit2-2" v-if="!item.rest">{{ item1.videoMinute }}分钟</div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="tit vux-1px">
                            <div class="tit1"><span class="date">{{ item.exerciseDate | datefilter }}</span>星期{{ item.weekInfo }}</div>
                            <div class="tit2">
                                <div class="tit2-1">
                                    <img :src="'img_exerciseplan_offday.png' | PUBLIC_PATH">
                                    <div>休息日</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import LayBg from '@/components/common/LayBg';
    import { mapState, mapMutations } from 'vuex'
    import { apiGetPlan } from '@/service/api'
    export default {
        data() {
            return {
                dayPlans: [],
                HealthHopeJsBridge: null
            }
        },
        components: {
            LayBg,
        },
        computed: {
            ...mapState(['code', 'userInfo', 'course']),
        },
        filters: {
            datefilter(val) {
                return `${Number(val.substr(4,2))}月${Number(val.substr(6,2))}日`
            }
        },
        created() {
            this.getPlan()
            this.HealthHopeJsBridge = window.HealthHopeJsBridge
        },
        methods: {
            ...mapMutations(['setListObj', 'setStartTime']),
            async getPlan() {
                const data = await apiGetPlan(this.userInfo.userId, this.course)
                this.dayPlans = data.dayPlans
            },
            listClick(val, val1) {
                if(this.HealthHopeJsBridge && this.HealthHopeJsBridge.isHealthApp()) {
                    // app 逻辑
                    this.HealthHopeJsBridge.startCourseDetailPage(this.course, val1, val.moduleId, val.moduleType);
                }else {
                    if(val.lock == 1) {
                        const list = {
                            courseId: this.course,
                            courseSeq: val1,
                            moduleId: val.moduleId,
                            moduleType: val.moduleType,
                        }
                        this.setListObj(list)
                        // 记录起始时间
                        this.setStartTime((new Date()).valueOf())
                        this.$router.push('/detail')
                    }else {
                        this.$toast('到当天才能解锁运动计划课程哦~')
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/mixin.scss";
    .timeTable {
        min-height: 100%;
        padding: 0.8rem 0.75rem 1rem /* 40/40 */;
        @include bg_color1();
        box-sizing: border-box;
        .ctn {
            padding: 1.4rem /* 56/40 */ 1.05rem /* 42/40 */ .7rem /* 28/40 */;
            box-sizing: border-box;
            background: #FFFFFF;
            box-shadow: 0 .3rem /* 12/40 */ 1rem /* 40/40 */ 0 rgba(211,170,160,0.10);
            border-radius: .2rem /* 8/40 */;
            position: relative;
            ul {
                .tit {
                   padding: .8rem /* 32/40 */ .65rem /* 26/40 */;
                   box-sizing: border-box;
                   margin-bottom: .7rem /* 28/40 */;
                   &::before {
                       @include border_color2();
                   }
                   .tit1 {
                        font-size: .7rem /* 28/40 */;
                        color: #999999;
                        height: 1rem /* 40/40 */;
                        margin-bottom: .3rem /* 12/40 */;
                        .date {
                            margin-right: .3rem /* 12/40 */;
                        }
                    }
                    .tit2 {
                        display: flex;
                        justify-content: space-between;
                        .tit2-1 {
                            font-size: .8rem /* 32/40 */;
                            color: #333333;
                            font-weight: bold;
                            display: flex;
                            img {
                                width: .85rem /* 34/40 */;
                                height: .86rem /* 34/40 */;
                                margin-right: .4rem /* 16/40 */;
                                margin-top: .1rem;
                            }
                            .w380 {
                                width: 9.5rem /* 380/40 */;
                                word-break: break-all;
                            }
                        }
                        .tit2-2 {
                            font-size: .65rem /* 26/40 */;
                            @include font_color();
                            margin-top: .05rem;
                        }
                    }
                }
            }
        }
    }
</style>