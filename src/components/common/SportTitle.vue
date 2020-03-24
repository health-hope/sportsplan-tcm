<template>
    <div v-if="tempData.courseName" class="soprtTitle" :style="{ backgroundImage: `url(${ tempData.bgImageUrl })`}">
        <div class="siyuan">{{ tempData.courseName }}</div>
        <div class="sub" v-if="tempData.exerciseStatus == 3">距离计划开始还剩{{ (tempData.courseNotStartInfo.distance) }}天</div>
        <div class="sub" v-else>第{{ tempData.currentCourseSeq }}天 {{ tempData.weeklyExerciseDays.length }}次/周 共{{ tempData.weekCount }}周</div>
        <div class="sub1"  v-if="tempData.exerciseStatus == 3">
            <img :src="'ic_details_time.png' | PUBLIC_PATH" alt>
            {{ tempData.courseNotStartInfo.beginDate | datefilter }}开始
        </div>
    </div>
</template>

<script>
export default {
    props: {
        tempData: {
            type: Object,
            default: {},
        }
    },
    data(){
        return{
        }
    },
    filters: {
        datefilter(val) {
            return `${Number(val.substr(4,2))}月${Number(val.substr(6,2))}日`
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixin.scss";
.soprtTitle {
    @include box_shodow1(0 .3rem /* 12/40 */ 1rem /* 40/40 */ 0);
    border-radius: .2rem /* 8/40 */ .2rem /* 8/40 */ 0 0;
    height: 6.825rem /* 273/40 */;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    padding: 1rem /* 40/40 */ 1.05rem /* 42/40 */;
    box-sizing: border-box;
    .siyuan {
        font-size: 1.2rem /* 48/40 */;
        @include font_color1();
        line-height: 1.5rem /* 60/40 */;
        font-family: "SourceHanSerifCN-Bold";
    }
    .sub {
        font-size: 0.7rem;
        line-height: 1rem /* 40/40 */;
        @include font_color1();
        opacity: 0.6;
        margin: .4rem /* 16/40 */ 0 .925rem /* 37/40 */;
        padding-left: .05rem /* 2/40 */;
        box-sizing: border-box;
    }
    .sub1 {
        opacity: 0.6;
        font-size: .7rem /* 28/40 */;
        line-height: 1rem;
        @include font_color1();
        position: relative;
        padding-left: 1.1rem /* 44/40 */;
        box-sizing: border-box;
        img {
            width: .9rem /* 36/40 */;
            height: .9rem /* 36/40 */;
            line-height: 1rem;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>