import { icons } from "../../icons/icons"
import { createMaskDiv } from "./maskUi"


function createLoginDiv({doc, qrcodeDiv}:{
    doc: Document,
    qrcodeDiv?: HTMLDivElement
}) {

    //最外层容器
    const loginContainerDiv = doc.createElement("div")
    loginContainerDiv.classList.add("login-container-div")
    loginContainerDiv.style.position = "absolute"
    loginContainerDiv.style.top = "0"
    loginContainerDiv.style.left = "0"
    loginContainerDiv.style.right = "0"
    loginContainerDiv.style.bottom = "0"
    loginContainerDiv.style.zIndex = "1"

    // 最外层包裹二维码的容器, 用于居中
    const qrcodeContainerDiv = doc.createElement("div")
    qrcodeContainerDiv.classList.add("qrcode-container-div")
    qrcodeContainerDiv.style.position = "absolute"
    qrcodeContainerDiv.style.top = "50%"
    qrcodeContainerDiv.style.left = "50%"
    qrcodeContainerDiv.style.transform = "translate(-50%, -50%)"
    qrcodeContainerDiv.style.display = "flex"
    qrcodeContainerDiv.style.flexDirection = "column"
    qrcodeContainerDiv.style.alignItems = "center"
    qrcodeContainerDiv.style.justifyContent = "center"
    qrcodeContainerDiv.style.backgroundColor = "rgba(0, 0, 0, 0)"
    qrcodeContainerDiv.style.width = "256px"
    qrcodeContainerDiv.style.height = "256px"
    qrcodeContainerDiv.style.padding = "1px"
    qrcodeContainerDiv.style.zIndex = "30"

    // 创建一个mask
    const qrMaskDiv = createMaskDiv(doc)
    qrMaskDiv.classList.add("qrcode-mask-div")

    // 创建一个提示Container
    const loginTipContainerDiv = doc.createElement("div")
    loginTipContainerDiv.classList.add("login-tip-container-div")
    loginTipContainerDiv.style.position = "absolute"
    loginTipContainerDiv.style.transform = "translate(-50%, calc(-50% - 190px))"
    loginTipContainerDiv.style.top = "50%"
    loginTipContainerDiv.style.left = "50%"
    loginTipContainerDiv.style.width = "100%"
    loginTipContainerDiv.style.display = "flex"
    loginTipContainerDiv.style.alignItems = "center"
    loginTipContainerDiv.style.justifyContent = "center"
    loginTipContainerDiv.style.zIndex = "20"

    // 创建一个提示文字Div
    const loginTipTextDiv = doc.createElement("div")
    loginTipTextDiv.classList.add("login-tip-text-div")
    loginTipTextDiv.style.fontSize = "20px"
    loginTipTextDiv.style.fontWeight = "700"
    loginTipTextDiv.style.fontFamily = "SimHei, sans-serif"
    loginTipTextDiv.style.color = "white"
    loginTipTextDiv.style.textAlign = "center"
    loginTipTextDiv.style.width = "auto"
    loginTipTextDiv.style.margin = "0 10px"
    loginTipTextDiv.textContent = "请使用微信扫描二维码登录"

    // 创建微信图标Div
    const wexinLogoIconDiv = doc.createElement("div")
    wexinLogoIconDiv.classList.add("weixin-logo-icon-div")
    wexinLogoIconDiv.style.width = "auto"
    wexinLogoIconDiv.style.height = "50px"
    wexinLogoIconDiv.style.display = "flex"
    wexinLogoIconDiv.style.alignItems = "center"
    // wexinLogoIconDiv.style.backgroundImage = icons.weixinLogoIcon
    wexinLogoIconDiv.innerHTML = `<img style="width: auto; height: 80%;" src="${icons.weixinLogoIcon}" alt="微信" />`

    // 创建kimi图标Div
    const kimiLogoIconDiv = doc.createElement("div")
    kimiLogoIconDiv.classList.add("kimi-logo-icon-div")
    kimiLogoIconDiv.style.width = "auto"
    kimiLogoIconDiv.style.height = "50px"
    kimiLogoIconDiv.style.display = "flex"
    kimiLogoIconDiv.style.alignItems = "center"
    // kimiLogoIconDiv.style.backgroundImage = icons.kimiLogoIcon
    kimiLogoIconDiv.innerHTML = `<img style="width: auto; height: 80%;" src="${icons.kimiLogoIcon}" alt="Kimi" />`

    // 将提示文字Div和微信图标Div、kimi图标Div添加到提示Container中
    loginTipContainerDiv.append( wexinLogoIconDiv, loginTipTextDiv, kimiLogoIconDiv)
    

    // loginContainerDiv.append(qrcodeContainerDiv, qrMaskDiv)
    loginContainerDiv.append(qrMaskDiv, qrcodeContainerDiv, loginTipContainerDiv)
    
    if(qrcodeDiv){
        qrcodeContainerDiv.appendChild(qrcodeDiv)
        qrcodeDiv.style.zIndex = "20"
    }
    
    return loginContainerDiv
}

export {
    createLoginDiv
}