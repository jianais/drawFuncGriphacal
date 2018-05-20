String.prototype.replaceAll = function(regExp, replaceStr){
	return this.replace(new RegExp(regExp, "gm"), replaceStr);
};