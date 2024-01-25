<template>
    <div class="storeOuter">
        <div class="box">
            <div class="tit">
                404
            </div>
            <div class="desc">
                作为一个公益项目，OceanStorage 并不打算提供更高级别的套餐，当前的套餐已经能够满足个人开发者日用。
            </div>
            <div class="desc">
                但是，维护公共站点不易，如果您愿意请我喝一杯咖啡，我将感激不尽！
            </div>
        </div>
        <div class="box box2">
            <img src="https://img.codesocean.top/image/1706066582067" alt="">
            <img src="https://img.codesocean.top/image/1706066634921" alt="">
        </div>
    </div>
</template>

<script>

</script>

<style scoped lang="scss">
    .storeOuter{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .box{
            width: 1000px;
            background-color: white;
            border: 1px solid #e6e6ec;
            box-sizing: border-box;
            margin: 20px 0;
            box-shadow:
                0px 0.6px 18.1px rgba(0, 0, 0, 0.007),
                0px 1.8px 50.1px rgba(0, 0, 0, 0.01),
                0px 4.2px 120.6px rgba(0, 0, 0, 0.013),
                0px 14px 400px rgba(0, 0, 0, 0.02);
            padding: 20px 30px;
            text-align: center;
            .tit{
                font-size: 30px;
                margin: 10px 0;
                font-weight: bold;
            }
            .desc{
                color: #111111;
            }
        }
        .box2{
            margin: 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            img{
                height: 400px;
                margin: 0 10px;
            }
        }
    }
</style>