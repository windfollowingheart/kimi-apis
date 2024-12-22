
// 网页版kimi的文件上传不是表单格式,而是binary格式,所以不需要封装成File对象
function kimiSendUint8ArrayFile({file, url, method, headers, timeout = 10000, abortFuncSetter}:
    {
        file: Uint8Array,
        url: string,
        method: string,
        headers: Record<string, any>,
        timeout?: number,
        abortFuncSetter?: (abortFunc: () => void) => void
    }
): Promise<KimiResponse> {
    let isEnd = false
    return new Promise((resolve, reject) => {

        try{
            
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.timeout = timeout;
            for (let key in headers) {
                xhr.setRequestHeader(key, headers[key])
            }
    
            xhr.upload.onprogress = function (e) {
                console.log(xhr.upload)
            }
            xhr.ontimeout = function (e) {
                console.log("timeout了")
                reject({ isok: false, result: {}, error: "请求超时", isTokenExpired: false });
            }
            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    isEnd = true
                    resolve({ isok: true, result: {file: xhr.responseText}, error: "", isTokenExpired: false });
                } else {
                    isEnd = true
                    const error = JSON.parse(xhr.responseText)
                    console.log("error###@@", error.error_type)
                    if(error.error_type === "auth.token.invalid" || error.error_type === "auth.token.empty"){
                        reject({ isok: false, result: {}, error: error, isTokenExpired: true });
                    }else{
                        reject({ isok: false, result: {}, error: error, isTokenExpired: false });
                    }
                }
            };
            xhr.onerror = function (e) {
                
                isEnd = true
                reject({ isok: false, result: {}, error: e.toString(), isTokenExpired: false });
            };
            xhr.send(file);

            // 设置 abortFunc 以便在外部调用
            if (abortFuncSetter) {
                abortFuncSetter(() => {
                    
                    if(!isEnd){
                        // console.log("xhr.abort()")
                        xhr.abort();
                        reject({ isok: false, result: {}, error: "请求被手动中止", isTokenExpired: false });    
                    }else{
                        resolve({ isok: true, result: {}, error: "请求已结束", isTokenExpired: false });
                    }
                });
            }
        }catch(e: any){
            
            isEnd = true
            reject({ isok: false, result: {}, error: e.toString(), isTokenExpired: false });
        }
        
    });
}




function kimiStreamRequest(
    {url, method, body, headers, 
        responseSpeed = 10, timeout = 5000,
        abortFuncSetter
    }:
    {
        url: string, 
        method: string, 
        body: Record<string, any>,
        headers: Record<string, any>,
        responseSpeed?: number,
        timeout?: number,
        abortFuncSetter?: (abortFunc: () => void) => void
    }
): Promise<KimiResponse> {
    return new Promise((resolve, reject) => {
        let yieldIndex: number = 0
        let buffer: Record<string, any>[] = []; // 用于存放已接收但还未完全处理的数据，不断拼接新数据进来
        let isEnd = false
        
        let allString :string = ""

        try{
            
            

            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.timeout = timeout;
            for (let key in headers) {
                xhr.setRequestHeader(key, headers[key])
            }
            xhr.ontimeout = function (e) {
                console.log("timeout了")
                reject({ isok: false, result: {}, error: "请求超时", isTokenExpired: false });
            }

            xhr.onprogress = function (e) {
                
                const text = xhr.responseText;
                const newTextArr = text.match(/data: (.+)/g)
                // 当有新的json数据时, 将数据推入buffer
                if (newTextArr && newTextArr.length > yieldIndex) {
                    for(let i = yieldIndex; i < newTextArr.length; i++){
                        buffer.push(JSON.parse(newTextArr[i].replace("data: ", '')))
                    }
                    yieldIndex = newTextArr.length
                }
            };
            
    
            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    isEnd = true
                    resolve({ isok: true, result: {file: xhr.responseText}, error: "", isTokenExpired: false });
                } else {
                    const error = JSON.parse(xhr.responseText)
                    buffer.push({"error": error});
                    isEnd = true
                    if(error.error_type === "auth.token.invalid" || error.error_type === "auth.token.empty"){
                        reject({ isok: false, result: {}, error: error, isTokenExpired: true });
                    }else{
                        reject({ isok: false, result: {}, error: error, isTokenExpired: false });
                    }
                }
                
            };
            xhr.onerror = function (e) {
                isEnd = true;
                // buffer.push({error: e.toString()})
                buffer.push({"event":"cmpl","text":"🚫网络请求错误,请检查网络", "error": "网络请求错误"})
                
            };
            xhr.send(JSON.stringify(body));

            // 设置 abortFunc 以便在外部调用
            if (abortFuncSetter) {
                abortFuncSetter(() => {
                    if (!isEnd) {
                        isEnd = true;
                        xhr.abort();
                        reject({ isok: false, result: {}, error: "请求被手动中止", isTokenExpired: false });
                    }
                });
            }
    
            // 返回一个generator, 用于处理stream数据
            const generator = (async function* () {
                // 轮询buffer, 当有新数据时, 将数据推入buffer, 当buffer为空时, 等待新数据, 直到isEnd为true
                while(!isEnd || buffer.length > 0){
                    if(buffer.length > 0){
                        yield unifiedOutputFormat(buffer.shift() as Record<string, any>)
                        // console.log(111)
                    }
                    await new Promise(resolve => setTimeout(resolve, responseSpeed));
                }
            })();
            resolve({ isok: true, result: {stream: generator}, error: "", isTokenExpired: false });
        }catch(e: any){
            isEnd = true
            reject({ isok: false, result: {}, error: e.toString(), isTokenExpired: false });
        }
    });
}



// 抽象出统一接口发送kimi请求, 返回KimiResponse, 不适用于stream请求, 不能用于file上传
async function kimiRequest({url, method, body, headers, timeout = 10000, abortFuncSetter}:
    {
        url: string, 
        method: string, 
        body?: Record<string, any>, 
        headers: Record<string, any>,
        timeout?: number,
        abortFuncSetter?: (abortFunc: () => void) => void
    }
): Promise<KimiResponse> {
    return new Promise((resolve, reject) => {

        let isEnd = false
        try{
            
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.timeout = timeout;
            for (let key in headers) {
                xhr.setRequestHeader(key, headers[key])
            }

            xhr.ontimeout = function (e) {
                console.log("timeout了")
                reject({ isok: false, result: {}, error: "请求超时", isTokenExpired: false });
            }

            xhr.onload = function (e) {
                try{
                    isEnd = true
                    if (xhr.status === 200) {
                        resolve({ isok: true, result: JSON.parse(xhr.responseText), error: "", isTokenExpired: false })
                    } else {
                        const error = JSON.parse(xhr.responseText)
                        if(error.error_type === "auth.token.invalid" || error.error_type === "auth.token.empty"){
                            console.warn("https.ts", " func kimiRequest ", " line 134 ", error)
                            isEnd = true
                            const errorStr = JSON.stringify(error)
                            console.log("errorStr", errorStr)
                            reject({ isok: false, result: {}, error: errorStr, isTokenExpired: true });
                        }else{
                            console.warn("https.ts", " func kimiRequest ", " line 137 ", error)
                            isEnd = true
                            const errorStr = JSON.stringify(error)
                            console.log("errorStr", errorStr)
                            reject({ isok: false, result: {}, error: errorStr, isTokenExpired: false });
                        }
                    }
                }catch(e:any){
                    const errorStr = JSON.stringify(e)
                    reject({ isok: false, result: {}, error: errorStr, isTokenExpired: false });
                }
            }
            xhr.onabort = function (e){
                try{
                    console.warn("https.ts", " func kimiRequest ", " line 279 ", "请求abort")
                }catch(e:any){
                    console.warn("https.ts", " func kimiRequest ", " line 281 ", "请求abort异常")
                }
            }
            xhr.onerror = function (e) {
                console.log("kimiRequest xhr.onerror",e)
                try{
                    console.warn("https.ts", " func kimiRequest ", " line 143 ", e)
                    isEnd = true
                    reject({ isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false })
                }catch(e:any){
                    reject({ isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false })
                }
            }
            if(body){
                xhr.send(JSON.stringify(body));
            }else{
                xhr.send();
            }
            // 设置 abortFunc 以便在外部调用
            if (abortFuncSetter) {
                abortFuncSetter(() => {
                    try{
                        if (!isEnd) {
                            isEnd = true;
                            xhr.abort();
                            reject({ isok: false, result: {}, error: "请求被手动中止", isTokenExpired: false });
                        }
                    }catch(e:any){
                        reject({ isok: false, result: {}, error: "请求被手动中止", isTokenExpired: false });
                    }
                });
            }
        }catch(e:any){
            isEnd = true
            console.warn("https.ts", " func kimiRequest ", " line 151 ", e)
            const errorStr = JSON.stringify(e)
            reject({ isok: false, result: {}, error: errorStr, isTokenExpired: false });
        }
    })
}

function unifiedOutputFormat(data: Record<string, any>): Record<string, any>{
    if(data.event === "cmpl" && data.text){
        return data
    }else if(data.error && data.error.message){
        return {"event":"cmpl","text":`🚫 ${data.error.message}`, "error": data.error.message}
    }else{
        return data
    }
}

export {
    kimiSendUint8ArrayFile,
    kimiRequest,
    kimiStreamRequest
}