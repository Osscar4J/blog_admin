<template>
	<div style="position: relative;height: 100%; width:100%;" 
		:style="{paddingLeft: paddingLeft+'px'}">
		<div style="position: absolute; left:50%; top:50%; transform: translate(-50%,-50%);" 
			:style="{width: cardWidth+'px', height: cardHeight+'px'}">
			<div class="card" style="z-index: 13;" 
				:style="{width:cardWidth+'px',height:cardHeight+'px',left:left+'px',top:top+'px','border-radius':borderRadius+'px',backgroundColor:cardBgColor}" 
				:class="{'animation':isAnimating,'shadowEffect':hasShadow,'boderEffect':hasBorder}" 
				@touchstart="touchStart" 
				@mousedown="touchStart" 
				@touchmove="touchMove" 
				@mousemove="touchMove"
				@touchcancel="touchCancel" 
				@mouseup="touchCancel" 
				@touchend="touchCancel">
				<slot name="firstCard"></slot>
			</div>
			<div class="card" style="z-index: 12;" :style="{width:width2+'px',height:height2+'px',left:left2+'px',top:top2+'px','border-radius':borderRadius+'px',backgroundColor:cardBgColor}" :class="{'animation':isAnimating,'shadowEffect':hasShadow,'boderEffect':hasBorder}">
				<slot name="secondCard"></slot>
			</div>
			<div class="card" style="z-index: 11;" :style="{width:width3+'px',height:height3+'px',left:left3+'px',top:top3+'px','border-radius':borderRadius+'px',backgroundColor:cardBgColor}" :class="{'animation':isAnimating,'shadowEffect':hasShadow,'boderEffect':hasBorder}">
				<slot name="thirdCard"></slot>
			</div>
			<div class="card" style="z-index: 10;" :style="{width:width4+'px',height:height4+'px',left:left4+'px',top:top4+'px','border-radius':borderRadius+'px',backgroundColor:cardBgColor,opacity:opacity4}" :class="{'animation':isAnimating,'shadowEffect':hasShadow,'boderEffect':hasBorder}">
				
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			// 正常卡片宽度
			cardWidth: {
				type: Number,
				default: 260
			},
			// 正常卡片高度
			cardHeight: {
				type: Number,
				default: 300
			},
			// 卡片层叠的横向边距
			leftPad:{
				type: Number,
				default: 10
			},
			// 卡片层叠的纵向边距
			topPad:{
				type:Number,
				default:6
			},
			// 卡片背景色
			cardBgColor:{
				type:String,
				default:"#fff"
			},
			// 卡片拖拽方向
			dragDirection:{
				type:String,
				default:"all" //all,vertical,horizontal
			},
			// 卡片的圆角弧度
			borderRadius:{
				type:Number,
				default:10
			},
			// 卡片触发飞卡效果的距离
			throwTriggerDistance:{
				type:Number,
				default:100
			},
			// 飞卡的移动距离
			throwDistance:{
				type:Number,
				default:1000
			},
			// 是否开启卡片描边效果
			hasBorder:{
				type:Boolean,
				default:false
			},
			// 是否开启阴影效果
			hasShadow:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				left:0,
				top:0,
				startLeft:0,
				startTop:0,
				isDrag:false,
				isThrow:false,
				needBack:false,
				isAnimating:false,
				
				left2:0,
				top2:0,
				width2:0,
				height2:0,
				
				left3:0,
				top3:0,
				width3:0,
				height3:0,
				
				left4:0,
				top4:0,
				width4:0,
				height4:0,
				opacity4:0,
				
				paddingLeft:0,
				paddingTop:0
			};
		},
		methods:{
			getDistance:function(x1, y1, x2, y2) {
				let _x = Math.abs(x1 - x2)
				let _y = Math.abs(y1 - y2)
				return Math.sqrt(_x * _x + _y * _y)
			},
			touchStart:function(e){
				if (this.isAnimating)
					return null
				
				this.isDrag = true
				this.needBack = false
				this.isThrow = false
				let curTouch = e
				this.startLeft = curTouch.clientX-this.left
				this.startTop = curTouch.clientY-this.top
				
				this.onDragStart()
			},
			touchMove:function(e){
				if (this.isAnimating) return
				if (!this.isDrag) return

				let curTouch = e
				if (this.dragDirection == "all" || this.dragDirection == "horizontal")
					this.left = curTouch.clientX - this.startLeft
				if (this.dragDirection == "all" || this.dragDirection == "vertical")
					this.top = curTouch.clientY - this.startTop
				let distance = this.getDistance(0, 0, this.left, this.top)
				
				this.onDragMove({left: this.left, top: this.top, distance: distance})
			},
			touchCancel:function(e){
				let distance = this.getDistance(0, 0, this.left, this.top)
				
				this.isDrag = false
				this.onDragStop({left: this.left, top: this.top, distance: distance})
				if (this.isAnimating) 
					return null
				
				distance = this.getDistance(0, 0, this.left, this.top);
				if (distance > this.throwTriggerDistance){
					this.makeCardThrow()
				} else {
					this.makeCardBack()
				}
			},
			resetAllCardDown:function(){
				this.left = 0;
				this.top = 0;
				
				this.width2 = this.cardWidth - this.leftPad * 2
				this.height2 = this.cardHeight - this.topPad * 2
				this.left2 = this.leftPad
				this.top2 = this.topPad * 3
				
				this.width3 = this.cardWidth - this.leftPad * 4
				this.height3 = this.cardHeight - this.topPad * 4
				this.left3 = this.leftPad * 2
				this.top3 = this.topPad * 6
				
				this.width4 = this.cardWidth - this.leftPad * 6
				this.height4 = this.cardHeight - this.topPad * 6
				this.left4 = this.leftPad * 3;
				this.top4 = this.topPad * 9
				this.opacity4 = 0
				
			},
			resetAllCard:function(){
				this.resetAllCardDown()
			},
			makeCardThrow:function(){
				this.isThrow = true
				this.needBack = false
				
				let angle = Math.atan2((this.top-0), (this.left-0))
				this.left = Math.cos(angle) * this.throwDistance
				this.top = Math.sin(angle) * this.throwDistance
				
				this.width2 = this.cardWidth
				this.height2 = this.cardHeight
				this.left2 = 0
				this.top2 = 0
				
				this.width3 = this.cardWidth - this.leftPad * 2
				this.height3 = this.cardHeight - this.topPad * 2
				this.left3 = this.leftPad
				this.top3 = this.topPad * 3
				
				this.width4 = this.cardWidth - this.leftPad*4
				this.height4 = this.cardHeight - this.topPad*4
				this.left4 = this.leftPad * 2
				this.top4 = this.topPad * 6
				this.opacity4 = 1
				
				this.isAnimating = true
				
				this.onThrowStart()
				setTimeout(() => {
					this.isThrow = false
					this.isAnimating = false
					this.onThrowDone()
					this.resetAllCard()
				}, 400)
			},
			makeCardBack:function(){
				this.isThrow = false
				this.needBack = true
					
				if (this.needBack){
					this.left = 0
					this.top = 0
				}
				
				this.isAnimating = true
				setTimeout(() => {
					this.onThrowFail()
					this.isAnimating = false
					this.needBack = true
				}, 600);
			},
			onDragStart:function(){
				this.$emit('onDragStart');
			},
			onDragMove:function(obj){
				this.$emit('onDragMove',obj);
			},
			onDragStop:function(obj){
				this.$emit('onDragStop',obj);
			},
			onThrowFail:function(){
				this.$emit('onThrowFail');
			},
			onThrowStart:function(){
				this.$emit('onThrowStart');
			},
			onThrowDone:function(){
				this.$emit('onThrowDone');
			}
		},
		mounted() {
			this.resetAllCard();
		}
	}
</script>

<style>
	.card {
		position: absolute;
		overflow: hidden;
		cursor: pointer;
	}
	.card.boderEffect {
		border: 1px solid #ccc;
	}
	.card.shadowEffect {
		box-shadow: 0 5px 15px rgba(0,0,0,.08);

	}
	.card.animation	{
		transition: opacity .4s ease-out,left .4s ease-out,top .4s ease-out,width .4s ease-out,height .4s ease-out;
	}
</style>