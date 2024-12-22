import { kimiRequest } from "./https"

//创建一个chat
/**
 * 创建一个chat
 * @param accessToken 
 * @returns KimiResponse中的result: {id: string, ...}
 */
async function createNewChat({accessToken, endPoint, useMath=false}: 
    {
        accessToken: string, 
        endPoint: string,
        useMath?: boolean
    }): Promise<KimiResponse> {
    try{
        const url = `${endPoint}/api/chat`
        let body: Record<string, any> = {
            "name": "unknown",
            "is_example": false,
            "enter_method": "new_chat",
            "kimiplus_id": "kimi"
        }
        if(useMath){
            body["born_from"] = "math"
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "Host": "kimi.moonshot.cn",
        }
    
        const response = await kimiRequest({
            url: url,
            method: "POST",
            headers: headers,
            body: body
        })
        if(response.isok){
            return {isok: true, result: response.result, error: "", isTokenExpired: false}
        }else{
            return response
        }
    }catch(e:any){
        console.warn("chat.ts", " func createNewChat ", " line 7", e)
        return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
    }
}

// 发送消息
async function sendChatQueryMessage({chatId, 
        accessToken, 
        endPoint, 
        query, 
        agentMessageDiv,
        userMessageDiv,
        doc,
        sendMessageFunc
    }: 
    {
        chatId: string,
        accessToken: string, 
        endPoint: string,
        query: string,
        agentMessageDiv: HTMLDivElement,
        userMessageDiv: HTMLDivElement,
        doc: Document,
        sendMessageFunc: (message: string) => void
    }): Promise<KimiResponse> {
        if(chatId === ""){
            return {isok: false, result: {}, error: "chatId is empty", isTokenExpired: false}
        }
        // 发送消息, 流式返回
        const url = `${endPoint}/api/chat/${chatId}/query`
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "Host": "kimi.moonshot.cn",
        }
        const body = {
            "query": query
        }
        // const response = await sendMessageFunc(url, headers, body)
        return {isok: true, result: {}, error: "", isTokenExpired: false}

}

async function cancelChatAgentResponse({chatId, accessToken, endPoint, segmentId}: 
    {
        chatId: string,
        accessToken: string,
        endPoint: string,
        segmentId: string
    }): Promise<KimiResponse>{
        try{
            const url = `${endPoint}/api/chat/${chatId}/cancel`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Host": "kimi.moonshot.cn",
            }
            const body = {
                "segment_id": segmentId
            }
            const response = await kimiRequest({
                url: url,
                method: "POST",
                headers: headers,
                body: body
            })
            if(response.isok){
                return {isok: true, result: response.result, error: "", isTokenExpired: false}
            }else{
                return response
            }
        }catch(e:any){
            console.warn("chat.ts", " func cancelChatResponse ", " line 96", e)
            return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
        }

    }

async function getChatHistoryDetail({chatId, accessToken, endPoint, last=50}: 
    {
        chatId: string,
        accessToken: string,
        endPoint: string,
        last?: number,
    }): Promise<KimiResponse>{
        // https://kimi.moonshot.cn/api/chat/ctggt9u4t3onqqfm4u4g/segment/scroll
        try{
            const url = `${endPoint}/api/chat/${chatId}/segment/scroll`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Host": "kimi.moonshot.cn",
            }
            const body = {
                "last": last,
            }
            const response = await kimiRequest({
                url: url,
                method: "POST",
                headers: headers,
                body: body
            })
            if(response.isok){
                return {isok: true, result: response.result, error: "", isTokenExpired: false}
            }else{
                return response
            }
        }catch(e:any){
            console.warn("chat.ts", " func getChatHistoryDetail ", " line 132", e)
            return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
        }
    }


// 获取当前聊天的所有文件信息。kimi官方是发送scroll请求后会发送这个请求
async function getChatHistoryDetailAllFileRefsInfos({chatId, accessToken, endPoint}: 
    {
        chatId: string,
        accessToken: string,
        endPoint: string,
    }): Promise<KimiResponse>{
        // https://kimi.moonshot.cn/api/chat/ctfv93sn9070dfhkr4dg/segment/files
        try{
            const url = `${endPoint}/api/chat/${chatId}/segment/files`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Host": "kimi.moonshot.cn",
            }
            const response = await kimiRequest({
                url: url,
                method: "POST",
                headers: headers,
            })
            if(response.isok){
                return {isok: true, result: response.result, error: "", isTokenExpired: false}
            }else{
                return response
            }
        }catch(e:any){
            console.warn("chat.ts", " func getChatHistoryDetailFiles ", " line 167", e)
            return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
        }
    }

// 获取chat的信息
async function getChatInfo({chatId, accessToken, endPoint}: 
    {
        chatId: string,
        accessToken: string,
        endPoint: string,
    }): Promise<KimiResponse>{
        // https://kimi.moonshot.cn/api/chat/cthh6l76rtp90c25cea0
        try{
            const url = `${endPoint}/api/chat/${chatId}`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Host": "kimi.moonshot.cn",
            }
            const response = await kimiRequest({
                url: url,
                method: "GET",
                headers: headers,
            })
            console.log("response", response)
            if(response.isok){
                return {isok: true, result: response.result, error: "", isTokenExpired: false}
            }else{
                return response
            }
        }catch(e:any){
            console.warn("chat.ts", " func getChatInfo ", " line 222", e)
            return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
        }
    }

export {
    createNewChat,
    sendChatQueryMessage,
    cancelChatAgentResponse,
    getChatHistoryDetail,
    getChatHistoryDetailAllFileRefsInfos,
    getChatInfo 
}