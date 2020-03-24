<template>
    <div class="end">
        <div class="ctn">
            <img class="icon" :src="'img_carryout_default_verygood.png' | PUBLIC_PATH">
            <div class="tit">恭喜完成本次训练</div>
            <div class="bto">
                <div class="bto1">{{ consumedKcal }}</div>
                <div class="bto2">消耗/大卡</div>
            </div>
        </div>
        <div
            class="button tap_events"
            @click="over"
            :style="{backgroundImage: 'url(sy_button_bg.png)'}  | PUBLIC_PATH">结束训练</div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {}
    },
    computed: {
        ...mapState(['consumedKcal']),
    },
    methods: {
        over() {
            this.$router.replace('/plan')
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/mixin.scss";
.end {
    min-height: 100%;
    padding: 1.6rem /* 64/40 */ 1.6rem /* 64/40 */ 0 1.6rem /* 64/40 */;
    @include bg_color1();
    box-sizing: border-box;
    .ctn {
        background: #fff;
        box-shadow: 0 .3rem /* 12/40 */ 1rem /* 40/40 */ 0 rgba(211,170,160,0.10);
        border-radius: .2rem /* 8/40 */;
        margin-bottom: 1.6rem /* 64/40 */;
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon {
            margin-top: 3.675rem /* 147/40 */;
            margin-bottom: 3.375rem /* 135/40 */;
            width: 8.75rem /* 350/40 */;
            min-height: 5.1rem /* 204/40 */;
        }
        .tit {
            font-size: .8rem /* 32/40 */;
            color: #666666;
            text-align: center;
            line-height: 1.125rem /* 45/40 */;
            margin-bottom: 1.75rem /* 70/40 */;
        }
        .bto {
            text-align: center;
            margin-bottom: 1.4rem /* 56/40 */;
            .bto1 {
                font-size: 1.4rem /* 56/40 */;
                color: #333333;
                text-align: center;
                line-height: 1.2rem /* 48/40 */;
                margin-bottom: .675rem /* 27/40 */;
                font-weight: bold;
            }
            .bto2 {
                font-size: .6rem /* 24/40 */;
                line-height: .825rem /* 33/40 */;
                color: #999999;
                text-align: center;
            }
        }
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
        background-position: center center;
        @include bg_color();
        background-repeat: no-repeat;
        background-size: 15rem 2rem;
        font-weight: bold;
    }
}
</style>
