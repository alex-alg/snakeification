function EntityList(){
	this.list = [];
}

EntityList.prototype.add = function(item){
	this.list[item.id] = item;
}

EntityList.prototype.remove = function(itemKey){
	delete this.list[itemKey];
}

export default EntityList;