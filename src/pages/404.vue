<template>
    <div id="lost">
        <div class="noise"></div>
        <div class="overlay"></div>
        <div class="terminal">
            <h1>Error <span class="errorcode">404</span></h1>
            <p class="output">您正在访问的页面已被移除，或临时不可访问。</p>
            <p class="output">请 <a href="javascript:history.go(-1)">返回上一步</a> 或 <a @click="$router.push('/')">返回首页</a>。</p>
            <p class="output">祝好运。</p>

            <p class="output">The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>
            <p class="output">Please try to <a href="javascript:history.go(-1)">go back</a> or <a @click="$router.push('/')">return to the homepage</a>.</p>
            <p class="output">Good luck.</p>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
@keyframes scan {0%{ background-position: 0 -100vh; } 35%, 100% { background-position: 0 100vh; }}
#lost {
    position: relative;
    box-sizing: border-box;
    height: 100vh;
    background-color: #000000;
    background-image: radial-gradient(#11581E, #041607), url('https://static.zhaolianqi.cn/imgs/green-bg.webp');
    background-repeat: no-repeat;
    background-size: cover;
    font-family: 'Inconsolata', Helvetica, sans-serif;
    font-size: 1.5rem;
    color: rgba(128, 255, 128, 0.8);
    text-shadow: 0 0 1ex rgba(51, 255, 51, 1), 0 0 2px rgba(255, 255, 255, 0.8);
    .noise {
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url('https://static.zhaolianqi.cn/imgs/green-bg.webp');
        background-repeat: no-repeat;
        background-size: cover;
        z-index: -1;
        opacity: .02;
    }
    .overlay {
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(180deg,rgba(0, 0, 0, 0) 0,rgba(0, 0, 0, 0.3) 50%,rgba(0, 0, 0, 0) 100%);
        background-size: auto 4px;
        z-index: 1;
        &::before {
            content: "";
            pointer-events: none;
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(0deg,transparent 0%,rgba(32, 128, 32, 0.2) 2%,rgba(32, 128, 32, 0.8) 3%,rgba(32, 128, 32, 0.2) 3%,transparent 100%);
            background-repeat: no-repeat;
            animation: scan 7.5s linear 0s infinite;
        }
    }
    .terminal {
        box-sizing: inherit;
        position: absolute;
        height: 100%;
        width: 1000px;
        max-width: 100%;
        padding: 4rem;
        padding-top: 9rem;
        text-transform: uppercase;
    }
    .output {color: rgba(128, 255, 128, 0.8);text-shadow:0 0 1px rgba(51, 255, 51, 0.4),0 0 2px rgba(255, 255, 255, 0.8);}
    .output::before {content: "> ";}
    a {color: #fff;text-decoration: none;}
    a::before {content: "[";}
    a::after {content: "]";}
    .errorcode {color: white;}
}
</style>