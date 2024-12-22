import hljs from 'highlight.js';
import { encodeBase64 } from './utils';

export const markdown = require("markdown-it")({
    breaks: true, // 将行结束符\n转换为 <br> 标签
    xhtmlOut: true, // 使用 /> 关闭标签，而不是 >
    typographer: true,
    html: true,
    highlight: function (str: any, lang: any) {

        if (!lang || !hljs.getLanguage(lang)) {
            // lang = "bash"
            lang = "javascript"
        }
        try {
            const languageName = lang
            const highlightedCode = hljs.highlight(
                str,
                { language: languageName },
                // true
            ).value

            return '<div class="kimi-markdown-code-header">' +
                '<div class="language">' + languageName + '</div>' + `<div class="kimi-markdown-code-copy-button disabled">复制代码</div>` +
                '</div>' +
                '<div><pre class="hljs"><code>' +
                highlightedCode +
                // '</code></pre></div>' + `<div hidden="true" class="code-content">${encodeBase64(str)}</div>`;
                '</code></pre></div>' + `<div style="display:none" class="kimi-markdown-code-original-content">${encodeBase64(str)}</div>`;
        } catch (e: any) {
            // ztoolkit.log(e.toString())
        }
        // }

        return '<pre style="display:none" class="hljs"><code>' + "" + '</code></pre>';
        // return '<pre style="display:none" class="hljs"><code>' + markdown.utils.escapeHtml(str) + '</code></pre>';
        // return markdown.render(str);
        // return " "

    }


});
const mathjax3 = require('markdown-it-mathjax3');
markdown.use(mathjax3);


// class M{
//     public render(a:string){
//         return a
//     }
// }
// const markdown = new M()
// export {markdown}