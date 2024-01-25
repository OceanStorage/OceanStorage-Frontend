<template>
    <div class="content">
        <div class="box">
            <div class="left">
                <div class="block">
                    <div class="text">
                        <div class="one-text">
                            <div>
                                <div class="triangle"></div>
                                <span class="maos">上传</span>
                            </div>
                            <div>存储</div>
                            <div>分享</div>
                            <div>一切资源.</div>
                        </div>
                        <div class="two-text">
                            <div>基于开源项目 OceanStorage 构建</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="login-box">
                    <div class="title">
                        <h2>找回密码
                        </h2>
                    </div>
                    <div class="login-input">
                        <SelectButton v-model="validateMethod" :options="validateMethods" aria-labelledby="basic"
                            optionLabel="name" optionValue="value" :allowEmpty="false" />
                        <div class="inputWrapper">
                            <input type="text" class="inputs email-input" v-model="formInfo.entity">
                            <Button class="btn" label="发送验证码" severity="secondary" @click="sendCode" />
                        </div>
                        <span class="input-text">验证码</span>
                        <input class="inputs pwd-input" v-model="formInfo.code">
                        <span class="input-text">新密码</span>
                        <input type="password" class="inputs pwd-input" v-model="formInfo.pwd">
                        <span class="input-text">重复新密码</span>
                        <input type="password" class="inputs pwd-input" v-model="formInfo.repwd">
                        <button class="login-btn" @click="submit">提交</button>
                    </div>
                    <div class="divider">
                        <span class="line"></span>
                        <span class="divider-text">或者</span>
                        <span class="line"></span>
                    </div>
                    <div class="other-login-wrapper">
                        <div class="other-login-item" @click="router.push({ name: 'login' })">
                            <span>登录到 OceanStorage</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import 'primeicons/primeicons.css'
import UserApi from "../apis/UserApi"

const router = useRouter();

const validateMethods = ref([]);

const validateMethod = ref("");

onMounted(async () => {
    validateMethods.value = await UserApi.getValidateMethods();
    validateMethod.value = validateMethods.value[0].value;
})

const formInfo = ref({
    entity: "",
    pwd: "",
    code: "",
    repwd: ""
})

async function sendCode() {
    window.startLoading();
    await UserApi.sendValidateCode({
        method: validateMethod.value,
        content: formInfo.value.entity,
        for: "forgetPassword"
    })
    window.toast({
        severity: 'success',
        summary: `验证码发送成功`,
        detail: "请到对应验证方式中检查新消息",
        life: 5000
    })
    window.stopLoading();
}

async function submit() {
    if (formInfo.value.repwd != formInfo.value.pwd) {
        window.toast({
            severity: 'error',
            summary: `输入不正确`,
            detail: "两次输入密码不一致",
            life: 5000
        })
        return;
    }
    window.startLoading();
    await UserApi.verifyValidateCode({
        method: validateMethod.value,
        content: formInfo.value.entity,
        code: formInfo.value.code,
        pwd: formInfo.value.pwd,
        for: "forgetPassword"
    })
    window.toast({
        severity: 'success',
        summary: `密码修改成功`,
        detail: "请进行登录",
        life: 5000
    })
    router.push({ name: 'login' })
    window.stopLoading();
}

</script>

<style lang="scss" scoped>
.content {
    background-color: #fafafc;
    position: relative;
    width: 100vw;
    height: 100vh;

    .box {
        width: 80vw;
        height: 80vh;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        box-shadow:
            0px 0.6px 18.1px rgba(0, 0, 0, 0.017),
            0px 1.8px 50.1px rgba(0, 0, 0, 0.025),
            0px 4.2px 120.6px rgba(0, 0, 0, 0.033),
            0px 14px 400px rgba(0, 0, 0, 0.05);

        .left {
            background-color: rgb(172, 198, 248);
            width: 50%;
            height: 100%;
            background-image: linear-gradient(-225deg, #3bb1ff 0%, #09af9f 40%, #09af9f 60%, #3bb1ff 100%);
            background-size: 200%;
            animation: anime 20s linear infinite;
            position: relative;

            .block {
                width: 70%;
                height: 70%;
                background-color: rgba(255, 255, 255, 0.35);
                backdrop-filter: blur(13.5px);
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);

                .text {
                    color: #fff;
                    margin: 15% 0 0 15%;
                    position: relative;

                    .one-text {
                        font-size: 50px;
                        font-weight: 800;

                        .triangle {
                            width: 0px;
                            height: 0px;
                            border: 20px solid transparent;
                            border-left-color: rgb(255, 255, 255);
                            display: inline-block;
                            transform: translateY(6px);
                        }

                        .maos {
                            margin-right: -5px;
                            display: inline-block;
                            position: absolute;
                            left: 30px;
                        }

                        div:last-child {
                            color: rgb(22, 22, 76);
                        }
                    }

                    .two-text {
                        margin-top: 50px;
                        font-size: 18px;
                    }
                }
            }
        }

        .right {
            background-color: #fff;
            width: 50%;
            height: 100%;
            position: relative;

            .login-box {
                width: 70%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);

                .title {
                    margin-top: 15px;
                    margin-bottom: 30px;

                    img {
                        width: 40px;
                        height: 40px;
                        margin-bottom: -1px;
                    }

                    h2 {
                        font-weight: 600;
                        font-size: 40px;
                        display: inline;
                    }

                    span {
                        color: rgb(136, 135, 154);
                        display: block;
                        margin-top: 10px;
                        font-size: 20px;
                    }
                }

                .login-input {
                    .input-text {
                        font-weight: 600;
                        color: rgb(41, 40, 78);
                    }

                    .inputs {
                        display: block;
                        margin: 10px 0;
                        width: 100%;
                        height: 50px;
                        border: 1px solid rgb(201, 200, 207);
                        border-radius: 8px;
                        padding: 10px;
                        box-sizing: border-box;
                        outline: none;
                        font-size: 20px;
                        font-weight: 200;

                        &:hover {
                            border: 1px solid #1bb0c0;
                        }
                    }

                    .inputWrapper {
                        position: relative;

                        .btn {
                            position: absolute;
                            z-index: 1;
                            right: 5px;
                            top: 4.5px;
                            height: calc(100% - 10px);
                        }

                        .inputs {
                            display: block;
                            margin: 10px 0;
                            width: 100%;
                            height: 50px;
                            border: 1px solid rgb(201, 200, 207);
                            border-radius: 8px;
                            padding: 10px;
                            box-sizing: border-box;
                            outline: none;
                            font-size: 20px;
                            font-weight: 200;

                            &:hover {
                                border: 1px solid #1bb0c0;
                            }
                        }
                    }


                    .login-btn {
                        width: 100%;
                        height: 60px;
                        color: #fff;
                        background: linear-gradient(to right,
                                #3eafd3 0%,
                                #20ab9e 100%);
                        border-radius: 10px;
                        border: 0;
                        margin-top: 20px;
                        font-size: 20px;

                        &:hover {
                            cursor: pointer;
                        }
                    }
                }

                .divider {
                    width: 100%;
                    margin: 20px 0;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .line {
                        display: inline-block;
                        max-width: 45%;
                        width: 45%;
                        flex: 1;
                        height: 1px;
                        background-color: rgb(201, 202, 209);
                    }

                    .divider-text {
                        vertical-align: middle;
                        margin: 0px 20px;
                        line-height: 0px;
                        display: inline-block;
                        width: 50px;
                        color: rgb(201, 202, 209);
                    }
                }

                .other-login-wrapper {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;

                    .other-login-item {
                        width: 100%;
                        border: 1px solid rgb(214, 222, 228);
                        padding: 10px;
                        text-align: center;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: 600;
                        color: rgb(51, 49, 116);
                        margin-bottom: 15px;

                        img {
                            width: 30px;
                            height: 30px;
                            vertical-align: middle;
                        }

                        span {
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }
}

@keyframes anime {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
