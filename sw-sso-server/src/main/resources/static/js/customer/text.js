/**
 * 文本格式化方法集
 */

sw.text = {};

sw.text.defaultLen = 5;//默认字符串长度
/**
 * 文本截断
 * @param {} len
 */
sw.text.trunk = function (src, len) {
    if (!len) len = sw.text.defaultLen;
    //alert(src.length)
    if (len >= src.length) {
        return src;
    }
    var newStr = src.substring(0, len);
    //alert('newStr='+newStr);
    return newStr + '...';
}
/**
 * 文本换行
 */
sw.text.wrap = function (src, len) {
    if (!len) len = sw.text.defaultLen;
    //alert(src.length)
    try {
        if (len >= src.length) {
            return src;
        }
        var newStr = '';
        for (var i = 0; src.length >= i * len; i++) {
            newStr += src.substring(i * len, (i + 1) * len);
            newStr += ' ';
        }
        //alert('newStrN='+newStr);
        return newStr;
    } catch (e) {
        return src;
    }
}
/**
 * 将字符串内所有文本用一个字符填充
 * @param {} src
 * @param {} sChar
 */
sw.text.fill = function (src, sChar) {
    return src.replace(/\w/g, sChar);
}