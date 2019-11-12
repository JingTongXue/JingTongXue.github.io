<template>
        <div class="htop">
        	<img src="../assets/logo.png" height="40" width="40" alt="">
			<!-- <span class="pub">>></span> -->
        </div>
</template>
<script>
	export default{
		name:'myheader'
	}
</script>
<style>
@import '../style/base/_base.scss';
	.htop{
		 height: 40px;
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-box-pack: justify;
	    -ms-flex-pack: justify;
	    justify-content: space-between;
	    border-bottom: 1px solid #ccc;
	    background: #474A4F;
	    left: 0;
	    width: 100%;
	    position: absolute;
	    z-index: 5;
	    top: 0;
	}
	.pub{
		width: 40px;
		height: 40px;
		font-weight: bold;
		display: flex;
        align-items: center;
       justify-content: center;
       color: white;
	}

</style>