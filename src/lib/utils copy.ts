import {Buffer} from "buffer"
/**
 * 将字节数转换为合适的单位
 * @param bytes 字节数
 * @param precision 精度
 * @returns 转换后的字符串
 */
function convertBytes(bytes: number, precision: number): string {
    let units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let number = bytes;
    let unitIndex = 0;
    // 循环直到字节数小于1024或者达到TB
    while (number >= 1024 && unitIndex < units.length - 1) {
        number /= 1024;
        unitIndex++;
    }
    // 根据所需的精度四舍五入到指定的小数位数
    return number.toFixed(precision) + ' ' + units[unitIndex];
}

/**
 * 解析文件名和扩展名
 * @param path 文件路径
 * @returns 文件名和扩展名
 */
function parseFileNameAndExtension(path: string): {
    fileName: string,
    fileExtension: string
} {
    const lastIndex = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
    const fileNameWithExtension = path.substring(lastIndex + 1);
    const dotIndex = fileNameWithExtension.lastIndexOf('.');
    const fileName = fileNameWithExtension.substring(0, dotIndex);
    const fileExtension = fileNameWithExtension.substring(dotIndex + 1);
    return {
        fileName,
        fileExtension
    };
}


// 去除kimi回答的联网搜索引用项
function removeOnlineCite(text: string) {
    // [^8^]
    // /data: (.+)/g
    const newText = text.replace(/\[\^\d+\^\]/g, '');
    return newText
}

// 函数用于将\\[ 和 \\] \( \)替换为$$和$
function replaceMathSymbols(text: string) {
    // 使用正则表达式替换特殊字符, 这里$在正则中有特殊含义的所以需要转义$$$$, \s匹配至少一个空格, \s*匹配0个或多个空格
    // text = text.replace(/\\\[\s/g, '$$$$').replace(/\s\\\]/g, '$$$$').replace(/\\\(\s/g, '$').replace(/\s\\\)/g, '$');
    text = text.replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$').replace(/\\\(\s/g, '$').replace(/\s\\\)/g, '$')
    .replace(/\\\(/g, '$').replace(/\\\)/g, '$');

    const reg1 = /\$(.*?)\$/g
    // let _text = text.match(reg1)
    // _text?.forEach((item: any) => {
    //     console.log("item111", item)
    //     // text = text.replace(item, item.replace(/\s/g, ''))
    //     text = text.replace(item, `$$${item.replace(/\$/g, '').trim()}$$`)
    // })
    text = text.replace(/\\bm/g, '')
    return text;
}




/**
 * 处理响应DIV中原始文本DIV中文笔中公式的特殊字符，替换特殊字符
 * 在浏览器中下列字符对应关系:
 * &amp; -> &
 * @param text 
 * @returns 
 */
function refineResponseText(text: string) {
    const textReplaceArr = ['&amp;']
    for (let i = 0; i < textReplaceArr.length; i++) {
        const element = textReplaceArr[i];
        text = text.replace(new RegExp(element, 'g'), '&')
    }
    return text
}

/**
 * 将mathml转换为latex
 * @param mathml 经过markdwon渲染后的html
 * @param originalText 原始文本
 * @returns 
 */
function mathMLToLaTeX(mathml: string, originalText: string) {
    // 正则表达式匹配<math>标签及其内容
    // const regex = /```([\s\S].*?)\$\$(.*?)\$\$([\s\S].*?)```/gi;
    // const regexHtml = /<math(.*?)display="block"(.*?)<\/math>/gi;
    const regexHtml = /<math(.*?)<\/math>/gi;
    // const regexOriginalText = /[^\`]\$\$(.*?)\$\$[^\`]/gi;
    const regexOriginalText = /\$\$(.*?)\$\$/gi;
    // const regexOriginalText = /\$(.*?)\$/gi;
    originalText = originalText.replace(/\n/g, '')
    const mathHtmlContent = mathml.match(regexHtml);
    const regexOriginalTextContent = originalText.match(regexOriginalText);
    // console.log("originalText", originalText)
    // console.log("mathHtmlContent", mathHtmlContent)
    // console.log("regexOriginalTextContent", regexOriginalTextContent)
    if(!mathHtmlContent || !regexOriginalTextContent){
        console.warn('utils.ts', 'func mathMLtoLaTeX', 'line 93', `没有匹配到${mathHtmlContent ? 'mathHtmlContent' : ''}和${regexOriginalTextContent ? 'regexOriginalTextContent' : ''}`, mathHtmlContent, regexOriginalTextContent)
        // return mathml
    }
    if (mathHtmlContent?.length !== regexOriginalTextContent?.length) {
        console.warn('utils.ts', 'func mathMLtoLaTeX', 'line 100', `匹配到的数量不一致`, mathHtmlContent?.length, regexOriginalTextContent?.length)
        // return mathml
    }
    if (mathHtmlContent && regexOriginalTextContent) {
        // ztoolkit.getGlobal("alert")("匹配到了")
        for (let i = 0; i < mathHtmlContent.length; i++) {
            // console.log("mathContent[i]", mathHtmlContent[i])
            // const mathcode = mathContent[i].replace(/\$\$/g, '')
            if (mathHtmlContent[i].includes('display="block"') &&  regexOriginalTextContent[0]) {
                const _regexOriginalTextContent = regexOriginalTextContent[0].match(/\$\$(.*?)\$\$/gi)
                regexOriginalTextContent.shift()
                // console.log("_regexOriginalTextContent", _regexOriginalTextContent)

                if (_regexOriginalTextContent) {
                    const _regexOriginalTextContent_1 = _regexOriginalTextContent[0].replace(/\$\$/g, '')
                    // console.log("_regexOriginalTextContent_1", _regexOriginalTextContent_1)
                    mathml = mathml.replace(mathHtmlContent[i], `<pre class="math">${_regexOriginalTextContent_1}</pre>`);
                    mathml = refineResponseText(mathml)
                }

            } else {
                // mathml = mathml.replace(mathContent[i], `<code>${covertMd}</code>`);
                let _miSub = mathHtmlContent[i].match(/<msub(.*?)<\/msub>/gi)
                if(_miSub){
                    _miSub.forEach((item: any) => {
                        let _miDom = item.match(/<mi(.*?)<\/mi>/gi)
                        let _mnDom = item.match(/<mn(.*?)<\/mn>/gi)   
                        console.log("_miDom", _miDom)
                        console.log("_mnDom", _mnDom)
                        if(_miDom){
                            mathml = mathml.replace(_miDom[0], `<strong><em>${_miDom[0].replace(/<mi>/g, '').replace(/<\/mi>/g, '')}</em></strong>`)
                        }
                        if(_mnDom){
                            mathml = mathml.replace(_mnDom[0], `<sub>${_mnDom[0].replace(/<mn>/g, '').replace(/<\/mn>/g, '')}</sub>`)
                        }
                    })
                    let _miDom = mathHtmlContent[i].match(/<mi(.*?)<\/mi>/gi)
                    let _mnDom = mathHtmlContent[i].match(/<mn(.*?)<\/mn>/gi)   
                    console.log("_miDom", _miDom)
                    console.log("_mnDom", _mnDom)
                    if(_miDom){
                        mathml = mathml.replace(_miDom[0], `<strong><em>${_miDom[0].replace(/<mi>/g, '').replace(/<\/mi>/g, '')}</em></strong>`)
                    }
                    if(_mnDom){
                        mathml = mathml.replace(_mnDom[0], `<sub>${_mnDom[0].replace(/<mn>/g, '').replace(/<\/mn>/g, '')}</sub>`)
                    }
                }
            }
        }
    }
    return mathml
}

// 函数用于递归地删除所有SVG元素, 因为markdown-it-mathjax3 会渲染svg和mathml,这样就导致显示两个公式, 需要删除svg元素
function removeSVGElements(node: any) {
    // 遍历所有子节点
    Array.from(node.childNodes).forEach((child: any) => {
        // 如果子节点是SVG元素，则从DOM中移除
        if (child.nodeName === 'svg'.toUpperCase() || child.nodeName === 'svg') {
            node.removeChild(child);
        } else {
            // 如果子节点还有其他子节点，递归调用此函数
            removeSVGElements(child);
        }
    });
}

// Node.js环境中将字符串转换为Base64编码
function encodeBase64(str: string) {
    return Buffer.from(str).toString('base64');
    // return btoa(str)
}

// Node.js环境中将Base64编码转换回字符串
function decodeBase64(base64Str: string) {
    return Buffer.from(base64Str, 'base64').toString();
    // return atob(base64Str)
}

// 检查输入是否合法
function checkUserInputIsILLegel(userInputTextArea: HTMLTextAreaElement){
    if (userInputTextArea.value.trim().length != 0) {
       return true
    } else {
    return false
    }
}

function formatDateTime() {
    const date = new Date();
    const year = date.getFullYear(); // 获取年份
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，月份从0开始，所以加1
    const day = date.getDate().toString().padStart(2, '0'); // 获取日期
    const hours = date.getHours().toString().padStart(2, '0'); // 获取小时
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 获取分钟
    const seconds = date.getSeconds().toString().padStart(2, '0'); // 获取秒

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回格式化的日期字符串
}



export {
    convertBytes,
    parseFileNameAndExtension,
    removeOnlineCite,
    replaceMathSymbols,
    mathMLToLaTeX,
    removeSVGElements,
    encodeBase64,
    decodeBase64,
    refineResponseText,
    checkUserInputIsILLegel,
    formatDateTime
}