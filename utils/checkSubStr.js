
function checkSubStr(s2, s1) {
    s1= s1.toLowerCase();
    s2= s2.toLowerCase();
    var counter = 0; // pointing s2
    var i = 0;
    for (; i < s1.length; i++) {
        if (counter == s2.length) {
            break;
        }
        if (s2[counter] == s1[i]) {
            counter++;
        }
        else {
            // Special case where character preceding
            // the i'th character is duplicate
            if (counter > 0) {
                i -= counter;
            }
            counter = 0;
        }
    }

    return counter < s2.length ? -1 : i - counter;
}

// console.log(checkSubStr('p', 'Python'));
module.exports = checkSubStr;