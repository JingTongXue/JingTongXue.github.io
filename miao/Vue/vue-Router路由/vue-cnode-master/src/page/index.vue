<template>
	<div>
		<myheader></myheader>
		<mycontent></mycontent>
		<navBottom></navBottom>
	</div>
</template>
<script>
	import navBottom from '../components/bottomNav.vue'
	import mycontent from '../page/content.vue'
	import myheader from '../components/myheader.vue'
	export default{
		components:{navBottom,myheader,mycontent}
	}
</script>