import { fileTypeMap } from "../../file"
import { icons } from "../../icons/icons"
import { convertBytes } from "../../utils"



/**
 * 创建上传文件组件
 * @param {Object} params - 参数对象
 * @param {string} params.fileName - 文件名
 * @param {string} params.fileType - 文件类型
 * @param {number} params.fileSize - 文件大小
 * @param {boolean} params.isUploading - 是否正在上传
 * @param {boolean} params.isShowCancelX - 是否显示取消上传的X
 * @param {string} params.icon - 文件图标
 * @param {string} params.preview_url - 预览链接
 * @param {boolean} params.preview - 是否预览
 * @param {Document} params.doc - 文档对象
 * @returns {HTMLDivElement} - 创建的文件上传组件
 */
function createUploadFileComponent(
    {
        fileName, 
        fileType = "",
        fileSize,
        isUploading = true, 
        isShowCancelX = true,
        icon = "",
        preview_url = "", 
        enablePreview = false,
        previewCallBackFunc = () => {},
        doc
    }:
    {
        fileName: string,
        fileType?: string,
        fileSize: number,
        isUploading?: boolean,
        isShowCancelX?: boolean,
        icon?: string,
        preview_url?: string,
        enablePreview?: boolean,
        previewCallBackFunc?: (args: any) => void,
        doc: Document
    }
): HTMLDivElement | null
// 返回null表示文件类型不支持

{   
    console.log("fileType##$$%%%%%%%", fileType)
    if (fileType === "") {
        fileType = fileName.split(".").pop() || ""
        if(!fileTypeMap[fileType]){
            return null
        }
    }
    // 整个上传文件组件
    const uploadFileComp = doc.createElement("div")
    uploadFileComp.classList.add("kimi_upload_file_comp_div")
    uploadFileComp.style.position = "relative"
    uploadFileComp.style.marginTop = "5px"
    uploadFileComp.style.height = "60px"
    uploadFileComp.style.width = "200px"
    uploadFileComp.style.display = "flex"
    uploadFileComp.style.padding = "3px"
    uploadFileComp.style.borderRadius = "8px"
    uploadFileComp.style.backgroundColor = "#fff"
    uploadFileComp.style.alignItems = "center"
    uploadFileComp.style.justifyContent = "center"
    uploadFileComp.style.fontFamily = "SimHei, PingFang SC, Microsoft YaHei, SimHei"
    uploadFileComp.style.fontWeight = "700"
    uploadFileComp.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)" 
    // uploadFileComp.style.backgroundColor = "#DF825A"

    // 创建一个总的容器
    const totalContainerDiv = doc.createElement("div")
    totalContainerDiv.classList.add("kimi_upload_file_comp_total_container_div")
    totalContainerDiv.style.height = "90%"
    totalContainerDiv.style.width = "90%"
    totalContainerDiv.style.display = "flex"
    totalContainerDiv.style.alignItems = "center"
    totalContainerDiv.style.justifyContent = "center"
    // totalContainerDiv.style.backgroundColor = "#green"

    // 创建一个图片外层容器
    const imageContainerDiv = doc.createElement("div")
    imageContainerDiv.classList.add("kimi_upload_file_comp_img_container_div")
    imageContainerDiv.style.height = "80%"
    imageContainerDiv.style.width = "30%"
    imageContainerDiv.style.display = "flex"
    imageContainerDiv.style.alignItems = "center"
    imageContainerDiv.style.justifyContent = "center"
    imageContainerDiv.style.position = "relative"
    // imageContainerDiv.style.backgroundColor = "#ccffee"
    // imageContainerDiv.style.marginLeft = "3%"

    // 创建一个图片加载元素
    const imgLoadingElement = doc.createElement("div")
    imgLoadingElement.classList.add("kimi_upload_file_comp_img_loading_div")
    imgLoadingElement.style.height = "50%"
    imgLoadingElement.style.width = "auto"
    imgLoadingElement.style.position = "absolute"
    imgLoadingElement.style.zIndex = "2"
    imgLoadingElement.style.display = "flex"
    imgLoadingElement.style.alignItems = "center"
    imgLoadingElement.style.justifyContent = "center"
    imgLoadingElement.innerHTML = isUploading ? `<img style="width: 20px; height: 20px;" src="${icons.uploadFileLoadingIcon}" alt="加载中" />` : ""


    // 创建一个图片背景元素
    const imgBackGroundElement = doc.createElement("img")
    imgBackGroundElement.classList.add("kimi_upload_file_comp_img_background_img")
    imgBackGroundElement.style.height = "90%"
    imgBackGroundElement.style.width = "auto"
    imgBackGroundElement.style.objectFit = "cover"
    imgBackGroundElement.style.position = "absolute"
    imgBackGroundElement.style.zIndex = "1"
    imgBackGroundElement.style.overflow = "hidden"
    
    imgBackGroundElement.src = isUploading ? icons.uploadFileBackGroundIcon : 
                    (fileTypeMap[fileType][1] === "image" ? 
                        (icon ? icon : icons.uploadFileBackGroundIcon) : 
                        icons[`${fileType}Icon` as keyof typeof icons])

    // 将图片加载元素和图片背景元素添加到图片外层容器
    imageContainerDiv.append(imgLoadingElement, imgBackGroundElement)


    // 创建一个文件信息外层容器
    const fileInfoContainerDiv = doc.createElement("div")
    fileInfoContainerDiv.classList.add("kimi_upload_file_comp_file_info_container")
    fileInfoContainerDiv.style.height = "80%"
    fileInfoContainerDiv.style.width = "70%"
    fileInfoContainerDiv.style.display = "flex"
    fileInfoContainerDiv.style.flexDirection = "column"
    fileInfoContainerDiv.style.alignItems = "center"
    fileInfoContainerDiv.style.justifyContent = "center"
    fileInfoContainerDiv.style.color = "#000"
    fileInfoContainerDiv.style.marginLeft = "5px"
    // fileInfoContainerDiv.style.backgroundColor = "green"

    // 展示文件名，过长则显示省略号
    const fileNameDisplayDiv = doc.createElement("div")
    fileNameDisplayDiv.classList.add("kimi_upload_file_comp_file_name_display_div")
    // fileNameDisplayDiv.style.display = "flex"
    fileNameDisplayDiv.style.alignItems = "center"
    // fileNameDisplayDiv.style.justifyContent = "center"
    fileNameDisplayDiv.style.color = "#000"
    fileNameDisplayDiv.style.height = "50%"
    fileNameDisplayDiv.style.width = "90%"
    fileNameDisplayDiv.style.fontWeight = "blod"
    fileNameDisplayDiv.style.overflow = "hidden"
    fileNameDisplayDiv.style.textOverflow = "ellipsis"
    fileNameDisplayDiv.style.whiteSpace = "nowrap"
    fileNameDisplayDiv.style.fontFamily = "PingFang SC, Microsoft YaHei, SimHei"
    fileNameDisplayDiv.style.fontWeight = "700"
    fileNameDisplayDiv.style.fontSize = "12px"
    fileNameDisplayDiv.textContent = fileName


    const fileTypeAndSizeDisplayDiv = doc.createElement("div")
    fileTypeAndSizeDisplayDiv.classList.add("kimi_upload_file_comp_file_and_type_size_display_div")
    fileTypeAndSizeDisplayDiv.style.fontSize = "12px"
    fileTypeAndSizeDisplayDiv.style.display = "flex"
    fileTypeAndSizeDisplayDiv.style.alignItems = "center"
    // fileTypeAndSizeDisplayDiv.style.justifyContent = "center"
    fileTypeAndSizeDisplayDiv.style.color = "#000"
    fileTypeAndSizeDisplayDiv.style.height = "50%"
    fileTypeAndSizeDisplayDiv.style.width = "90%"
    fileTypeAndSizeDisplayDiv.style.fontWeight = "400"
    fileTypeAndSizeDisplayDiv.textContent = `${fileType.toUpperCase()},  ${convertBytes(fileSize, 2)}`
    // fileTypeAndSizeDisplayDiv.style.backgroundColor = "blue"

    // 将文件名和文件类型大小展示元素添加到文件信息外层容器
    fileInfoContainerDiv.append(fileNameDisplayDiv, fileTypeAndSizeDisplayDiv)

    // // 创建一个取消按钮外层容器
    // const cancelXElementContainer = doc.createElement("div")
    // cancelXElementContainer.classList.add("kimi_upload_file_comp_cancel_x")
    // cancelXElementContainer.style.position = "relative"
    // cancelXElementContainer.style.width = "5%"
    // cancelXElementContainer.style.height = "100%"


    // 创建一个取消按钮
    const cancelXImgDiv = doc.createElement("div")
    cancelXImgDiv.classList.add("kimi-upload-file-comp-cancel-x-img-div")
    cancelXImgDiv.style.width = "20px"
    cancelXImgDiv.style.height = "20px"
    cancelXImgDiv.style.position = "absolute"
    cancelXImgDiv.style.right = "-6px"
    cancelXImgDiv.style.top = "-8px"
    cancelXImgDiv.style.cursor = "pointer"
    cancelXImgDiv.innerHTML = `<img style="width: 20px; height: 20px;" src="${icons.uploadFileCancelXIcon}" alt="取消" />`



    totalContainerDiv.append(imageContainerDiv, fileInfoContainerDiv)

    // 将总的容器添加到整个上传文件组件
    // uploadFileComp.append(totalContainerDiv, cancelXImgDiv)
    uploadFileComp.append(totalContainerDiv, cancelXImgDiv)
    if(!isShowCancelX) {
        cancelXImgDiv.style.display = "none"
    }
    
    // 如果启动预览,preview
    if(enablePreview){
        console.log("enablePreview",enablePreview)
        // 将preview_url复制到剪贴板
        // 添加点击文件监听
        uploadFileComp.style.cursor = "pointer"
        uploadFileComp.setAttribute("title", "点击获取预览链接")
        // 创建一个div隐藏用于存储preview_url
        const previewUrlDiv = doc.createElement("div")
        previewUrlDiv.classList.add("kimi-upload-file-comp-preview-url-div")
        previewUrlDiv.style.display = "none"
        previewUrlDiv.textContent = preview_url
        uploadFileComp.appendChild(previewUrlDiv)
        uploadFileComp.addEventListener("click", () => {
            console.log("复制！！！")
            // navigator.clipboard.writeText(preview_url)
            previewCallBackFunc?.({
                isok: true,
                previewUrl: previewUrlDiv.textContent
            })
        })
    }


    return uploadFileComp
}


export {
    createUploadFileComponent
}