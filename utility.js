var dict = {words: [], cat: [], subcat: [], catNames: [], subcatNames: []};
class searchResult {
    constructor(index, type, cat, subcat) {
        this.type = type;
        this.in = index;
        if(index % 2 == 0) this.out = index + 1;
        else this.out = index - 1;
        this.cat = cat;
        this.subcat = subcat;
        if(dict.subcatNames[this.subcat] == "Basic") {
            this.subcat = -1;
            subcat = -1;
        }
        if(cat == null) for(let i = 0; i < dict.cat.length; i++) {
            if(dict.cat[i] > index) {
                this.cat = i - 1;
                break;
            }
        }
        if(this.cat == null) this.cat = dict.cat.length - 1;
        if(subcat == null) for(let i = 0; i < dict.subcat.length; i++) {
            if(dict.subcat[i] > index) {
                this.subcat = i - 1;
                break;
            }
        }
        if(this.subcat == null) this.subcat = dict.subcat.length - 1;
    }
    toHTML() {
        let out = `<div class="result"><span class="SIn ${this.in % 2 == 0 ? "eng" : "spl"}">${dict.words[this.in]}</span><span class="SOut ${this.out % 2 == 0 ? "eng" : "spl"}">${dict.words[this.out]}</span>`;
        if(this.subcat != -1&&dict.subcatNames[this.subcat]!="Basic") out += `<span class="SSubCat">${dict.subcatNames[this.subcat]}</span>`;
        if(this.cat != -1&&dict.catNames[this.cat]!="Basic") out += `<span class="SCat">${dict.catNames[this.cat]}</span>`;
        return out + "</div>";
    }
    static sort(results) {
        let outResults = [];
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < results.length; j++) {
                if(results[j].type == i) outResults.push(results[j]);
            }
        }
        return outResults;
    }
}
function performSearch(text) {
    let results = [];
    let curCat = -1;
    let cursubCat = -1;
    //Words includes
    for(let i = 0; i < dict.words.length; i++) {
        if(dict.cat[curCat + 1] == i) curCat++;
        if(dict.subcat[cursubCat + 1] == i) cursubCat++;
        if(dict.words[i] == text) results.push(new searchResult(i, 0, curCat, cursubCat));
        else if(dict.words[i].startsWith(text)) results.push(new searchResult(i, 2, curCat, cursubCat));
        else if(dict.words[i].includes(text)) results.push(new searchResult(i, 4, curCat, cursubCat));
    }
    if(results.length > 100) return searchResult.sort(results);
    //Category name includes
    if(text.length != 2) for(let i = 0; i < dict.cat.length; i++) {
        let addType = 0;
        let name = dict.catNames[i].toLowerCase();
        if(name == text) addType = 1;
        else if(name.startsWith(text)) addType = 3;
        if(addType != 0) {
            let j;
            let max = dict.cat[i + 1];
            if(i + 1 >= dict.cat.length) max = dict.words.length;
            for(j = dict.cat[i]; j < max; j+=2) {
                results.push(new searchResult(j, addType, i, null));
            }
        }
    }
    if(results.length > 100) return searchResult.sort(results);
    //Subcategory name includes
    if(text.length != 2) for(let i = 0; i < dict.subcat.length; i++) {
        let addType = 0;
        let name = dict.subcatNames[i].toLowerCase();
        if(name == text) addType = 1;
        else if(name.startsWith(text)) addType = 3;
        if(addType != 0) {
            let j;
            let max = dict.subcat[i + 1];
            if(i + 1 >= dict.subcat.length) max = dict.words.length;
            for(j = dict.subcat[i]; j < max; j+=2) {
                results.push(new searchResult(j, addType, null, i));
            }
        }
    }
    return searchResult.sort(results);
}
onload = function () {
    dict = parseWords(wordsRaw);
}
function updateResults(text) {
    let out = document.getElementById("results");
    out.innerHTML = "";
    if(text.length < 2) return;
    let results = performSearch(text);
    let len = results.length;
    if(len > 100) len = 100;
    let outText = "";
    for(let i = 0; i < len; i++) {
        outText += results[i].toHTML();
    }
    out.innerHTML = outText;
}
function keyPress(event) {
    if(event.key == "s" && event.ctrlKey) {
        event.preventDefault();
        document.getElementById("search").value = "";
        updateResults("");
        document.getElementById("search").focus();
    }
}
function toDocument(includeIndex) {
    let out = "Splepian Language Specification\nCreated by: Benjamin Cates\n Inspired By: Joseph\nWord Count: " + dict.words.length / 2 + "\n\n";
    let i = 0;
    let catID = -1;
    let subcatID = -1;
    for(i = 0; i < dict.words.length; i += 2) {
        if(dict.cat[catID + 1] == i) {
            catID++;
            out += "\n\n" + dict.catNames[catID] + "\n"
        }
        if(dict.subcat[subcatID + 1] == i && dict.subcatNames[subcatID + 1] != "Basic") {

            subcatID++;
            out += "\n" + dict.subcatNames[subcatID] + "\n";
        }
        out += dict.words[i] + ": " + dict.words[i + 1] + "\n";
    }
    if(includeIndex) {

    }
    return out;

}