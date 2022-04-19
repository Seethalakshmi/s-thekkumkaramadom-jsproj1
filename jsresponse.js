
//fetch('http://jsontest.com')

const ipUrl='http://ip.jsontest.com/'
const headerUrl = 'http://headers.jsontest.com/'
const dateTimeUrl = 'http://date.jsontest.com'
let validateUrl = 'http://validate.jsontest.com/'
let md5Url = 'http://md5.jsontest.com/'

//calling fetch api
async function getResponse(url){
    const response = await fetch(url)
    return await response.json()
}
//this is main part
async function main(){
    try{
        await getResponse(ipUrl).then(ipRes => document.getElementById('ip_id').innerHTML= ipRes.ip)//getting ip address here
        await getResponse(headerUrl).then(headRes => document.getElementById('header_id').innerHTML = JSON.stringify(headRes))//getting headers here
        //calls setInterval for updating every second
        setInterval( function(){getResponse(dateTimeUrl).then(dateTimeRes=> document.getElementById('datetime_id').innerHTML= 'The date and time that  updates every second is '+dateTimeRes.date+' '+dateTimeRes.time)},1000)
    }catch (err){
        console.log("Got an error : "+err.message)
    }
}

function onSubmit(){
    try{
        let validateJsonUrl = new URL(validateUrl)
        //combines the url and user input and validating the user input
        validateJsonUrl.searchParams.append('json',document.getElementById('user_input').value )
        console.log("%cComplete URL ---"+validateJsonUrl,'Color:blue')
        getResponse(validateJsonUrl).then(validateRes => {
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
        getResponse(md5populateUrl).then(md5Res => document.getElementById('md5_result').innerHTML = md5Res.md5)
    }catch (err) {
        console.log("Got an error on populating md5 : "+err.message)
    }

}

function test_getIPResponse(){
    getResponse(ipUrl).then(ipJson => test_log(JSON.stringify(ipJson).indexOf('ip')!==-1, 'IP address '))
    //getResponse(ipUrl).then(ipJson => test_log(JSON.stringify(ipJson).indexOf('ip')!=-1, 'IP address '))
}

function test_getHeaderResponse(){
    getResponse(headerUrl).then(headerJson => {
        //tests for each header attributes
        test_log(JSON.stringify(headerJson).indexOf('Accept')!==-1, 'Header-Accept ')
        test_log(JSON.stringify(headerJson).indexOf('X-Cloud-Trace-Context')!==-1, 'Header-X-Cloud-Trace-Context ')
        test_log(JSON.stringify(headerJson).indexOf('traceparent')!==-1, 'Header-traceparent ')
        test_log(JSON.stringify(headerJson).indexOf('User-Agent')!==-1, 'Header-User-Agent ')
        test_log(JSON.stringify(headerJson).indexOf('Referer')!==-1, 'Header-Referer ')
        test_log(JSON.stringify(headerJson).indexOf('Host')!==-1, 'Header-Host ')
        test_log(JSON.stringify(headerJson).indexOf('Accept-Language')!==-1, 'Header-Accept-Language ')
    })
}

function test_getDateTimeResponse(){
    getResponse(dateTimeUrl).then(dateTimeJson => {
        //tests for each date-time attributes
        test_log(JSON.stringify(dateTimeJson).indexOf('date')!==-1, 'Date & Time-Date ')
        test_log(JSON.stringify(dateTimeJson).indexOf('time')!==-1, 'Date & Time-Time ')
        test_log(JSON.stringify(dateTimeJson).indexOf('milliseconds_since_epoch')!==-1, 'Date & Time-milliseconds_since_epoch ')
    })
}
//calls a single function for validation
function test_log(valid, msg){
    if(valid)
        console.log(msg + 'Passed')
    else
        console.log(msg + 'Failed')
}
//tests for right JSON value
function test_validateRightOnSubmit() {
    const testValidateJsonUrl1 = 'http://validate.jsontest.com/?json={"name":"Seetha"}'
    getResponse(testValidateJsonUrl1).then(testValJson1 => {
        let testValString1 = JSON.stringify(testValJson1, ['validate'])
        if (testValString1.includes('true'))
            console.log("Right JSON Validation Passed")
        else
            console.log("Right JSON Validation Failed")

    })
}
//tests for wrong JSON value
function test_validateWrongOnSubmit(){
    const testValidateJsonUrl2 = 'http://validate.jsontest.com/?json={"name":"Seetha"'
    getResponse(testValidateJsonUrl2).then(testValJson2 => {
        let testValString2 = JSON.stringify(testValJson2, ['validate'])
        if (testValString2.includes('false'))
            console.log("Wrong JSON Validation Passed")
        else
            console.log("Wrong JSON Validation Failed")
    })
}
//checks for presence of md5 property
function test_md5OnSubmit(){
    const testMD5Url = 'http://md5.jsontest.com/?text=hello'
    getResponse(testMD5Url).then(testMD5response => test_log(JSON.stringify(testMD5response).indexOf('md5')!==-1, 'md5 '))
}
main()
//calling test functions
test_getIPResponse()
test_getHeaderResponse()
test_getDateTimeResponse()
test_validateRightOnSubmit()
test_validateWrongOnSubmit()
test_md5OnSubmit()