<template>
    <div class="risk">
        <div class="ctn" v-if="riskData.title">
            <LayBg/>
            <Template1 :data="riskData"/>
        </div>
        <div 
            class="btn tap_events"
            @click="start"
            :style="{backgroundImage: 'url(btn_bg_condition_yellow_program.png)'}  | PUBLIC_PATH"
        >确认无以上情况</div>
    </div>
</template>
<script>
import LayBg from '@/components/common/LayBg';
import Template1 from '@/components/common/Template1'
import { mapState } from 'vuex'
import { apiHomeData } from '@/service/api'
export default {
    data() {
        return {
            riskData: {}
        }
    },
    components: {
        LayBg,
        Template1
    },
    computed: {
        ...mapState(['code', 'userInfo', 'courseKind']),
    },
    created() {
        this.getRiskEvaluation()
    },
    methods: {
        async getRiskEvaluation() {
            const data = await apiHomeData(this.code, this.courseKind, this.userInfo.userId)
            this.riskData = data.riskEvaluation
        },
        start() {
            this.$router.push('/step1')
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/mixin.scss";
.risk {
    width: 100%;
    min-height: 100%;
    padding: .8rem /* 32/40 */ .75rem /* 30/40 */ 4.6rem /* 184/40 */;
    box-sizing: border-box;
    @include bg_color1();
    .ctn {
        position: relative;
        background: #FFFFFF;
        @include box_shodow1(0 .3rem /* 12/40 */ 1rem /* 40/40 */ 0);
        border-radius: .2rem /* 8/40 */;
        padding: 1.4rem /* 56/40 */ .8rem /* 32/40 */;
        box-sizing: border-box;
    }
    .btn {
        width: 10.25rem /* 410/40 */;
        height: 2.5rem /* 100/40 */;
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
        background-size: 9.7275rem /* 389.1/40 */ 2rem;
        font-weight: bold;
    }
}
</style>
