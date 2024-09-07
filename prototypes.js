Array.prototype.random = function() {
    return this[Math.floor(Math.random()*this.length)];
}

String.prototype.removeWord = function(...words) {
    return this.split(" ").filter(piece => !words.includes(piece)).join(" ")
}
String.prototype.removeSimbol = function(...simbols) {
    return this.split("").filter(piece => !simbols.includes(piece)).join("")
}

String.prototype.remove = function(...data) {
    const simbols = []
    const words = []

    for (const key of data) {
        if (key.length == 1) {
            simbols.push(key)
        } else {
            words.push(key)
        }
    }

    return this.removeSimbol(...simbols).removeWord(...words)
}
String.prototype.replaceWord = function(word,replace_word) {
    return this.split(" ").map(piece => piece === word ? replace_word : piece).join(" ")
}



module.exports = undefined