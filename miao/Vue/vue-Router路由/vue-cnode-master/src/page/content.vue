<template>
	<div class="wrap" ref="viewBox">
		<div class="tab">
			<span value="all" @click='changetab("all")' :class="{active:active==='all'}">全部</span>
			<span value="good" @click='changetab("good")' :class="{active:active==='good'}">精华</span>
			<span value="weex" @click='changetab("weex")' :class="{active:active==='weex'}">weex</span>
			<span value='share' @click='changetab("share")' :class="{active:active==='share'}">分享</span>
			<span value="ask" @click='changetab("ask")' :class="{active:active==='ask'}">问答</span>
			<span value="job" @click='changetab("job")' :class="{active:active==='job'}">招聘</span>
		</div>
		<ul class="item" >
			<li v-for='i in site'  >
				<router-link :to="'/user/'+i.author.loginname"><img :src="i.author.avatar_url" alt="" class="pic">
				</router-link>
				<router-link :to="'/topic/'+i.id ">
					<div class="s-right">
						<p>{{i.title}}</p>
						<div>
							<i></i>
							<span>回复数{{ i.reply_count}}</span>
							<span>主题：{{i.tab}}</span>
						</div>
					</div>
				</router-link>
			</li>
		</ul>
		<div v-if='loadingTip' class="loadingTip">
			正在拼命加载中....
		</div>
		<div v-if='nomore' class="nomore">
		——————我是有底线的呢——————
		</div>
		<!-- <div  v-if="!site.length">
			<strong>暂无话题</strong>
		</div> -->
	</div>
</template>
<script>
	// import this.$axios from 'this.$axios';
	export default{
		data(){
			return {
				site:[],
				tabName:'all',
				page:1,
				loadingTip:false,
				nomore:false,
				loaded:true,
				active:'all'
			}
		},
		created(){
			this.changetab('all')
		},
		mounted(){
			//ele.onscroll=function(){}此方法不行？
			this.$refs.viewBox.addEventListener('scroll',this.throttle(this.setpage,200),false)
		},
	methods:{
			//tab切换
			changetab(val){
				this.tabName=val;
				this.$axios.get('api/v1/topics?tab='+val+'&limit=10')
				.then(res=>{
					if(res.data.data.length===0){
						this.loaded=false;
						this.nomore=true
						this.loadingTip=false
					}
					this.site=res.data.data;
					this.page=1;
					this.active=val
					this.nomore=false;
				})
			},
			throttle(fn,delay,atleast){
				/**函数节流方法
				@param Function fn 延时调用函数
				@param Number dalay 延迟多长时间
				@param Number atleast 至少多长时间触发一次
				@return Function 延迟执行的方法
				*/
				let timer = null;
				let previous = null;
				return function () {
					var now = +new Date();
					if ( !previous ) previous = now;
					if ( atleast && now - previous > atleast ) {
						fn();
		                // 重置上一次开始时间为本次结束时间
		                previous = now;
		                clearTimeout(timer);
		            } else {
		            	clearTimeout(timer);
		            	timer = setTimeout(function() {
		            		fn();
		            		previous = null;
		            	}, delay);
		            }
		        }
		    },
		    setpage(){
		    	// var curTop = document.documentElement.scrollTop || document.body.scrollTop;
		    	// console.log(this.$refs.viewBox.scrollTop+this.$refs.viewBox.offsetHeight,this.$refs.viewBox.scrollHeight)
		    	if (this.nomore &&!this.loaded) return;
		    	if(this.$refs.viewBox.scrollTop+ this.$refs.viewBox.offsetHeight+5 >= this.$refs.viewBox.scrollHeight){
					this.loadingTip=true
					this.$axios.get('/api/v1/topics?tab='+this.tabName+'&page='+(++this.page)+'&limit=10')
					.then(
						res=>{
							let arr=res.data.data;
							if(arr.length===0){
									//some tips
									this.loaded=false
									this.nomore=true
									this.loadingTip=false
									return
								}
								// ES5的合并数组
								// arr1.concat(arr2, arr3);
								// ES6的合并数组
								//[...arr1, ...arr2, ...arr3]
								this.site=[...this.site,...arr]
								this.loadingTip=true//这里不知道为什么突然看不到loading图了
							}
							)
					.catch(err=>{
						console.log(err)
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '../style/base/_base.scss';
.wrap{
	width: 100%;
	overflow: auto;
	top: 80px;
	position: absolute;
	z-index: 10;
	bottom:60px; /*哇，这个布局，真的要疯了,这里*/
}
.tab{
	display: flex;
	width: 100%;
	align-items: center;
	background: #474A4F;
	height: 40px;
	position: fixed;
	left:0;
	top:0;
	margin-top:40px;
	width:100%;
	span{
		flex: 1;
		display: flex;
		justify-content: center;
		color: white;
		cursor: pointer;
	}
}
.pic{
	width:40px;
	height: 40px;
	float: left;
	margin-right: 10px;
	border-radius:20px;
}
.s-right{
	float: left;
}
.item{
	li{
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		border-bottom: 1px solid #eaeaea;
		padding: 10px;
		height: 86px;
		align-items: center;
		box-sizing: border-box;
		a{
			color: #666666;
		}
	}
}
.loadingTip{
	height:50px;
	line-height:50px;
	text-align:center;
	color:#666666;
}
.loadingTip::before{
	content:'';
	width: 20px;
	height:20px;
	border-radius:100% 100% 100% 0;
	border: 1px solid red;
	display: inline-block;
	border-bottom: none;
	border-left:none;
	box-sizing: border-box;
	vertical-align:sub;
	-webkit-animation:loading 1s linear infinite;
}
@keyframes loading{
	0%{
		transform:rotate(0deg)
	}
	100%{
		transform:rotate(360deg)
	}
}

.nomore{
	text-align:center;
	height: 40px;
    line-height: 40px;
    color: #a2a1a1;
}
.active{
	border: 1px solid #ccc;
}
</style>