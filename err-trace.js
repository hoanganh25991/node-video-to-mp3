const members = [{name: "anh"}];

setTimeout(() => {
	return new Promise(resolve => resolve(members[1].name))
			.catch(err => console.log(err))
}, 1000)