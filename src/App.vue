<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="scss">
@import url(assets/css/style);

@keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}to{opacity:1;-webkit-transform:scaleX(1);transform:scaleX(1)}}
@keyframes square-spin {
  25%{-webkit-transform: perspective(100px) rotateX(180deg) rotateY(0);transform: perspective(100px) rotateX(180deg) rotateY(0);}
  50%{-webkit-transform: perspective(100px) rotateX(180deg) rotateY(180deg);transform: perspective(100px) rotateX(180deg) rotateY(180deg);}
  75%{-webkit-transform: perspective(100px) rotateX(0) rotateY(180deg);transform: perspective(100px) rotateX(0) rotateY(180deg);}
  100%{-webkit-transform: perspective(100px) rotateX(0) rotateY(0);transform: perspective(100px) rotateX(0) rotateY(0);}
}
pre {
  background-color: transparent;
  font-size: inherit;
  font-family: inherit;
  border: inherit;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.fadeInBottom-enter-active, .fadeInBottom-leave-active {
  transition: all .3s ease;
}
.fadeInBottom-enter, .fadeInBottom-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(1.5rem);
  opacity: 0;
}

.f-fs120 {
  font-size: 120%;
}
.f-pointer {
  cursor: pointer;
}

.fadeIn-enter-active, .fadeIn-leave-active {
  transition: all .3s ease;
}
.fadeIn-enter, .fadeIn-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.transition-03 {
  transition: all .3s ease;
}

.animation-square-spin {
  -webkit-animation: square-spin 3s 0s cubic-bezier(.09,.57,.49,.9) infinite;
  animation: square-spin 3s 0s cubic-bezier(.09,.57,.49,.9) infinite;
}

.input-bottom-border {
  border: none;
  border-bottom: 1px solid #e5e5e5;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}

.blog-content {
  &>div {
    padding: 1.1rem;
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% - 2.2rem)
  }
}

.uk-table th {
  text-align: left;
}
</style>
