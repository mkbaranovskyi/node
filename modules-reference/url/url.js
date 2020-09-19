const myUrl = new URL('http://mywebsite.com:8000/hello.html?id=100&status=active')

console.log(myUrl.search)		// ?id=100&status=active
console.log(myUrl.searchParams)		// URLSearchParams { 'id' => '100', 'status' => 'active' }

myUrl.searchParams.append('key', 'value')	// add new search params
console.log(myUrl.search)	// ?id=100&status=active&key=value

// looping over search params
myUrl.searchParams.forEach((value, key) => console.log(`value = ${value}, key = ${key}`))

// Output:
// value = 100, key = id
// value = active, key = status


// if '?' is present at the start, it's ignored
let params = new URLSearchParams('user=abc&query=xyz')

console.log(params.get('user'))		// abc
console.log(params.delete('user'))	// 
console.log(params.toString())		// query=xyz