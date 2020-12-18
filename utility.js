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
        if(this.subcat != -1 && dict.subcatNames[this.subcat] != "Basic") out += `<span class="SSubCat">${dict.subcatNames[this.subcat]}</span>`;
        if(this.cat != -1 && dict.catNames[this.cat] != "Basic") out += `<span class="SCat">${dict.catNames[this.cat]}</span>`;
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
    text = text.toLowerCase();
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
            for(j = dict.cat[i]; j < max; j += 2) {
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
            for(j = dict.subcat[i]; j < max; j += 2) {
                results.push(new searchResult(j, addType, null, i));
            }
        }
    }
    return searchResult.sort(results);
}
onload = function () {
    dict = parseWords(wordsRaw);
    document.getElementById("search").value = "Search...";
    console.log("Visit https://github.com/Unfit-Donkey/Splepian-Language-Utility for more information.");
}
function updateResults(text) {
    let out = document.getElementById("results");
    if(text.length == 0) {
        out.innerHTML = "Press Ctrl+S to search, or Ctrl+H for help.";
        return;
    }
    out.innerHTML = "";
    if(text.length < 2) {
        out.innerHTML = "Type two or more characters.";
        return;
    }
    if(text.startsWith("help")) {
        openHelp(text.split(" ")[1], false);
        document.getElementById("help").style.display = "block";
        return;
    }
    else {
        document.getElementById("help").style.display = "none";
    }
    let results = performSearch(text);
    let len = results.length;
    if(len == 0) {
        out.innerHTML = "No results ¯\\_(ツ)_/¯";
        return;
    }
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
    if(event.key == "h" && event.ctrlKey) {
        event.preventDefault();
        document.getElementById("search").value = "help";
        updateResults("help");
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
function search(text) {
    updateResults(text);
    document.getElementById("search").value = text;
}
function generateIndex(useLinks) {
    let out = "<h2>Index</h2><ul>";
    let catInd = -1;
    let subcat = 0;
    for(; subcat < dict.subcat.length; subcat++) {
        while(dict.subcat[subcat] > dict.cat[catInd + 1] && catInd != dict.cat.length - 1) {
            catInd++;
            out += "</ul><h4>"
            if(useLinks) out += "<a href='javascript:search(\"" + dict.catNames[catInd] + "\")'>"
            out += dict.catNames[catInd];
            if(useLinks) out += "</a>";
            out += "</h4><ul>";
        }
        let name = dict.subcatNames[subcat];
        if(name == "Basic") continue;
        out += "<li>"
        if(useLinks) out += "<a href='javascript:search(\"" + dict.subcatNames[subcat] + "\")'>";
        out += dict.subcatNames[subcat];
        if(useLinks) out += "</a>"
        out += "</li>";
    }
    return out + "</ul>";
}
function generateWordList() {
    let out = "<h2>Splepian Language Specification</h2><br>Created by: Benjamin Cates<br>Inspired By: Joseph<br>Word Count: " + dict.words.length / 2 + "<br><br>";
    let i = 0;
    let catID = -1;
    let subcatID = -1;
    for(i = 0; i < dict.words.length; i += 2) {
        if(dict.cat[catID + 1] == i) {
            catID++;
            out += "<h3>" + dict.catNames[catID] + "</h3>";
        }
        if(dict.subcat[subcatID + 1] == i) {
            subcatID++;
            if(dict.subcatNames[subcatID] != "Basic") out += "<h4>" + dict.subcatNames[subcatID] + "</h4>";
        }
        out += dict.words[i] + ": " + dict.words[i + 1] + "<br>";
    }
    return out+"<br>"+generateIndex(false);
}
const helpPageNames = ["main", "number", "verb", "grammar", "index", "credits","wordlist"];
function openHelp(name, setSearch) {
    if(name == null) name = "";
    name = name.toLowerCase();
    if(setSearch) {
        document.getElementById("search").value = "help " + name;
    }
    let pages = document.getElementsByClassName("helpPage");
    for(let i = 0; i < pages.length; i++) pages[i].style.display = "none";
    //Get page index
    let pageIndex = -1;
    for(let i = 0; i < helpPageNames.length; i++) {
        if(helpPageNames[i].startsWith(name)) {
            pageIndex = i;
            break;
        }
    }
    //If none found, redirect to main page and send error message
    if(pageIndex == -1) {
        pageIndex = 0;
        document.getElementById("helpStatus").innerText = "Error: could not find help page " + name;
    }
    else document.getElementById("helpStatus").innerText = "";
    let page = document.getElementById("help" + helpPageNames[pageIndex]);
    page.style.display = "block";
    //Generate Index if needed
    if(helpPageNames[pageIndex] == "index") {
        page.innerHTML = generateIndex(true);
    }
    if(helpPageNames[pageIndex]=="wordlist") {
        page.innerHTML = generateWordList();
    }
}
