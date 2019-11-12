//获取cookie
export function getCookie(name){
	var cookieName = encodeURIComponent(name) + "=",
	cookieStart = document.cookie.indexOf(cookieName),
	cookieValue = null;
	if (cookieStart > -1){
		var cookieEnd = document.cookie.indexOf(";", cookieStart);
		if (cookieEnd == -1){
			cookieEnd = document.cookie.length;
		}
		cookieValue = decodeURIComponent(document.cookie.substring(cookieStart
			+ cookieName.length, cookieEnd));
	}
	return cookieValue;
}
//设置cookie
export function setCookie(name, value, expires, path, domain, secure) {
	var cookieText = encodeURIComponent(name) + "=" +
	encodeURIComponent(value);
	if (expires instanceof Date) {
	cookieText += "; expires=" + expires.toGMTString();
	}
	if (path) {
	cookieText += "; path=" + path;
	}
	if (domain) {
	cookieText += "; domain=" + domain;
	}
	if (secure) {
	cookieText += "; secure";
	}
	document.cookie = cookieText;
}
//删除cookie
export function delCookie(name, path, domain, secure){
    setCookie(name, "", new Date(0), path, domain, secure);
}
