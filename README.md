

<div align="center">

# Kimi Apis
*the api of kimi llm model*

</div>

## How to use

```js
const kimiApi = new KimiApi({
    chatId: chatId,
    accessToken: accessToken,
    refreshToken: refreshToken,
})
```

*create UI*
```js
const kimiMainContainerDiv = kimiApi.kimiCreateMainUi({})
```
<div align="center">
<img src="asserts/1.png" width="100%" />
</div>

*chat history*
```js
kimiApi.kimiInitChatHistory()
```
<div align="center">
<img src="asserts/1.gif" width="100%" />
</div>


## Projects use Kimi Apis
[Zotero Paper Agent](https://github.com/windfollowingheart/zotero-paper-agent)

<div align="center">
    <img src="asserts/zotero-paper-agent.png"/>
</div>

