<template>
    <div class="calendar no-copy" ref="scrollView" @touchmove.stop>
        <div class="calendar-c">
            <ul class="planDate">
                <li v-for="(item, i) in nursePlanList" :key="`A${i}`">
                    <div :class="item.today !== '1'?'date':'date date1'">{{ item.today === "1"?"今日":item.weekInfo }}</div>
                    <div @click="planDateClick(i)" :class="i===check?'weekDate select tap_events':'weekDate tap_events'" :style="{'color':item.rest == '1'?'#C4C4C4':' #333333'}">{{ item.exerciseDate.substring(6) }}</div>
                </li>
            </ul>
        </div>
        <!-- bg元素 -->
        <img class="imgLeft" :src="'bg_calendar_right_mask.png' | PUBLIC_PATH">
        <img class="imgRight" :src="'bg_calendar_left_mask.png' | PUBLIC_PATH">
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
        }
    },
    props: {
        nursePlanList: {
            type: Array
        }
    },
    computed: {
        ...mapState(['check', 'scrollLeft']),
    },
    mounted() {
        this.$nextTick(()=>{
            if(this.check == 'no') {
                // 取日历今天的状态
                this.nursePlanList.some((item,i)=>{
                    if(item.today == "1") this.setCheck(i)
                })
                if(this.check == 'no') this.setCheck(0)
                let clientWidth = document.documentElement.clientWidth
                let scrollLeft = (clientWidth/(750/90) * this.check)
                this.$refs.scrollView.scrollLeft = scrollLeft
                this.$emit('planDateClick', this.check)
                return
            }else if(this.check >= 0) {
                // 取记录的日期状态 和滚动位置
                this.$refs.scrollView.scrollLeft = this.scrollLeft
                this.$emit('planDateClick', this.check)
                return
            }
        })
    },
    beforeDestroy() {
        // 记住横向滚动的距离
        this.setScrollLeft(this.$refs.scrollView.scrollLeft)
    },
    methods: {
        ...mapMutations(['setCheck', 'setScrollLeft']),
        planDateClick(val) {
            this.setCheck(val)
            this.setScrollLeft(this.$refs.scrollView.scrollLeft)
            this.$emit('planDateClick', val)
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/mixin.scss";
.calendar {
    width: 100%;
    overflow-x: auto;
    padding: 0 1.05rem;
    box-sizing: border-box;
    &::-webkit-scrollbar {
        display: none;
    }
    .calendar-c {
        .planDate {
            display: flex;
            justify-content: space-between;
            white-space: nowrap;
            li {
                width: 1.6rem /* 64/40 */;
                height: 2.875rem /* 115/40 */;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                flex-basis: 1.6rem /* 64/40 */;
                flex-shrink: 0;
                & + li {
                    margin-left: .65rem /* 26/40 */;
                }
                &:last-child {
                    padding-right: 1.05rem;
                }
                .date {
                    height: .85rem /* 34/40 */;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: .7rem /* 28/40 */;
                    @include font_color12();
                    line-height: 0;
                }
                .date1 {
                    @include font_color11();
                }
                .weekDate {
                    width: 1.6rem /* 64/40 */;
                    height: 1.6rem /* 64/40 */;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: .85rem /* 34/40 */;
                    @include font_color4();
                    line-height: 0;
                    font-weight: bold;
                }
            }
            .select {
                @include bg_color();
                color: #fff!important;
            }
        }
    }
    .imgLeft, .imgRight {
        width: 1.05rem /* 42/40 */;
        height: 2.875rem /* 115/40 */;
    }
    .imgLeft {
        position: absolute;
        left: -0.1rem;
        top: 1.4rem /* 56/40 */;
        z-index: 222;
    }
    .imgRight {
        position: absolute;
        right: -0.1rem;
        top: 1.4rem /* 56/40 */;
        z-index: 222;
    }
}
</style>

