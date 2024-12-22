/**文件上传逻辑 
 * 1. 获取Pre-Signed-Url
 * 2. 上传文件
 * 3. 查询是否上传成功
*/

import { KimiApi } from "./apis"
import { kimiRequest, kimiSendUint8ArrayFile } from "./https"
import { autoExpandUserInputTextArea } from "./uis/layoutUis/mainUi"
import { checkUserInputIsILLegel, parseFileNameAndExtension } from "./utils"

//建立一个文件和content-type对应表,主要用于非File类型上传(只知道文件名(后缀)和Uint8Array)
// 数组[0]是content-type, 
// 数组[1]是action(用于pre-sign-url的负载参数action),
const fileTypeMap: Record<string, [string, string]> = {
    "png": ["image/png", "image"],
    "jpg": ["image/jpeg", "image"],
    "jpeg": ["image/jpeg", "image"],
    "bmp": ["image/bmp", "image"],
    "pdf": ["application/pdf", "file"],
    "doc": ["application/msword", "file"],
    "docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "file"],
    "ppt": ["application/vnd.ms-powerpoint", "file"],
    "pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "file"],
    "xls": ["application/vnd.ms-excel", "file"],
    "xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file"],
    "csv": ["text/csv", "file"],
    "txt": ["text/plain", "file"],
}

// 首先获取Pre-Signed-Url
async function getUploadPreSignedUrl({filePath, accessToken, endPoint}: 
    {
        filePath: string, 
        accessToken: string, 
        endPoint: string
    }): Promise<KimiResponse> {
    try {
        console.log("accessToken", accessToken)
        const { fileName, fileExtension } = parseFileNameAndExtension(filePath)
        const url = `${endPoint}/api/pre-sign-url`
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            // "Host": "kimi.moonshot.cn",
        }
        const body = {
            "action": fileTypeMap[fileExtension][1],
            "name": fileName + "." + fileExtension
        }
        
        const response: KimiResponse = await kimiRequest({
            url: url,
            method: "POST",
            body: body,
            headers: headers,
        })
        console.debug("response", response)
        if (response.isok) {
            const result = response.result
            const fileType = fileTypeMap[fileExtension][1]
            
            const result2: KimiUploadFileType = {
                type: fileType,
                name: fileName + "." + fileExtension,
                object_name: result.object_name,
                chat_id: "",
                file_id: result.file_id
            }
            return { isok: true, result: {
                url: result.url, 
                checkBody: result2, 
                originalFileInfo: {
                    fileName: fileName + "." + fileExtension, 
                    fileExtension: fileExtension
                }
            }, 
                error: "", isTokenExpired: false }
        } else {
            return response
        }
    }catch(e:any){
        console.warn("file.ts", " func getUploadPreSignedUrl ", " line 75 ", e)
        return { isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false }
    }
    
    
}

// 上传文件
async function uploadFile(
    fileUint8Array: Uint8Array, 
    preSignedUrl: string, 
    fileExtension: string,
    timeout: number,
    abortFuncSetter?: (abortFunc: () => void) => void
): Promise<KimiResponse> {
    try {
        const hostName = new URL(preSignedUrl).host
        // console.log("uploadFile", fileUint8Array, preSignedUrl, fileExtension)
        const url = preSignedUrl
        const method = "PUT"
        const headers = {
            // "Host": hostName,
            "Content-Type": fileTypeMap[fileExtension][0],
            "Content-Length": fileUint8Array.byteLength.toString(),
        }
        
        const response = await kimiSendUint8ArrayFile({
            file: fileUint8Array, 
            url, 
            method, 
            headers,
            timeout: timeout,
            abortFuncSetter: abortFuncSetter
        })
        return response
    }catch(e: any){
        console.warn("file.ts", " func uploadFile ", " line 101 ", e)
        return { isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false }
    }
}


// 上传后需要通过/file接口查询上传结果
async function checkUploadResult({
    fileRequestParams, 
    accessToken, 
    endPoint,
    abortFuncSetter
}: {
    fileRequestParams: KimiUploadFileType,
    accessToken: string,
    endPoint: string,
    abortFuncSetter?: (abortFunc: () => void) => void
}): Promise<KimiResponse> {
    try {
        const url = `${endPoint}/api/file`
        const body = fileRequestParams
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            // "Host": "kimi.moonshot.cn",
        }
        
        const response: KimiResponse = await kimiRequest({
            url: url,
            method: "POST",
            body: body,
            headers: headers,
            abortFuncSetter: abortFuncSetter
        })
        if (response.isok) {
            return { isok: true, result: response.result, error: "", isTokenExpired: false }
        } else {
            return response
        }
    }catch(e: any){
        console.warn("file.ts", " func checkUploadResult ", " line 132 ", e)
        return { isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false }
    }
}

// 从剪贴板获取文件
async function registerGetFileFromClipboardListener(kimiApi: KimiApi): Promise<KimiResponse> {
    try{
        const userInputTextArea = kimiApi.kimiMainContainerDiv?.querySelector(".user-input-text-area") as HTMLTextAreaElement
        const selectFileButtonDiv = kimiApi.kimiMainContainerDiv?.querySelector(".select-file-button-div") as HTMLDivElement
        const sendMessageButtonDiv = kimiApi.kimiMainContainerDiv?.querySelector(".send-message-button-div") as HTMLDivElement
        userInputTextArea.addEventListener("paste", async (event: any) => {
            let clipboardData, pastedData;
            event.preventDefault();            
            // 使用事件对象的clipboardData对象获取剪切板数据
            clipboardData = event.clipboardData || window.Clipboard;
            if (clipboardData.types && clipboardData.types.length) {
              if (clipboardData.types.includes('text/plain')) {
                pastedData = clipboardData.getData('Text');
                userInputTextArea.value += pastedData;
              
              } else if (clipboardData.types.includes('Files') && clipboardData.files && clipboardData.files.length) {
                const result = await kimiApi.kimiUploadFile({
                    file: clipboardData.files[0]
                })
              }
            }
            autoExpandUserInputTextArea(userInputTextArea) //这里change事件没触发，手动执行一下autoExpand
            if (checkUserInputIsILLegel(userInputTextArea)) {
              sendMessageButtonDiv.classList.remove("disabled")
            } else {
              sendMessageButtonDiv.classList.add("disabled")
            }
    
          })
          return { isok: true, result: {}, error: "", isTokenExpired: false }
    }catch(e: any){
        console.warn("file.ts", " func getFileFromClipboard ", " line 163 ", e)
        return { isok: false, result: {}, error: JSON.stringify(e), isTokenExpired: false }
    }
}

export {
    fileTypeMap,
    getUploadPreSignedUrl,
    uploadFile,
    checkUploadResult,
    registerGetFileFromClipboardListener
}