<template>
    <div v-if="show" class="home" :style="{ backgroundImage: `url(${ homeData.bgImageUrl })`}">
        <!-- 内容 -->
        <div class="ctn">
            <!-- 适合人群 -->
            <div class="ctn-top">
                <div class="title">
                    <span class="mon">{{ homeData.suitableCrowd.title }}</span>
                </div>
                <ul class="content">
                    <li class="item" v-for="(item, i) in homeData.suitableCrowd.contentList" :key="i">
                        <div class="img">
                            <img :src="item.iconUrl">
                        </div>
                        <div class="text">{{ item.desc }}</div>
                    </li>
                </ul>
            </div>
            <!-- 你将收获 -->
            <div class="ctn-top">
                <div class="title">
                    <span class="mon">{{ homeData.reward.title }}</span>
                </div>
                <ul class="content">
                    <li class="item" v-for="(item, i) in homeData.reward.contentList" :key="i">
                        <div class="img">
                            <img :src="item.iconUrl">
                        </div>
                        <div class="text">{{ item.desc }}</div>
                    </li>
                </ul>
            </div>
            <!-- bg 元素 -->
            <LayBg/>
        </div>
        <!-- 参考文献 -->
        <div class="reference-box">
            <LayBg bg1="bg_purple_top_left.png" bg2="bg_purple_upper_right.png" bg3="bg_purple_sit_down.png" bg4="bg_purple_bottom_right.png"/>
            <div class="reference-con">
                <div class="title">参考文献</div>
                <div class="reference-list">
                    <div class="item" v-for="(item,index) in homeData.references" :key="index">{{ item }}</div>
                </div>
            </div>
        </div>
        <!-- logo -->
        <div class="logo">
            <img :src="'sy_logo_jkyy.png' | PUBLIC_PATH" alt>
        </div>
        <p class="remark">北京健康有益科技有限公司提供技术服务</p>
        <!-- 开始测评 -->
        <div
            class="button tap_events"
            @click="start"
            :style="{backgroundImage: 'url(sy_button_bg.png)'}  | PUBLIC_PATH"
        >制定计划</div>
    </div>
</template>
<script>
    import { mapState, mapMutations } from 'vuex'
    import { getUrlParam } from '@/assets/js/util.js'
    import { apiHomeData } from '@/service/api'
    import LayBg from '@/components/common/LayBg';
    export default {
        data() {
            return {
                homeData: {},
                show: false
            }
        },
        components: {
            LayBg
        },
        computed: {
            ...mapState(['code', 'userInfo', 'courseKind']),
        },
        async created() {
            this.setCheck('no')
            // 先判断有没有计划在执行
            await this.getBrief()
        },
        methods: {
            ...mapMutations(['setCourse', 'setCheck']),
            async getBrief() {
                const data = await apiHomeData(this.code, this.courseKind, this.userInfo.userId)
                if(data.userCourseStatus == 1) {
                    // 用户有计划
                    this.setCourse(data.latestCourseInfo.courseId)
                    this.$router.replace('/plan')
                }else {
                    this.homeData = data
                    this.$nextTick(() => {
                        this.show = true
                    })
                }
            },
            start() {
                this.$router.push('/risk')
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/mixin.scss";
    .home {
        width: 100%;
        min-height: 100%;
        padding: 16.7rem 0.75rem 0;
        box-sizing: border-box;
        background-size: 100% auto;
        background-repeat: no-repeat;
        @include bg_color1();
        .ctn {
            @include bg_color6();
            @include box_shodow1(0 0.3rem 1rem 0);
            border-radius: 0.2rem;
            padding: 1.35rem 1.05rem 0.3rem;
            box-sizing: border-box;
            position: relative;
            .ctn-top {
                margin-bottom: 1.15rem;
                .title {
                    position: relative;
                    height: 1.4rem;
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.7rem;
                    .mon {
                        font-size: 0.85rem;
                        @include font_color4();
                        font-weight: bold;
                    }
                }
                .content {
                    position: relative;
                    .item {
                        margin-bottom: 0.5rem;
                    }
                    .img {
                        width: 1.2rem;
                        height: 1.2rem;
                        position: absolute;
                        left: 0;
                        right: 0;
                        img {
                            width: 100%;
                            height: 100%;
                            display: inline-block;
                            border-radius: 50%;
                        }
                    }
                    .text {
                        font-size: 0.75rem;
                        @include font_color5();
                        line-height: 1.2rem;
                        margin-left: 1.65rem;
                    }
                }
            }
        }
        .logo {
            margin-bottom: 0.5rem;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 4.3rem;
                height: auto;
            }
        }
        .reference-box {
            margin-top: 1.1rem;
            padding: 0.9rem 1.05rem;
            @include bg_color9();
            border-radius: 0.2rem;
            position: relative;
            .reference-con {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                .title {
                    font-size: 0.7rem;
                    @include font_color();
                    font-weight: bold;
                }
                .reference-list {
                    margin-top: 0.4rem;
                    .item {
                        display: flex;
                        justify-content: center;
                        font-size: 0.6rem;
                        @include font_color();
                        line-height: 0.825rem;
                        text-align: center;
                    }
                }
            }
        }
        .remark {
            opacity: 0.6;
            font-size: 0.55rem;
            line-height: 0.55rem;
            @include font_color();
            text-align: center;
            padding-bottom: 4.55rem /* 182/40 */;
            box-sizing: border-box;
        }
        .button {
            width: 15.5rem;
            height: 2.5rem;
            @include box_shodow(0 12px 30px 0);
            border-radius: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            @include font_color6();
            position: fixed;
            bottom: 1rem /* 40/40 */;
            left: 50%;
            transform: translateX(-50%);
            background-position: center center;
            @include bg_color();
            background-repeat: no-repeat;
            background-size: 15rem 2rem;
            font-weight: bold;
        }
    }
</style>
