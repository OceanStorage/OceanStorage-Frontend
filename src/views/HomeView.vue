<template>
    <div class="footer">
        <div>Copyright © 2021-2024 OceanStorage.</div>
        <div>严禁上传违反中国大陆/香港地区的图片，违者后果自负.</div>
        <div>使用即代表同意《OceanPic用户协议》</div>
    </div>
    <nav>
        <div class="navWrapper">
            <a href="" id="logo"><img src="/logo.png" alt="" class="miniLogo"></a>
            <div class="right">
                <div id="nav-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="overlay">
                    <div class="overlayContent" style="width: 100px;">
                        <a href="#" style="width: 120px">主页</a>
                        <a href="#" style="width: 170px">控制台</a>
                        <a href="#" style="width: 220px">帮助文档</a>
                        <p>Copyright OceanStorage 2024</p>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div class="background">
        <div class="header">
            <div class="headerWrapper">
                <h6>轻量、迅捷、安全地</h6>
                <h1>上传、存储<br>和分发静态资源</h1>
                <button class="login-btn" @click="router.push({name: 'login'})">进入控制台</button>
                <div class="developerDocument">
                    想要快速接入？
                    <Button label="查看帮助文档" severity="secondary" text link />
                </div>
                
                <div class="circle blue"></div>
                <div class="square red"></div>
                <div class="triangle green"><svg xmlns="http://www.w3.org/2000/svg" 
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 177.893 177.893">
                        <defs>
                            <linearGradient id="a" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                                <stop offset="0" stop-color="#3dbed5" />
                                <stop offset="1" stop-color="#3dd55a" />
                            </linearGradient>
                            <filter id="b" x="0" y="0" width="177.893" height="177.893" filterUnits="userSpaceOnUse">
                                <feOffset dx="3" dy="3" input="SourceAlpha" />
                                <feGaussianBlur stdDeviation="7.5" result="c" />
                                <feFlood flood-color="#3dd55a" flood-opacity="0.396" />
                                <feComposite operator="in" in2="c" />
                                <feComposite in="SourceGraphic" />
                            </filter>
                        </defs>
                        <g class="b" transform="matrix(1, 0, 0, 1, 0, 0)">
                            <path class="a" d="M136.727,21104.928l-50.222,100h100Z"
                                transform="translate(-8978.23 -19029.24) rotate(-25)" />
                        </g>
                    </svg></div>
                <div class="circle orange"></div>
            </div>
        </div>
    </div>

    <div class="section services">
        <div class="sectionWrapper">
            <h6>我们提供开放、自由、定制化的</h6>
            <h2>在线资源托管服务</h2>
            <p class="description">本站已托管总大小为 {{ formatBytes(siteInfo.totalFileSize) }} 的 {{ siteInfo.totalFileCount }} 项资源</p>
            <div class="square blue in-view">
                <img src="/logo-colored.svg" alt="">
            </div>
            <div class="grid">
                <div class="card">
                    <h3>支持外链</h3>
                    <p>完整的外链支持，你可以将资源用于任何地方：网站、博客、应用等</p>
                </div>
                <div class="card">
                    <h3>完全免费</h3>
                    <p>虽然有一定限制，但我们提供满足个人开发者常见需求的免费服务</p>
                </div>
                <div class="card">
                    <h3>不限格式不限速</h3>
                    <p>任何格式，绝不限速！摒弃网盘的产品思维，专注资源托管</p>
                </div>
                <div class="card">
                    <h3>开放源代码</h3>
                    <p>源代码完全开源，支持二次开发，可轻松部署在自己的服务器上</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import InfoApi from '../apis/InfoApi';

const router = useRouter();

onMounted(()=>{
    document.querySelector('#nav-icon').addEventListener("click", function () {
        document.querySelector('#nav-icon').classList.toggle('open');
        let overlay = document.querySelector(".overlay");
        overlay.classList.toggle("open");
        for(let item of [...overlay.querySelectorAll("a"), ...overlay.querySelectorAll("p")]){
            item.classList.toggle("open");
        }
    });
    getSiteInfo();
})

const siteInfo = ref({});
            
const getSiteInfo = async () => {
    siteInfo.value = await InfoApi.getSiteInfo();
}


function formatBytes(a, b) { 
    if (0 == a) return "0 B"; 
    var c = 1024, d = b || 2, e = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], f = Math.floor(Math.log(a) / Math.log(c)); 
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

</script>

<style lang="scss" scoped>

* {
    margin: 0;
    padding: 0;
}

h1 {
    color: #272727;
    font-size: 84px;
    font-weight: 700;
    position: relative;
    z-index: 10086;
}

h2 {
    color: #151515;
    font-size: 64px;
    font-weight: 700;
}

h6 {
    color: #8f8f8f;
    font-size: 28px;
    font-weight: 600;
    text-transform: uppercase;
}

p.description {
    color: #5A5A5A;
    font-size: 24px;
    font-weight: normal;
}

h1::selection {
    color: white;
    background: #272727;
}

h1::-moz-selection {
    color: white;
    background: #272727;
}

.section {
    width: 100%;
    height: 100vh;
    min-height: 800px;
    background: white;
    position: relative;
}

.sectionWrapper {
    width: 85%;
    height: 100%;
    margin: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: relative;
}

.background {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0;
}

.footer{
    animation: 3s fadeIn ease;
    position: absolute;
    bottom: 20px;
    left: calc(50% + 20px);
    transform: translateX(-50%);
    color:#999;
    text-align: center;
}

nav {
    width: 100%;
    height: 100px;
    background: white;
    position: absolute;
    top: 0;
    animation: 2s fadeInNav ease;
}

@keyframes fadeInNav {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0;
        top: -25px;
    }

    100% {
        opacity: 1;
        top: 0;
    }
}

.navWrapper {
    width: 85%;
    margin: auto;
    padding-top: 24px;
}

#logo {
    color: #292929;
    font-size: 30px;
    font-family: "Pacifico";
    font-weight: normal;
    text-decoration: none;
    img.miniLogo {
        height: 52px;
        margin: 8px;
    }
}

.right {
    float: right;
}

#nav-icon {
    width: 60px;
    height: 45px;
    position: relative;
    z-index: 2;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg) scale(0.4);
    -webkit-transition: .5s ease-in-out;
    -moz-transition: .5s ease-in-out;
    -o-transition: .5s ease-in-out;
    transition: .5s ease-in-out;
    cursor: pointer;
    margin-top: 10px;
}

#nav-icon span {
    display: block;
    position: absolute;
    height: 9px;
    width: 100%;
    background: #292929;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;
}

#nav-icon span:nth-child(1) {
    top: 0px;
    -webkit-transform-origin: left center;
    -moz-transform-origin: left center;
    -o-transform-origin: left center;
    transform-origin: left center;
}

#nav-icon span:nth-child(2) {
    top: 18px;
    -webkit-transform-origin: left center;
    -moz-transform-origin: left center;
    -o-transform-origin: left center;
    transform-origin: left center;
}

#nav-icon span:nth-child(3) {
    top: 36px;
    -webkit-transform-origin: left center;
    -moz-transform-origin: left center;
    -o-transform-origin: left center;
    transform-origin: left center;
}

#nav-icon.open span:nth-child(1) {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    top: -3px;
    left: 8px;
    background: white;
}

#nav-icon.open span:nth-child(2) {
    width: 0%;
    opacity: 0;
    background: white;
}

#nav-icon.open span:nth-child(3) {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
    top: 39px;
    left: 8px;
    background: white;
}

.overlay {
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,
                #3eafd3 0%,
                #20ab9e 100%);
    position: fixed;
    top: 0;
    left: 0;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
    opacity: 0;
    z-index: 1;
    visibility: hidden;
    display: flex;
    align-items: center;
}

.overlay.open {
    opacity: 1;
    visibility: visible;
}

.overlay a {
    color: white;
    font-size: 54px;
    font-weight: bold;
    text-decoration: none;
    display: block;
    margin-left: 135px;
    margin-bottom: 15px;
    opacity: 0;
    transition: transform 0.2s ease;
    overflow: hidden;
}

.overlay p {
    color: white;
    font-size: 20px;
    font-weight: normal;
    position: absolute;
    bottom: 100px;
    margin-left: 135px;
    opacity: 0;
}

.overlay p.open {
    opacity: 1;
    animation: 1.70s fadeInCopyright ease;
}

@keyframes fadeInCopyright {
    0% {
        opacity: 0;
    }

    80% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
    }
}

.overlay a:after {
    position: absolute;
    transition: .3s;
    content: '';
    width: 0;
    left: 50%;
    bottom: 0;
    height: 3px;
    background: white;
    left: 0;
}

.overlay a:hover:after {
    width: 100%;
    left: 0;
}

.overlay a.open:hover {
    transform: translateY(2px);
}

.overlay a.open:nth-child(1) {
    opacity: 1;
    animation: 1s fadeInLinks1 ease;
}

@keyframes fadeInLinks1 {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
    }
}

.overlay a.open:nth-child(2) {
    opacity: 1;
    animation: 1.25s fadeInLinks2 ease;
}

@keyframes fadeInLinks2 {
    0% {
        opacity: 0;
    }

    60% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
    }
}

.overlay a.open:nth-child(3) {
    opacity: 1;
    animation: 1.5s fadeInLinks3 ease;
}

@keyframes fadeInLinks3 {
    0% {
        opacity: 0;
    }

    70% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
    }
}

.header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(40px);
}

.headerWrapper {
    text-align: center;
    position: relative;
    padding: 56px 71px 128px 108px;
    .login-btn {
        width: 40%;
        height: 70px;
        color: #fff;
        background: linear-gradient(to right,
                #3eafd3 0%,
                #20ab9e 100%);
        border-radius: 10px;
        border: 0;
        margin-top: 50px;
        font-size: 20px;
        font-weight: bold;
        // transform: translateY(20px);
        animation: 3s fadeIn ease;

        &:hover {
            cursor: pointer;
        }
    }


    .developerDocument{
        margin-top: 15px;
        color: #666
    }
}

.headerWrapper h6 {
    animation: 1s fadeIn ease;
    position: relative;
    z-index: 10086;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.headerWrapper h1 {
    animation: 1.5s fadeInTitle ease;
}

@keyframes fadeInTitle {
    0% {
        opacity: 0;
    }

    25% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.circle {
    border-radius: 50%;
    width: 100px;
    height: 100px;
}

.circle.blue {
    background: linear-gradient(#4F3DD5, #3DB2D5);
    position: absolute;
    top: 0px;
    left: 0px;
    animation: circleBlueMove 2s ease;
    box-shadow: 3px 3px 15px rgba(61, 178, 213, 0.4);
}

@keyframes circleBlueMove {
    0% {
        opacity: 0;
        transform: translate(200px, 75px) rotate(90deg);
    }

    100% {
        opacity: 1;
    }
}

.circle.orange {
    background: linear-gradient(#D53D3D, #D5B83D);
    position: absolute;
    bottom: 0px;
    right: 0px;
    animation: circleOrangeMove 2s ease;
    box-shadow: 3px 3px 15px rgba(213, 184, 61, 0.4);
    transform: translate(0, -150px);
}

@keyframes circleOrangeMove {
    0% {
        opacity: 0;
        transform: translate(-200px, -225px) rotate(90deg);
    }

    35% {
        opacity: 0;
        transform: translate(-200px, -225px) rotate(90deg);
    }

    100% {
        opacity: 1;
    }
}

.square {
    width: 100px;
    height: 100px;
}

.square.red {
    background: linear-gradient(135deg, #D53D3D, #D53DC9);
    position: absolute;
    top: 0px;
    right: 15px;
    animation: squareRedMove 2s ease;
    box-shadow: 3px 3px 15px rgba(213, 61, 201, 0.4);
    transform: translate(14px, -20px) rotate(45deg);
}

@keyframes squareRedMove {
    0% {
        opacity: 0;
    }

    20% {
        opacity: 0;
        transform: translate(-200px, 75px) rotate(90deg);
    }

    100% {
        opacity: 1;
    }
}

.triangle svg {
    width: 175px;
    height: 175px;
    position: absolute;
    bottom: -17px;
    left: -20px;
    animation: triangleGreendMove 2s ease;
    transform: translate(0, -120px) scale(1.1);
}

@keyframes triangleGreendMove {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0;
        transform: translate(200px, -225px) rotate(90deg);
    }

    100% {
        opacity: 1;
    }
}

/* Services */

.services h6 {
    margin-bottom: 5px;
}

.services h2 {
    margin-bottom: 15px;
}

.services .description {
    margin-bottom: 60px;
    width: 685px;
    line-height: 40px;
}

.services .grid {
    display: grid;
    grid-template-columns: 500px 500px;
    grid-column-gap: 130px;
    grid-template-rows: 150px 150px;
    grid-row-gap: 30px;
}

.services .grid .card {
    width: 420px;
    padding: 28px 40px;
    background: linear-gradient(to bottom right, #313131, #0F0F0F);
    border-radius: 5px;
    display: block;
}

.services .grid .card h3 {
    color: white;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 5px;
}

.services .grid .card p {
    color: #C3C3C3;
    font-size: 22px;
    font-weight: normal;
}

.square.blue {
    position: absolute;
    // box-shadow: 3px 3px 15px rgba(61, 178, 213, 0.4);
    // background: linear-gradient(#4F3DD5, #3DB2D5);
    top: 100px;
    right: 75px;
    width: 125px;
    height: 125px;
    opacity: 0.01;
    transition: all 0.05s ease;
    transform: translateX(125px);
}

.square.blue.in-view {
    transform: rotate(22.5deg) translateX(0px);
    opacity: 1;
    transition: all 1s ease;
    img{
        transform: scale(1.8);
    }
}

/* Responsive */

@media (max-width: 1280px) {

    .services .grid {
        display: grid;
        grid-template-columns: 500px 500px;
        grid-column-gap: 50px;
        grid-template-rows: 150px 150px;
        grid-row-gap: 30px;
    }
}

@media (max-width: 1200px) {

    .services .sectionWrapper {
        padding-top: 185px;
        padding-bottom: 185px;
    }

    .services .grid {
        display: grid;
        grid-template-columns: 480px;
        grid-template-rows: 150px 150px;
        grid-row-gap: 30px;
    }

    .services .grid .card {
        width: 420px;
        padding: 43px 40px;
        background: linear-gradient(to bottom right, #313131, #0F0F0F);
        border-radius: 5px;
    }
}

@media (max-width: 850px) {

    .services .sectionWrapper {
        padding-top: 150px;
        padding-bottom: 150px;
    }

    h6 {
        font-size: 22px;
    }

    h2 {
        font-size: 48px;
    }

    .services .description {
        font-size: 22px;
        width: initial;
    }

    .services .square.blue {
        width: 75px;
        height: 75px;
    }

    .services .grid {
        display: grid;
        grid-template-columns: 85%;
        grid-template-rows: initial;
        grid-row-gap: 25px;
    }

    .services .grid .card {
        width: 100%;
        padding: 31.5px 30px;
        background: linear-gradient(to bottom right, #313131, #0F0F0F);
        border-radius: 5px;
    }

    .services .grid .card h3 {
        color: white;
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 5px;
    }

    .services .grid .card p {
        color: #C3C3C3;
        font-size: 20px;
        font-weight: normal;
    }
}

@media (max-width: 850px) and (min-width: 440px) {

    .headerWrapper {
        position: static;
        padding: 0;
    }

    .overlay a {
        color: white;
        font-size: 36px;
        font-weight: bold;
        text-decoration: none;
        display: block;
        margin-left: 40px;
        margin-bottom: 10px;
        opacity: 0;
        transition: transform 0.2s ease;
        overflow: hidden;
    }

    .overlay p {
        margin-left: 40px;
    }

    #services {
        width: 134px;
    }

    #work {
        width: 150px;
    }

    #contact {
        width: 125px;
    }

    h6 {
        font-size: 22px;
    }

    .headerWrapper h1 {
        color: #272727;
        font-size: 56px;
        font-weight: 700;
        animation: 1.5s fadeInTitle ease;
    }

    .circle {
        border-radius: 50%;
        width: 75px;
        height: 75px;
    }

    .circle.blue {
        background: linear-gradient(#4F3DD5, #3DB2D5);
        position: absolute;
        top: 129px;
        left: 50px;
        animation: circleBlueMove 2s ease;
        box-shadow: 3px 3px 15px rgba(61, 178, 213, 0.4);
    }

    @keyframes circleBlueMove {
        0% {
            opacity: 0;
            transform: translate(200px, 75px) rotate(90deg);
        }

        100% {
            opacity: 1;
        }
    }

    .circle.orange {
        background: linear-gradient(#D53D3D, #D5B83D);
        position: absolute;
        top: 520px;
        right: 50px;
        animation: circleOrangeMove 2s ease;
        box-shadow: 3px 3px 15px rgba(213, 184, 61, 0.4);
    }

    @keyframes circleOrangeMove {
        0% {
            opacity: 0;
            transform: translate(-200px, -75px) rotate(90deg);
        }

        35% {
            opacity: 0;
            transform: translate(-200px, -75px) rotate(90deg);
        }

        100% {
            opacity: 1;
        }
    }

    .square {
        width: 75px;
        height: 75px;
    }

    .square.red {
        background: linear-gradient(135deg, #D53D3D, #D53DC9);
        position: absolute;
        top: 130px;
        right: 50px;
        animation: squareRedMove 2s ease;
        box-shadow: 3px 3px 15px rgba(213, 61, 201, 0.4);
        transform: rotate(45deg);
    }

    @keyframes squareRedMove {
        0% {
            opacity: 0;
        }

        20% {
            opacity: 0;
            transform: translate(-200px, 75px) rotate(90deg);
        }

        100% {
            opacity: 1;
        }
    }

    .triangle svg {
        width: 125px;
        height: 125px;
        position: absolute;
        top: 480px;
        left: 25px;
        animation: triangleGreendMove 2s ease;
    }

    @keyframes triangleGreendMove {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 0;
            transform: translate(200px, -75px) rotate(90deg);
        }

        100% {
            opacity: 1;
        }
    }
}

@media (max-width: 440px) {

    .background {
        max-height: 700px;
    }

    .headerWrapper {
        position: static;
        padding: 0;
    }

    .overlay a {
        color: white;
        font-size: 36px;
        font-weight: bold;
        text-decoration: none;
        display: block;
        margin-left: 40px;
        margin-bottom: 10px;
        opacity: 0;
        transition: transform 0.2s ease;
        overflow: hidden;
    }

    .overlay p {
        margin-left: 40px;
        position: static;
        margin-top: 40px;
    }

    #services {
        width: 134px;
    }

    #work {
        width: 150px;
    }

    #contact {
        width: 125px;
    }

    .headerWrapper h6 {
        color: #D6D6D6;
        font-size: 22px;
        font-weight: 600;
        text-transform: uppercase;
        animation: 1s fadeIn ease;
    }

    .headerWrapper h1 {
        color: #272727;
        font-size: 48px;
        font-weight: 700;
        animation: 1.5s fadeInTitle ease;
    }

    .circle {
        border-radius: 50%;
        width: 75px;
        height: 75px;
    }

    .circle.blue {
        background: linear-gradient(#4F3DD5, #3DB2D5);
        position: absolute;
        top: 169px;
        left: 25px;
        animation: circleBlueMove 2s ease;
        box-shadow: 3px 3px 15px rgba(61, 178, 213, 0.4);
    }

    @keyframes circleBlueMove {
        0% {
            opacity: 0;
            transform: translate(100px, 75px) rotate(90deg);
        }

        100% {
            opacity: 1;
        }
    }

    .circle.orange {
        background: linear-gradient(#D53D3D, #D5B83D);
        position: absolute;
        top: 480px;
        right: 25px;
        animation: circleOrangeMove 2s ease;
        box-shadow: 3px 3px 15px rgba(213, 184, 61, 0.4);
    }

    @keyframes circleOrangeMove {
        0% {
            opacity: 0;
        }

        35% {
            opacity: 0;
            transform: translate(-100px, -75px) rotate(90deg);
        }

        100% {
            opacity: 1;
        }
    }

    .square {
        width: 75px;
        height: 75px;
    }

    .square.red {
        background: linear-gradient(135deg, #D53D3D, #D53DC9);
        position: absolute;
        top: 170px;
        right: 25px;
        animation: squareRedMove 2s ease;
        box-shadow: 3px 3px 15px rgba(213, 61, 201, 0.4);
        transform: rotate(45deg);
    }

    @keyframes squareRedMove {
        0% {
            opacity: 0;
        }

        20% {
            opacity: 0;
            transform: translate(-100px, 75px) rotate(90deg);
        }

        100% {
            opacity: 1;
        }
    }

    .triangle svg {
        width: 125px;
        height: 125px;
        position: absolute;
        top: 450px;
        left: 5px;
        animation: triangleGreendMove 2s ease;
    }

    @keyframes triangleGreendMove {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 0;
            transform: translate(100px, -75px) rotate(90deg);
        }

        100% {
            opacity: 1;
        }
    }

    .square.blue {
        top: 30px;
        right: 10px;
        transform: translateX(60px);
    }

    .square.blue.in-view {
        transform: rotate(22.5deg) translateX(0px);
    }

}
</style>