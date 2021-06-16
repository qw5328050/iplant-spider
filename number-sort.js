var a = [6,6,7,8,23,4,26,1,3,5,6,3]
var obj = [{num:1},{num:6},{num:4},{num:2}]
var array = []
a.forEach(v => {
	var val = array.filter(j => {
		return j.name == v
	})
	if (val.length == 0) {
		array.push({name:v,num:1})
	} else {
		val[0].num +=1
	}
})
var b = array.sort((a, b) => a.num - b.num)
console.log(b)
