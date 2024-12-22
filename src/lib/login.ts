import { kimiRequest } from "./https"
import QRCode from 'qrcode-svg';

const HEADERS = {
    // "Host": "kimi.moonshot.cn",
    "X-MSH-Session-ID": "None",
    // "sec-ch-ua-platform": "Windows",
    "x-msh-platform": "web",
    "X-MSH-Device-ID": "None",
    "R-Timezone": "None",
    "Content-Type": "application/json",
}


// 获取登录ID
/**
 * @returns 登录ID {id: ""}
 */
async function getLoginId({endPoint="https://kimi.moonshot.cn"}: 
    {
        endPoint?: string
    }): Promise<KimiResponse> {
    try{
        const url = `${endPoint}/api/user/wx/register_login`
        const headers = HEADERS
        const response = await kimiRequest({url, method: "POST", headers})
        if(response.isok){
            return response
        }else{
            return response
        }
    }catch(e: any){
        console.warn("login.ts", " func getLoginId ", " line 25 ", e)
        return { isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false }
    }
    

}

//检查是否登录
/**
 * @param loginId 登录ID
 * @param intervalID 定时器ID
 * @returns 登录结果 // {status: "create" | "login"}
 */
async function checkLogin({loginId, endPoint="https://kimi.moonshot.cn"}: 
    {
        loginId: string, 
        endPoint?: string
    }): Promise<KimiResponse> {
    try{
        const url = `${endPoint}/api/user/wx/register_login/${loginId}`
        const headers = HEADERS
        const response = await kimiRequest({url, method: "GET", headers})
        if(response.isok){
            if(response.result.status == "login"){
                
                return { isok: true, result: 
                    {
                        status: "login", 
                        access_token: response.result.access_token, 
                        refresh_token: response.result.refresh_token
                    }, 
                    error: "", 
                    isTokenExpired: false 
                }
            }
            return response
        }else{
            return response
        }
    }catch(e: any){
        console.warn("login.ts", " func checkLogin ", " line 46 ", e)
        return { isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false }
    }
}









function genQRCode({login_id, endPoint="https://kimi.moonshot.cn", doc}: 
    {
        login_id: string, 
        endPoint?: string,
        doc: Document
    }): HTMLDivElement | null {
    try{
        const url = `${endPoint}/wechat/mp/auth?id=${login_id}&device_id=None`
        const qrcodeSvg = new QRCode({
            content: url,
            padding: 2,
            width: 256,
            height: 256,
        })
        const qrcodeDiv = doc.createElement("div")
        qrcodeDiv.classList.add("qrcode-div")
        qrcodeDiv.style.width = "256px"
        qrcodeDiv.style.height = "256px"
        qrcodeDiv.style.backgroundColor = "#c92626"
        qrcodeDiv.style.borderRadius = "10px"
        qrcodeDiv.style.overflow = "hidden"
        qrcodeDiv.innerHTML = qrcodeSvg.svg().replace('<?xml version="1.0" standalone="yes"?>','')
        return qrcodeDiv
    }catch(e: any){
        console.warn("login.ts", " func genQRCode ", " line 98 ", e)
        return null
    }

}




export { 
    genQRCode,
    getLoginId, 
    checkLogin 
}