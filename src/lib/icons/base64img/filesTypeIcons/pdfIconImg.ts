const pdfIconImg = "data:image/png;base64,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"

export {
    pdfIconImg
}
