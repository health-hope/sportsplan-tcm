<template>
    <div class="step1">
        <!-- x系证候类型 -->
        <div class="type">
            <BaseZyTempTitle bgClass="jgy_bg_5" :tempTitle="typeTitle"/>
            <div class="ctn">
                <LayBg/>
                <Cell
                    class="tap_events"
                    @click.native="cellClick('1')"
                    :leftVal="'类型'"
                    :rightVal="rightVal1"
                />
            </div>
        </div>
        <!-- 请选择运动方式 -->
        <div class="type">
            <BaseZyTempTitle bgClass="jgy_bg_2" :tempTitle="'请选择运动方式'"/>
            <div class="ctn">
                <LayBg/>
                <div class="sport">
                    <div
                        @click="sportClick(item.sportWayCode, i)"
                        :class="item.check?'sp sport-select tap_events':'sp tap_events'"
                        v-for="(item, i) in sportWayList"
                        :key="`sport${i}`"
                    >
                        <div class="img">
                            <div :class="item.check?'img-c':''">
                                <img class="imgtype" :src="item.imageUrl">
                                <img
                                    v-show="item.check"
                                    class="icon"
                                    :src="'img_selected.png' | PUBLIC_PATH"
                                >
                            </div>
                        </div>
                        <div class="tips">{{ item.desc }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 身体基本信息 -->
        <div class="type">
            <BaseZyTempTitle bgClass="jgy_bg_1" :tempTitle="'身体基本信息'"/>
            <div class="ctn">
                <LayBg/>
                <Cell
                    class="tap_events"
                    @click.native="cellClick('2')"
                    :leftVal="'出生日期'"
                    :rightVal="rightVal2"
                />
                <Cell
                    class="tap_events"
                    @click.native="cellClick('3')"
                    :leftVal="'性别'"
                    :rightVal="rightVal3"
                />
                <Cell
                    class="tap_events"
                    @click.native="cellClick('4')"
                    :leftVal="'身高'"
                    :rightVal="rightVal4"
                />
                <Cell
                    class="tap_events"
                    @click.native="cellClick('5')"
                    :leftVal="'体重'"
                    :rightVal="rightVal5"
                />
            </div>
        </div>
        <!-- 选择类型dialog -->
        <div v-transfer-dom>
            <x-dialog :hide-on-blur="true" v-model="showToast1" class="dialog1">
                <div class="single-c">
                    <LayBg/>
                    <Single class="tap_events" :single="stypeData" @itemClick="itemClick"/>
                </div>
            </x-dialog>
        </div>
        <!-- 选择出生日期dialog -->
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
        <!-- 选择性别dialog -->
        <div v-transfer-dom>
            <x-dialog :hide-on-blur="true" v-model="showToast3" class="dialog3">
                <div class="multiple-c">
                    <LayBg/>
                    <div class="gender">
                        <div
                            v-for="(item,i) in gender"
                            :key="`gender${i}`"
                            @click="selectGender(i)"
                            :class="item.check?'g1 check tap_events':'g1 tap_events'"
                        >
                            <img :src="item.name | PUBLIC_PATH">
                        </div>
                    </div>
                </div>
            </x-dialog>
        </div>
        <!-- 选择身高dialog -->
        <div v-transfer-dom>
            <x-dialog :hide-on-blur="true" v-model="showToast4" class="dialog4">
                <div class="multiple-c">
                    <LayBg/>
                    <picker
                        class="pheight"
                        style="padding: 10px 0"
                        :data="PHeightArr"
                        v-model="PHeight"
                    ></picker>
                    <div
                        class="btn111 tap_events"
                        :style="{backgroundImage: 'url(btn_bg_Evaluation_yellow_activation.png)'} | PUBLIC_PATH"
                        @click="selectHeight()"
                    >确定</div>
                </div>
            </x-dialog>
        </div>
        <!-- 选择体重dialog -->
        <div v-transfer-dom>
            <x-dialog :hide-on-blur="true" v-model="showToast5" class="dialog4">
                <div class="multiple-c">
                    <LayBg/>
                    <picker
                        class="pweight"
                        style="padding: 10px 0"
                        :data="PWeightArr"
                        v-model="PWeight"
                    ></picker>
                    <div
                        class="btn111 tap_events"
                        :style="{backgroundImage: 'url(btn_bg_Evaluation_yellow_activation.png)'} | PUBLIC_PATH"
                        @click="selectWeight()"
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
    import Cell from '@/components/common/Cell';
    import Single from '@/components/common/SingleElection.vue'
    import { TransferDomDirective as TransferDom, XDialog, DatetimeView, Picker } from 'vux'
    import { mapState, mapMutations } from 'vuex'
    import { apiConfig, apiSaveConfig } from '@/service/api'
    export default {
        data() {
            return {
                stypeData: [],
                resultCode: '',
                sportWayList: [],
                sportWayCode: '',
                format: 'YYYY-MM-DD',
                datetime: '1990-01-01',
                startDate: '',
                endDate: '',
                gender: [{ "code": "1", "name": "boy.png", "check": false }, { "code": "2", "name": "girl.png", "check": false }],
                genderVal: '',
                PHeight: ['165'],
                PHeightArr: [],
                PWeight: ['60.0'],
                PWeightArr: [],
                showToast1: false,
                showToast2: false,
                showToast3: false,
                showToast4: false,
                showToast5: false,
                rightVal1: '请选择',
                rightVal2: '请选择',
                rightVal3: '请选择',
                rightVal4: '请选择',
                rightVal5: '请选择',
                typeTitle:'心系证候类型'
            }
        },
        components: {
            LayBg,
            BaseZyTempTitle,
            Cell,
            XDialog,
            Single,
            DatetimeView,
            Picker,
        },
        directives: {
            TransferDom
        },
        computed: {
            ...mapState(['code', 'userInfo', 'courseKind']),
            saveFlag() {
                let val = '请选择'
                if (this.rightVal1.indexOf(val) < 0 && this.rightVal2.indexOf(val) < 0 && this.rightVal3.indexOf(val) < 0 && this.rightVal4.indexOf(val) < 0 && this.rightVal5.indexOf(val) < 0 && this.sportWayCode != "") {
                    return true
                } else {
                    return false
                }
            },
        },
        created() {
            if(this.code=='1'){
                this.typeTitle="心系证候类型"
            }else if(this.code=='2'){
                this.typeTitle="肝系证候类型"
            }else if(this.code=='3'){
                this.typeTitle="肺系证候类型"
            }else if(this.code=='4'){
                this.typeTitle="脾系证候类型"
            }else if(this.code=='5'){
                this.typeTitle="胃系证候类型"
            }else if(this.code=='6'){
                this.typeTitle="肾系证候类型"
            }else if(this.code=='7'){
                this.typeTitle="小肠系证候类型"
            }else if(this.code=='8'){
                this.typeTitle="大肠系证候类型"
            }else if(this.code=='9'){
                this.typeTitle="胆系证候类型"
            }
            this.getStepData()
        },
        methods: {
            ...mapMutations('step',['setConfigData']),
            async getStepData() {
                const data = await apiConfig(this.courseKind, this.userInfo.userId, this.code)
                this.buildId = data.buildId
                // 心系类型
                this.stypeData = data.evaluationResList
                // 运动方式
                this.sportWayList = data.sportWayList
                // 出生日期
                this.startDate = data.userLimitInfo.birthday.max
                this.endDate = data.userLimitInfo.birthday.min
                // 身高
                let Hmin = Number(data.userLimitInfo.height.min)
                    let Hmax = Number(data.userLimitInfo.height.max)
                    let PHeightArr = []
                    for (let i = Hmin; i <= Hmax; i++) {
                        PHeightArr.push({
                            name: i + '',
                            value: i + ''
                        })
                    }
                    this.PHeightArr = [PHeightArr]
                // 体重
                let Wmin = Number(data.userLimitInfo.weight.min)
                let Wmax = Number(data.userLimitInfo.weight.max)
                let PWeightArr = []
                for (let i = Wmin; i <= Wmax; i++) {
                    if(i == Wmax) {
                        PWeightArr.push({
                            name: `${i}.0`,
                            value: `${i}.0`
                        })
                    }else {
                        for (let j = 0; j <= 9; j++) {
                            PWeightArr.push({
                                name: `${i}.${j}`,
                                value: `${i}.${j}`
                            })
                        }
                    }
                }
                this.PWeightArr = [PWeightArr]
                // 设置回显信息
                if(data.resultCode !=="") {
                     this.stypeData.some((item, i) => {
                        if(item.code == data.resultCode) {
                            this.rightVal1 = item.name
                            this.resultCode = item.code
                            this.$set(this.stypeData[i], 'check', true)
                            return
                        }
                    })
                }
                if(data.sportWay !=="") {
                    this.sportWayList.some((item, i) => {
                        if(item.sportWayCode == data.sportWay) {
                            this.$set(this.sportWayList[i], 'check', true)
                            this.sportWayCode = item.sportWayCode
                            return
                        }
                    })
                }
                if(data.userInfo) {
                    if(data.userInfo.birthday.includes('-')) {
                        this.datetime = data.userInfo.birthday
                    }else {
                        this.datetime = `${data.userInfo.birthday.substr(0,4)}-${data.userInfo.birthday.substr(4,2)}-${data.userInfo.birthday.substr(6,2)}`
                    }
                    this.PHeight = Array(data.userInfo.height)
                    this.PWeight = Array(data.userInfo.weight)
                    this.gender.some((item, i) => {
                        if(item.code == data.userInfo.gender) {
                            this.$set(this.gender[i], 'check', true)
                            if(item.code == 1) {
                                this.rightVal3 = "男"
                                this.genderVal = 1
                            }else {
                                this.rightVal3 = "女"
                                this.genderVal = 2
                            }
                            return
                        }
                    })
                    this.rightVal2 = this.datetime
                    this.rightVal4 = `${data.userInfo.height} 厘米`
                    this.rightVal5 = `${data.userInfo.weight} 公斤`
                }
            },
            // 选择运动方式
            sportClick(val1, val2) {
                this.sportWayList.map((item, i) => {
                    if (val2 == i) {
                        if (this.sportWayList[i].check) {
                            this.$set(this.sportWayList[i], 'check', false)
                            this.sportWayCode = ""
                        } else {
                            this.$set(this.sportWayList[i], 'check', true)
                            this.sportWayCode = val1
                        }
                    } else {
                        this.$set(this.sportWayList[i], 'check', false)
                    }
                })
            },
            cellClick(val) {
                if (val == 2) {
                    if (this.rightVal2.indexOf('-') >= 0) {
                        this.datetime = this.rightVal2
                        this.$refs.datetime.render()
                    } else {
                        this.datetime = '1990-01-01'
                        this.$refs.datetime.render()
                    }
                }else if (val == 4) {
                    if (this.rightVal4.indexOf('厘米') >= 0) {
                        this.PHeight = Array(this.rightVal4.substring(0,3))
                        this.$refs.datetime.render()
                    } else {
                        this.PHeight = ['165']
                        this.$refs.datetime.render()
                    }
                }else if (val == 5) {
                    if (this.rightVal5.indexOf('公斤') >= 0) {
                        this.PWeight = Array(this.rightVal5.substring(0,4))
                        this.$refs.datetime.render()
                    } else {
                        this.PWeight = ['60.0']
                        this.$refs.datetime.render()
                    }
                }
                this[`showToast${val}`] = true;
            },
            // 选择性别
            selectGender(index) {
                this.gender.map((item, i) => {
                    if(i == index) {
                        item.check = true
                        if(item.code == 1) {
                            this.rightVal3 = "男"
                            this.genderVal = 1
                        }else {
                            this.rightVal3 = "女"
                            this.genderVal = 2
                        }
                        this.showToast3 = false
                    }else {
                        item.check = false
                    }
                })
            },
            // 出生日期确认
            dateTimeSure() {
                this.rightVal2 = this.datetime
                this.showToast2 = false
            },
            // 选择身高
            selectHeight() {
                this.rightVal4 = `${this.PHeight[0]} 厘米`
                this.showToast4 = false
            },
            // 选择体重
            selectWeight() {
                this.rightVal5 = `${this.PWeight[0]} 公斤`
                this.showToast5 = false
            },
            // 类型点击
            itemClick(index) {
                this.stypeData.map((item, i) => {
                    if (i == index) {
                        this.$set(this.stypeData[i], 'check', true)
                        this.rightVal1 = item.name
                        this.resultCode = item.code
                    } else {
                        this.$set(this.stypeData[i], 'check', false)
                    }
                })
                this.showToast1 = false
            },
            // 保存配置获取测评题 courseKind, userId, code, userInfo, buildId, sportWayCode, resultCode
            async saveConfig() {
                const userInfo = {
                    "gender": this.genderVal,
                    "birthday": this.datetime.replace(/\-/g,''),
                    "height": this.PHeight[0],
                    "weight": this.PWeight[0],
                }
                const data = await apiSaveConfig(this.courseKind, this.userInfo.userId, this.code, userInfo, this.buildId, this.sportWayCode, this.resultCode )
                this.setConfigData(data)
                this.$router.push('/step2')
            },
            // 保存按钮
            saveClick() {
                if (this.saveFlag) {
                    this.saveConfig()
                }
            }
        }
    }
</script>
<style lang="scss">
    .pheight .scroller-indicator {
        position: relative;
    }
    .pweight .scroller-indicator {
        position: relative;
    }
    .pheight .scroller-indicator::after {
        content: "厘米";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        height: 34px;
        line-height: 34px;
        color: #999999;
        margin-left: 40px;
    }
    .pweight .scroller-indicator::after {
        content: "公斤";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        height: 34px;
        line-height: 34px;
        color: #999999;
        margin-left: 40px;
    }
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
                            .imgtype {
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
    .dialog1,
    .dialog2,
    .dialog3,
    .dialog4 {
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


