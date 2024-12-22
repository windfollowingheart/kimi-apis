import { kimiRequest } from "./https"


async function getChatHistoryList({endPoint, accessToken, offset=0, size=50}: 
    {
        endPoint: string, 
        accessToken: string,
        offset: number,
        size: number
    }): Promise<KimiResponse>{

    try{
        const url = `${endPoint}/api/chat/list`
        const headers = {
            "Host": "kimi.moonshot.cn",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
        const body = {
            "offset": offset,
            "size": size,
            "kimiplus_id": ""
        }
        
        const response: KimiResponse = await kimiRequest({
            url: url,
            method: "POST",
            body: body,
            headers: headers,
        })
        console.debug("response", response)
        return response
    }catch(e){
        return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
    }
    
}

async function editChatHistoryName({endPoint, accessToken, chatId, newName}: 
    {
        endPoint: string, 
        accessToken: string,
        chatId: string,
        newName: string
    }): Promise<KimiResponse>{
        try{
            const url = `${endPoint}/api/chat/${chatId}`
            const headers = {
                "Host": "kimi.moonshot.cn",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
            
            const body = {
                "name": newName
            }
            const response: KimiResponse = await kimiRequest({
                url: url,
                method: "PUT",
                body: body,
                headers: headers,
            })
            console.debug("response", response)
            return response

        }catch(e){
            return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
        }
    }


async function deleteChatHistory({endPoint, accessToken, chatId}: 
    {
        endPoint: string, 
        accessToken: string,
        chatId: string
    }): Promise<KimiResponse>{
        try{
            const url = `${endPoint}/api/chat/${chatId}`
            const headers = {
                "Host": "kimi.moonshot.cn",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
            
            
            const response: KimiResponse = await kimiRequest({
                url: url,
                method: "DELETE",
                headers: headers,
            })
            console.debug("response", response)
            return response

        }catch(e){
            return {isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false}
        }
    }



export {
    getChatHistoryList,
    editChatHistoryName,
    deleteChatHistory
}