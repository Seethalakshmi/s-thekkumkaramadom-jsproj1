//These are the URLs for JSON response
//const ipUrl='http://ip.jsontest.com/'
const ipUrl='http://localhost:8080/ipAddress'
// const headerUrl = 'http://headers.jsontest.com/'
const headerUrl = 'http://localhost:8080/headers'
// const dateTimeUrl = 'http://date.jsontest.com'
const dateTimeUrl = 'http://localhost:8080/datetime'
// const validateUrl = 'http://validate.jsontest.com/'
const validateUrl = 'http://localhost:8080/validateJson'
// const md5Url = 'http://md5.jsontest.com/'
const md5Url = 'http://localhost:8080/md5'


//this is main part
async function main(){
    try{
        await getResponse(fetch, ipUrl).then(ipRes => document.getElementById('ip_id').innerHTML= ipRes.ip)//getting ip address here
        await getResponse(fetch, headerUrl).then(headRes => document.getElementById('header_id').innerHTML = JSON.stringify(headRes, undefined, 2))//getting headers here
        //calls setInterval for updating every second
        setInterval( function(){getResponse(fetch, dateTimeUrl).then(dateTimeRes=> document.getElementById('datetime_id').innerHTML= dateTimeRes.date+' '+dateTimeRes.time)},1000)
    }catch (err){
        console.log("Got an error : "+err.message)
    }
}

function onSubmit(){
    try{
        let validateJsonUrl = new URL(validateUrl)
        //combines the url and user input and validating the user input
        validateJsonUrl.searchParams.append('json',document.getElementById('user_input').value )
        console.log("Complete URL ---"+validateJsonUrl)
        getResponse(fetch, validateJsonUrl).then(validateRes => {
            document.getElementById('result').innerHTML = validateRes.validate
            document.getElementById('err_msg').innerHTML = (!validateRes.validate) ? validateRes.error:''

        })
    }catch (err) {
        console.log("Got an error for validate : "+err.message)
    }

}
function populateMD5onSubmit(){
    try{
        let md5populateUrl = new URL(md5Url)
        //combines the url and user input and populating the md5
        md5populateUrl.searchParams.append('text', document.getElementById('user_text').value)
        console.log(" MD5 URL is ----"+md5populateUrl)
        getResponse(fetch, md5populateUrl).then(md5Res => document.getElementById('md5_result').innerHTML = md5Res.md5)
    }catch (err) {
        console.log("Got an error on populating md5 : "+err.message)
    }

}
//this is the function for fetch call and to be tested
async function getResponse(_fetch = fetch, url) {
    const result = await _fetch(url)
    if (result.ok === false)
        return false
    return await result.json()
}

async function test_getIPResponse(){
    //tests for dummy ip property
    //tests two parts one is result is not ok and result is ok

    const _fetch_not_ok = (url) => {
        return new Promise(((resolve, reject) => {
            resolve({
                ok: false
            })
        }))
    }
    let response = await getResponse(_fetch_not_ok,'http://ip.jsontest.co')//putting a false url
    test_log(response === false, 'Falsy IP Address response ')

    const _fetch_ip = (url) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                json: () => new Promise(resolve => resolve({
                    ip: '127.0.0.1'
                }))
            })
        })
    }
    response = await getResponse(_fetch_ip, 'ipUrl')
    test_log(response?.ip === '127.0.0.1', 'IP Address ')
}

async function test_getHeaderResponse(){
//tests for dummy headers and checks for two cases result not okay and result okay
    const _fetch_not_ok = (url) => {
        return new Promise(((resolve, reject) => {
            resolve({
                ok: false
            })
        }))
    }
    let response = await getResponse(_fetch_not_ok,'http://head.jsontest.com')//used head instead of header
    test_log(response === false, 'Falsy Header response ')
    const _fetch_header = (url) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                json: () => new Promise(resolve => resolve({
                    Host: 'http://does.nothing.com'
                }))
            })
        })
    }
    response = await getResponse(_fetch_header, 'headerUrl')
    test_log(response.Host === 'http://does.nothing.com', 'Header-Host ')

}

//tests for date and time response
async function test_getDateTimeResponse(){
//checks 2 scenarios response not ok and response ok
    const _fetch_not_ok = (url) => {
        return new Promise(((resolve, reject) => {
            resolve({
                ok: false
            })
        }))
    }
    let response = await getResponse(_fetch_not_ok,'http://date.json.com')//omitted test from json test
    test_log(response === false, 'Falsy Date & Time response ')
    const _fetch_dateTime = (url) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                json: () => new Promise(resolve => resolve({
                    date: '20 April',
                    time:'10:20',
                    milliseconds_since_epoch:3000
                }))
            })
        })
    }
    response = await getResponse(_fetch_dateTime, 'dateTimeUrl')
    test_log(response?.date === '20 April', 'Date & Time-Date ')
    test_log(response?.time === '10:20', 'Date & Time-Time ')
    test_log(response?.milliseconds_since_epoch === 3000, 'Date & Time-milliseconds_since_epoch ')

}
//calls a single logging function for validation (if else)
function test_log(valid, msg){
    if(valid)
        console.log(msg + 'Passed')
    else
        console.log(msg + 'Failed')
}
//tests for right JSON value
async function test_validateRightOnSubmit() {
//checks 2 scenarios response not ok and response ok
    const _fetch_not_ok = (url) => {
        return new Promise(((resolve, reject) => {
            resolve({
                ok: false
            })
        }))
    }
    let response = await getResponse(_fetch_not_ok,'http://validate.jsontest.co/json={"name":"Seetha"}')
    test_log(response === false, 'Falsy Right JSON Validation response ')
    const testValidateJsonUrl1 = 'http://validate.jsontest.com/?json={"name":"Seetha"}'
    //tests for hard-coded user input
    const _fetch_json_validation1 = (url) =>{
        return new Promise(((resolve, reject) => {
            resolve({
                ok:true,
                json: () => new Promise(resolve => resolve({
                    validate: true
                }))
            })
        }))
    }
    response = await getResponse(_fetch_json_validation1, testValidateJsonUrl1)
    test_log(response?.validate === true, 'Right JSON Validation ')
}
//tests for wrong JSON value
async function test_validateWrongOnSubmit(){
//checks 2 scenarios response not ok and response ok
    const _fetch_not_ok = (url) => {
        return new Promise(((resolve, reject) => {
            resolve({
                ok: false
            })
        }))
    }
    let response = await getResponse(_fetch_not_ok,'http://validate.jontest.co/json={"name":"Seetha"')
    test_log(response === false, 'Falsy Wrong JSON Validation response ')

    const testValidateJsonUrl2 = 'http://validate.jsontest.com/?json={"name":"Seetha"'

    const _fetch_json_validation2 = (url) =>{
        return new Promise(((resolve, reject) => {
            resolve({
                ok:true,
                json: () => new Promise(resolve => resolve({
                    validate: false
                }))
            })
        }))
    }
    response = await getResponse(_fetch_json_validation2, testValidateJsonUrl2)
    test_log(response?.validate === false, 'Wrong JSON Validation ')

}
//checks for presence of md5 property
async function test_md5OnSubmit(){
    //checks 2 scenarios response not ok and response ok
    const _fetch_not_ok = (url) => {
        return new Promise(((resolve, reject) => {
            resolve({
                ok: false
            })
        }))
    }
    let response = await getResponse(_fetch_not_ok,'http://md5.jontest.co/text=')
    test_log(response === false, 'Falsy md5 response ')

    //const testMD5Url = 'http://md5.jsontest.com/?text=hello'
    const _fetch_md5 = (url) =>{
        return new Promise(((resolve, reject) => {
            resolve({
                ok:true,
                json: () => new Promise(resolve => resolve({
                    md5:'xn3y1o2381273eno1eic'
                }))
            })
        }))
    }
    response = await getResponse(_fetch_md5, 'testMD5Url')
    test_log(response?.md5 === 'xn3y1o2381273eno1eic', 'md5 ')

}
main()
//calling test functions
test_getIPResponse()
test_getHeaderResponse()
test_getDateTimeResponse()
test_validateRightOnSubmit()
test_validateWrongOnSubmit()
test_md5OnSubmit()