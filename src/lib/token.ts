import { kimiRequest } from "./https"

const HEADERS = {
    "Host": "kimi.moonshot.cn",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "X-MSH-Session-ID": "None",
    "sec-ch-ua-platform": "Windows",
    "x-msh-platform": "web",
    "X-MSH-Device-ID": "None",
    "R-Timezone": "None",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
    "Content-Type": "application/json",
}

async function getAccessToken(_refreshToken: string): Promise<KimiResponse> {
    try{
        const response = await __refreshAccessToken(_refreshToken)
        return response
    }catch(e:any){
        return {isok:true, result:{}, error:"", isTokenExpired:false}
    }
}

//刷新token
async function __refreshAccessToken(refreshToken: string): Promise<KimiResponse> {
    try{
        const url = "https://kimi.moonshot.cn/api/auth/token/refresh"
        const headers = {
            // "Host": "kimi.moonshot.cn",
            "Authorization": `Bearer ${refreshToken}`,
        }

        const response = await kimiRequest({
            url: url,
            method: "GET",
            headers: headers,
            body: {},
        })
        if(response.isok){
            
            const result = {
                accessToken: response.result.access_token,
                refreshToken: response.result.refresh_token,
            }
            return {isok: true, result: result, error: "", isTokenExpired: false}
        }else{
            if (response.isTokenExpired){
                return {isok: false, result: {}, error: "refreshToken is expired", isTokenExpired: true, isRefreshTokenExpired: true}
            }
            return response
        }
    }catch(e: any){
        return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
    }
}

export { 
    getAccessToken 
}
