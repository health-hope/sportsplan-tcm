<template>
    <div class="detail" v-if="executeList.dataList && executeList.dataList.length">
        <div class="ctn">
            <LayBg/>
            <ul>
                <li class="vux-1px" v-for="(item, i) in executeList.dataList" :key="`li${item.actionId}`">
                    <div class="title">
                        <div class="left">{{ (Number(i) + 1) + (pageRequest.pageNum-1) * pageRequest.pageSize  }}、{{ item.actionName }}</div>
                        <div class="right" v-if="item.actionUnit=='TIMES'">{{ item.followSecond }}秒 / {{ item.exerciseCount }}次</div>
                        <div class="right" v-else>{{ item.followSecond }}秒 / 1次</div>
                    </div>
                    <div class="bto">
                        <x-img class="gif" :offset="-100" :default-src="item.actionGifCoverUrl" :src="item.actionGifUrl"></x-img>
                        <div class="content">
                            <div class="ctnList" v-for="(item1, i1) in item.explainTexts" :key="`item1${i1}`">
                                <img class="icon1" :src="'tlfa_icon_zysx1.png' | PUBLIC_PATH">
                                {{ item1 }}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 分页 -->
        <div :class="!executeList.first?'page':'page page1'">
            <div 
                class="upper"
                v-if="!executeList.first"
                @click="pageClick(executeList.lastPageNum)"
                :style="{backgroundImage: 'url(btn_bg_white_previouspage.png)'} | PUBLIC_PATH"
            >上一页</div>
            <div 
                v-if="!executeList.last"
                class="lower"
                @click="pageClick(executeList.nextPageNum)"
                :style="{backgroundImage: 'url(btn_bg_yellow_nextpage.png)'} | PUBLIC_PATH"
            >下一页</div>
            <div 
                v-if="executeList.last"
                class="lower"
                @click="overClick()"
                :style="{backgroundImage: 'url(btn_bg_yellow_nextpage.png)'} | PUBLIC_PATH"
            >完成训练</div>
        </div>
    </div>
</template>
<script>
    import LayBg from '@/components/common/LayBg';
    import { mapState, mapMutations } from 'vuex'
    import { apiGetList, apiEnd } from '@/service/api'
    import { XImg } from 'vux'
    export default {
        data() {
            return {
                executeList: {},
                pageRequest: {
                    pageNum: 1,
                    pageSize: 5
                }
            }
        },
        components: {
            LayBg,
            XImg
        },
        computed: {
            ...mapState(['code', 'userInfo', 'listObj', 'course', 'startTime']),
        },
        filters: {
            datefilter(val) {
                return `${Number(val.substr(4,2))}月${Number(val.substr(6,2))}日`
            }
        },
        created() {
            // userId, courseId, courseSeq, moduleId, moduleType
            this.getDetail()
        },
        methods: {
            ...mapMutations(['setConsumedKcal']),
            async getDetail() {
                const data = await apiGetList(this.userInfo.userId, this.listObj.courseId, this.listObj.courseSeq, this.listObj.moduleId, this.listObj.moduleType, this.pageRequest)
                this.executeList = []
                this.executeList = data.pageInfo
                document.title = data.moduleName
            },
            listClick(val, val1) {
                if(val.lock == 1) {
                    const list = {
                        courseId: this.course,
                        courseSeq: val1,
                        moduleId: val.moduleId,
                        moduleType: val.moduleType,
                    }
                    this.setListObj(list)
                    this.$router.push('/detail')
                }else {
                    this.$toast('到当天才能解锁运动计划课程哦~')
                }
            },
            // 上一页 下一页
            pageClick(index) {
                this.pageRequest.pageNum = index
                this.getDetail()
                window.scrollTo(0,0)
            },
            // 完成训练 recordDate, userId, courseId, courseSeq, moduleId, moduleType\
            async overClick() {
                // 用时
                let endTime = (new Date()).valueOf()
                let executeSecond = ((endTime - this.startTime)/1000).toFixed(2)
                const data = await apiEnd(this.listObj.recordDate, this.userInfo.userId, this.listObj.courseId, this.listObj.courseSeq, this.listObj.moduleId, this.listObj.moduleType, executeSecond)
                this.setConsumedKcal(data.consumedKcal)
                this.$router.replace('/end')
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/mixin.scss";
    .detail {
        min-height: 100%;
        padding: 0.8rem 0.75rem 4.6rem /* 184/40 */;
        @include bg_color1();
        box-sizing: border-box;
        .ctn {
            padding: 1.4rem /* 56/40 */ 1.05rem /* 42/40 */ 1.4rem /* 56/40 */;
            box-sizing: border-box;
            background: #FFFFFF;
            box-shadow: 0 .3rem /* 12/40 */ 1rem /* 40/40 */ 0 rgba(211,170,160,0.10);
            border-radius: .2rem /* 8/40 */;
            position: relative;
            li {
                padding: .8rem /* 32/40 */ .3rem /* 16/40 */ .32rem /* 16/40 */ .4rem /* 16/40 */;
                box-sizing: border-box;
                & + li {
                    margin-top: 1.4rem /* 56/40 */;
                }
                &::before {
                    @include border_color2();
                }
                .title {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: .8rem /* 32/40 */;
                    .left {
                        font-size: .85rem /* 34/40 */;
                        @include font_color1();
                        font-weight: bold;
                        width: 9.75rem /* 390/40 */;
                        line-height: 1.2rem /* 48/40 */;
                        word-break: break-all;
                    }
                    .right {
                        font-size: .65rem /* 26/40 */;
                        @include font_color();
                        line-height: 1.2rem /* 48/40 */;
                    }
                }
                .bto {
                    font-size: 0;
                    .gif {
                        width: 14.85rem /* 594/40 */;
                        height: 8.35rem /* 334/40 */;
                    }
                    .content {
                        padding: .3rem /* 12/40 */ .3rem /* 12/40 */ .8rem /* 32/40 */;
                        box-sizing: border-box;
                        @include bg_color9();
                        .ctnList {
                            font-size: 0.75rem /* 28/40 */;
                            @include font_color5();
                            line-height: 1.1rem /* 44/40 */;
                            margin-top: .5rem /* 20/40 */;
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
            }
        }
        .page {
            position: fixed;
            z-index: 222;
            width: 100%;
            left: 50%;
            bottom: 1rem /* 40/40 */;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.75rem;
            box-sizing: border-box;
            .upper {
                width: 8rem /* 320/40 */;
                height: 2.5rem /* 100/40 */;
                background-position: center center;
                background-color: #FFFFFF;
                background-size: 7.5rem /* 300/40 */ 2rem /* 80/40 */;
                background-repeat: no-repeat;
                border-radius: 1.25rem /* 50/40 */;
                @include box_shodow3(0 .3rem /* 12/40 */ .75rem /* 30/40 */ 0);
                @include font_color1();
                font-size: .9rem /* 36/40 */;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .lower {
                width: 8rem /* 320/40 */;
                height: 2.5rem /* 100/40 */;
                background-position: center center;
                @include bg_color();
                background-size: 7.5rem /* 300/40 */ 2rem /* 80/40 */;
                background-repeat: no-repeat;
                border-radius: 1.25rem /* 50/40 */;
                @include box_shodow(0 .3rem /* 12/40 */ .75rem /* 30/40 */ 0);
                color: #fff;
                font-size: .9rem /* 36/40 */;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .page1 {
            justify-content: flex-end;
        }
    }
</style>