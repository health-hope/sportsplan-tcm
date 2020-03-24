<template>
    <div class="conditioning">
        <div v-if="dayPlans.length">
            <div class="plan-c">
            <SportTitle :tempData="tempData"/>
            <div class="programme">
                <div class="p_ctn">
                    <LayBg/>
                    <Calendar :nursePlanList="dayPlans" @planDateClick="planDateClick"/>
                    <ul class="detail">
                        <template v-if="!dayPlans[dateVal].rest">
                            <li :style="{ backgroundImage: `url(${item.moduleImageUrl})` }" class="dayPlans tap_events" @click="cardDetail(item, dayPlans[dateVal].courseSeq)" v-for="(item, i) in dayPlans[dateVal].moduleList" :key="`date${i}`">
                                <div>
                                    <div class="tis1">{{ item.moduleName }} {{ item.videoMinute }}分钟</div>
                                    <div class="tis2">{{ item.moduleIntro }}</div>
                                </div>
                                <template v-if="HealthHopeJsBridge">
                                    <!-- app 端逻辑 -->
                                    <div class="app-tis3100" v-if="item.completionRate=='100'">
                                        <countup :end-val="item.completionRate" :duration="1" :start="true">{{ item.completionRate }}</countup>%
                                    </div>
                                    <div class="tis3" v-else-if="item.lock != 1">未解锁</div>
                                    <template v-else>
                                        <div class="app-tis3"><countup :end-val="item.completionRate" :duration="1" :start="true">{{ item.completionRate }}</countup>%</div>
                                        <div class="app-progress">
                                            <div :style="{ width: `${item.completionRate}%` }" class="bar"></div>
                                        </div>
                                    </template>
                                </template>
                                <template v-else>
                                    <div class="tis3" v-if="item.lock != 1">未解锁</div>
                                    <div :class="item.finish?'tis4 tis4-f':'tis4'" v-else>{{ item.finish?'已完成':'待完成' }}</div>
                                </template>
                            </li>
                        </template>
                        <template v-else>
                            <li class="xiuxi-c">
                                <img class="imgXX" :src="restInfo.restImageUrl">
                                <div class="xiuxi" v-for="(item, i) in restInfo.desc" :key="`rest${i}`">{{ item }}</div>
                            </li>
                        </template>
                    </ul>
                    <!-- 查看课程表 -->
                    <div class="class-list">
                        <div class="seeBtn">
                            <div class="seeBtn_b" :style="{ backgroundImage: 'url(btn_bg_white_classschedule.png)' } | PUBLIC_PATH">查看课程表</div>
                            <!-- 解决ios 变宽显示不完整 -->
                            <div @click="seeBtnClick" class="seeBtnBorder tap_events"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ctn4">
            <LayBg/>
            <template v-if="prompt && prompt.contents">
                <BaseTitle style="margin-left: .25rem" :img="'ic_exerciseplan_prompt.png'" :title="prompt.title"/>
                <div class="list3-bto-c11">
                    <div class="list3-bto-c1">
                        <p class="ctx" v-for="(item, i) in prompt.contents" :key="`tabooCrowd${i}`">
                            <img class="icon1" :src="'tlfa_icon_zysx1.png' | PUBLIC_PATH">
                            {{ item }}
                        </p>
                    </div>
                </div>
            </template>
            <div class="list3-bto">
                <div class="list3-bto-c">
                    <div class="list3-bto-tit">注意事项</div>
                    <p class="ctx" v-for="(item, i) in attentions" :key="`attentions${i}`">
                        <img class="icon1" :src="'tlfa_icon_zysx1.png' | PUBLIC_PATH">
                        {{ item }}
                    </p>
                </div>
            </div>
        </div>
        <!-- 调整计划 -->
        <div
            @click="changePlan"
            class="plan_btn tap_events"
            :style="{ backgroundImage: 'url(btn_bg_white_again.png)' } | PUBLIC_PATH"
        >调整计划</div>
        </div>
        
    </div>
</template>
<script>
    import Calendar from '@/components/common/Calendar.vue'
    import LayBg from "@/components/common/LayBg"
    import SportTitle from "@/components/common/SportTitle.vue"
    import BaseTitle from '@/components/common/BaseTitle.vue'
    import { Countup } from 'vux'
    import { mapState, mapMutations } from 'vuex'
    import { apiGetPlan } from '@/service/api'
    export default {
        data() {
            return {
                dateVal: 0,
                tempData: {},
                dayPlans: [],
                prompt: {},
                attentions: [],
                restInfo: {},
                HealthHopeJsBridge: null
            }
        },
        components: {
            LayBg,
            Calendar,
            SportTitle,
            BaseTitle,
            Countup
        },
        computed: {
            ...mapState(['code', 'userInfo', 'course']),
        },
        created() {
            // userId, courseId
            this.getPlan()
            this.HealthHopeJsBridge = window.HealthHopeJsBridge
        },
        methods: {
            ...mapMutations(['setListObj', 'setStartTime']),
            async getPlan() {
                const data = await apiGetPlan(this.userInfo.userId, this.course)
                if(data.exerciseStatus == 2) {
                    // 运动计划结束
                    this.$router.replace('/')
                }else {
                    this.tempData = {
                        courseName: data.courseName,
                        currentCourseSeq: data.currentCourseSeq,
                        weekCount: data.weekCount,
                        beginDate: data.beginDate,
                        weeklyExerciseDays: data.weeklyExerciseDays,
                        bgImageUrl: data.bgImageUrl,
                        exerciseStatus: data.exerciseStatus,
                        courseNotStartInfo: data.courseNotStartInfo
                    }
                    this.dayPlans = data.dayPlans
                    this.prompt = data.prompt
                    this.attentions = data.attentions
                    this.restInfo = data.restInfo
                    this.recordDate = data.recordDate
                }
            },
            // 点击日期
            planDateClick(val) {
                this.dateVal = val
            },
            // 调整计划
            async changePlan() {
                this.$router.push('/step1')
            },
            // 点击课程
            cardDetail(val, val1) {
                if(this.HealthHopeJsBridge) {
                    // app 逻辑
                    this.HealthHopeJsBridge.startCourseDetailPage(this.course, val1, val.moduleId, val.moduleType);
                }else {
                    if(val.lock == 1) {
                        const list = {
                            courseId: this.course,
                            courseSeq: val1,
                            moduleId: val.moduleId,
                            moduleType: val.moduleType,
                            recordDate: this.recordDate
                        }
                        this.setListObj(list)
                        // 记录起始时间
                        this.setStartTime((new Date()).valueOf())
                        this.$router.push('/detail')
                    }else {
                        // 未解锁
                        this.$toast('到当天才能解锁运动计划课程哦~')
                    }
                }
            },
            // 查看课表
            seeBtnClick() {
                this.$router.push('/timetable')
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/mixin.scss";
    .conditioning {
        min-height: 100%;
        padding: 0.8rem 0.75rem 1rem /* 40/40 */;
        @include bg_color1();
        box-sizing: border-box;
        .plan-c {
            @include box_shodow1(0 .3rem /* 12/40 */ 1rem /* 40/40 */ 0);
            border-radius: 0.2rem;
            overflow: hidden;
            .programme {
                .p_ctn {
                    padding: 1.4rem /* 56/40 */ 0rem /* 42/40 */ 1.5rem /* 60/40 */;
                    background: #fff;
                    box-sizing: border-box;
                    position: relative;
                    .p_top {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 1.4rem /* 56/40 */;
                        padding: 0 1.05rem;
                        box-sizing: border-box;
                        .item {
                            width: 4.75rem /* 190/40 */;
                            height: 5.05rem /* 202/40 */;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            padding-left: 0.6rem /* 24/40 */;
                            box-sizing: border-box;
                            &::before {
                                @include border_color2();
                            }
                            .tip {
                                @include font_color9();
                                font-size: 0.7rem /* 28/40 */;
                                line-height: 1rem /* 40/40 */;
                                margin-bottom: 0.4rem /* 16/40 */;
                            }
                            .ctt {
                                font-size: 0.9rem /* 36/40 */;
                                line-height: 1.25rem /* 50/40 */;
                                @include font_color4();
                                font-weight: bold;
                                .conts {
                                    @include font_color10();
                                }
                            }
                        }
                        .item1 {
                            width: 9.95rem /* 398/40 */;
                            padding-right: 3.95rem /* 158/40 */;
                            box-sizing: border-box;
                        }
                    }
                    .detail {
                        margin-top: 1.4rem /* 56/40 */;
                        padding: 0 1.05rem;
                        box-sizing: border-box;
                        li + li {
                            margin-top: 0.5rem /* 20/40 */;
                        }
                        .dayPlans {
                            width: 100%;
                            height: 6.575rem /* 263/40 */;
                            border-radius: .1rem /* 4/40 */;
                            background-size: 100% 100%;
                            padding: .8rem /* 32/40 */;
                            box-sizing: border-box;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            position: relative;
                            overflow: hidden;
                            &::before {
                                content: '';
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                left: 0;
                                top: 0;
                                border-radius: .1rem /* 4/40 */;
                                background-color: rgba(0,0,0,0.3);
                            }
                            .tis1 {
                                font-size: .85rem /* 34/40 */;
                                line-height: 1.2rem /* 48/40 */;
                                color: #FFFFFF;
                                font-weight: bold;
                                z-index: 222;
                                position: relative;
                            }
                            .tis2 {
                                font-size: .6rem /* 24/40 */;
                                line-height: .825rem /* 33/40 */;
                                color: rgba(255,255,255,0.80);
                                margin-top: .2rem /* 8/40 */;
                                z-index: 222;
                                position: relative;
                            }
                            .tis3, .tis4 {
                                width: 2.1rem /* 84/40 */;
                                height: 0.83rem /* 32/40 */;
                                background: rgba(255,255,255,0.10);
                                border-radius: .55rem /* 22/40 */;
                                font-size: .5rem /* 20/40 */;
                                color: rgba(255,255,255,0.80);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                z-index: 222;
                                position: relative;
                                font-weight: bold;
                            }
                            .tis4-f {
                                @include bg-color();
                                color: #fff;
                            }
                            .app-tis3 {
                                width: 2.1rem /* 84/40 */;
                                height: .8rem /* 32/40 */;
                                background: rgba(0,0,0,0.30);
                                border-radius: .55rem /* 22/40 */;
                                font-size: .5rem /* 20/40 */;
                                line-height: .825rem /* 33/40 */;
                                color: rgba(255,255,255,0.80);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                z-index: 222;
                                position: relative;
                            }
                            .app-tis3100 {
                                width: 2.1rem /* 84/40 */;
                                height: .8rem /* 32/40 */;
                                @include bg-color();
                                border-radius: .55rem /* 22/40 */;
                                font-size: .5rem /* 20/40 */;
                                line-height: .825rem /* 33/40 */;
                                color: rgba(255,255,255,0.80);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 1s;
                                z-index: 222;
                                position: relative;
                            }
                            .app-progress {
                                width: 100%;
                                height: .2rem /* 8/40 */;
                                border-radius: .1rem /* 4/40 */;
                                background: rgba(255, 255, 255, .1);
                                z-index: 222;
                                position: relative;
                                .bar {
                                    @include bg-color();
                                    height: 100%;
                                    border-radius: .1rem /* 4/40 */;
                                    transition: all 1s;
                                }
                            }
                        }
                        .xiuxi-c {
                            padding: 0 1.475rem /* 59/40 */;
                            box-sizing: border-box;
                            display: flex;
                            align-items: center;
                            flex-direction: column;
                            .imgXX {
                                width: 10.25rem /* 410/40 */;
                                height: 6.25rem /* 250/40 */;
                                margin: 0 auto 1.15rem /* 46/40 */;
                            }
                            .xiuxi {
                                font-size: 0.7rem /* 28/40 */;
                                line-height: 1rem /* 40/40 */;
                                color: #999999;
                                text-align: center;
                            }
                        }
                    }
                    .class-list {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        margin-top: 1.7rem /* 68/40 */;
                        .seeBtn {
                            position: relative;
                            background-color: transparent;
                            width: 9.85rem /* 394/40 */;
                            height: 2.4rem /* 96/40 */;
                            font-size: .9rem /* 36/40 */;
                            @include font_color10();
                            font-weight: bold;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-sizing: border-box;
                            .seeBtn_b {
                                width: 9.3275rem /* 373.1/40 */;
                                height: 1.9rem /* 76/40 */;
                                font-size: .9rem /* 36/40 */;
                                @include font_color10();
                                font-weight: bold;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-sizing: border-box;
                                background-size: 100% 100%;
                                background-repeat: no-repeat;
                                background-position: center center;
                                background-color: transparent;
                            }
                            .seeBtnBorder {
                                position: absolute;
                                z-index: 222;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                @include border2(1.1px solid);
                                border-radius: 2.5rem /* 100/40 */;
                            }
                        }
                    }
                }
            }
        }
        .ctn4 {
            @include box_shodow1(0 0.3rem /* 12/40 */ 1rem /* 40/40 */ 0);
            border-radius: 0.2rem /* 8/40 */;
            overflow: hidden;
            position: relative;
            background: #fff;
            padding: 1.4rem /* 56/40 */ 0.8rem /* 32/40 */;
            box-sizing: border-box;
            margin-top: 0.8rem /* 32/40 */;
            .list3-bto {
                width: 100%;
                @include bg_color9();
                padding: 0.25rem /* 10/40 */;
                box-sizing: border-box;
                .list3-bto-c {
                    padding: 0.55rem /* 22/40 */ 0.35rem /* 14/40 */;
                    @include border2(1px solid);
                    box-sizing: border-box;
                    .list3-bto-tit {
                        font-size: 0.8rem /* 32/40 */;
                        line-height: 1.125rem /* 45/40 */;
                        @include font_color1();
                        font-weight: bold;
                    }
                    .ctx {
                        font-size: 0.7rem /* 28/40 */;
                        @include font_color5();
                        line-height: 1.1rem /* 44/40 */;
                        margin-top: 0.4rem /* 16/40 */;
                        margin-left: 0.95rem /* 38/40 */;
                        position: relative;
                        .icon1 {
                            width: 0.45rem /* 18/40 */;
                            height: 0.45rem /* 18/40 */;
                            display: inline-block;
                            position: absolute;
                            top: 0.272rem;
                            left: -0.95rem;
                        }
                    }
                }
            }
            .list3-bto-c11 {
                padding: 0 0.25rem /* 10/40 */;
                box-sizing: border-box;
                margin-bottom: 1.4rem /* 56/40 */;
                .list3-bto-c1 {
                    padding: 0.4rem /* 22/40 */ 0.35rem /* 14/40 */ .8rem /* 32/40 */;
                    @include border2(1px solid);
                    box-sizing: border-box;
                    &::before {
                        @include border_color2();
                    }
                    .list3-bto-tit {
                        font-size: 0.8rem /* 32/40 */;
                        line-height: 1.125rem /* 45/40 */;
                        @include font_color1();
                        font-weight: bold;
                    }
                    .ctx {
                        font-size: 0.7rem /* 28/40 */;
                        @include font_color5();
                        line-height: 1.1rem /* 44/40 */;
                        margin-top: 0.4rem /* 16/40 */;
                        margin-left: 0.95rem /* 38/40 */;
                        position: relative;
                        .icon1 {
                            width: 0.45rem /* 18/40 */;
                            height: 0.45rem /* 18/40 */;
                            display: inline-block;
                            position: absolute;
                            top: 0.299rem;
                            left: -0.95rem;
                        }
                    }
                }
            }
        }
        .plan_btn {
            width: 6.5rem /* 260/40 */;
            height: 2.5rem /* 100/40 */;
            margin: 1.1rem /* 44/40 */ auto 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            @include box_shodow3(0 0.3rem /* 12/40 */ 0.75rem /* 30/40 */ 0);
            border-radius: 1.25rem /* 50/40 */;
            @include font_color1();
            font-size: 0.9rem;
            font-weight: bold;
            background-repeat: no-repeat;
            background-size: 5.9775rem /* 239.1/40 */ 2.025rem /* 81/40 */;
            background-position: center center;
        }
    }
</style>