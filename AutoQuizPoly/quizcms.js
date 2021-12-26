var today = new Date();
var log =today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+'-'+ today.getTime()+'-'+today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();


class Question {
    constructor(quesNum, quesCont) {
        this._quesNum = quesNum;
        this._quesCont = quesCont;
    }

    quesNum() {
        return this._quesNum;
    }

    quesCont() {
        return this._quesCont;
    }
}

class Answer {
    constructor(ques, answers) {
        this._ques = ques;
        this._answers = answers;
    }

    ques() {
        return this._ques;
    }

    answers() {
        return this._answers;
    }
}

class Result {
    constructor(quesNum, quesCont, quesAns) {
        this._quesNum = quesNum;
        this._quesCont = quesCont;
        this._quesAns = quesAns;
    }

    quesNum() {
        return this._quesNum;
    }

    quesCont() {
        return this._quesCont;
    }

    quesAns() {
        return this._quesAns;
    }
}

const api = "https://api.cap.quizpoly.xyz/cms/";

function getCourseName() {
    const elmsCourseName = document.querySelector("span.course-name");
    const courseName = elmsCourseName.textContent;
    return courseName;
}

function getQuestion() {
    var quesList = new Array();

    const elmsPolyBody = document.getElementsByClassName("poly-body");

    for (i = 0; i < elmsPolyBody.length; i++) {
        var quesNum = i + 1;
        var quesCont = elmsPolyBody[i].textContent.trim();
        try {
            const elmsPolyAudio = elmsPolyBody[i].querySelector("div.poly-audio").innerHTML;
            var quesAudio = "\n" + elmsPolyAudio;
            quesCont += quesAudio;
        } catch {
        }
        try {
            const elmsPolyImage = elmsPolyBody[i].querySelector("div.poly-img").innerHTML;
            var quesImage = "\n" + elmsPolyImage;
            quesCont += quesImage;
        } catch {
        }
        const ques = new Question(quesNum, quesCont);
        quesList.push(ques);
    }

    return quesList;
}


function enCodeUrl(courseName) {
    courseName.replace("\\s+", "");
    var url = api.concat(encodeURIComponent(courseName).replace(/[!'()*]/g, escape))
    return url;
}

function unique(arr) {
    var newArr = []
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i])
        }
    }
    return newArr
}

async function getResult(url) {
    var answerList = new Array();
    const response = await fetch(url);
    const data = await response.json();
    for (i = 0; i < data.length; i++) {
        var ans = new Array();
        for (j = 0; j < data[i].a.length; j++) {
            ans.push(data[i].a);
        }

        const answer = new Answer(data[i].q, unique(ans));
        answerList.push(answer);
    }
    return answerList;
}

function removeChartX(str) {
    str.replace(/\s+/g, '');
    str.replace(/\\n/g, '');
    return str;
}

var htmlpart1 = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>AUTO QUIZ POLY</title>
    </head>
<body>

    <h1 style="color: orange; text-align: center;">AUTO QUIZ CMS POLY</h1>
    `;


function readRsList(quesList, rsList) {
    var str = `<div id="conter" style="border: outset; padding: 10px;">`;
    htmlpart1 += str;
    for (i = 1; i <= quesList.length; i++) {
        console.log('%c' + "Question " + i + ": " + '%c' + rsList[i-1].quesCont(), 'background: #222; color: white', 'background: #222; color: #add8e6');
        str = `<div style="border: solid; "> ` + `<h3 style="margin: auto; padding: 10px;">` + `Question ` + i + `: `+ rsList[i-1].quesCont() + `</h3>`
        htmlpart1+=str;
        for (j = 0; j < rsList.length; j++) {
            if (i == rsList[j].quesNum()) {
                for (k = 0; k < rsList[j].quesAns().length; k++) {
                    console.log('%c' + "Answer: " + rsList[j].quesAns()[k], 'background: #222; color: #bada55');
                    str = `<h3 style="margin: auto; padding: 10px; color:Tomato;">` + `Answer: ` + rsList[j].quesAns()[k]+`</h3>`;
                    htmlpart1+= str;
                }
            }
        }
        str = `</div>` ; 
        htmlpart1+=str;
    }
    str = `</div></body></html>`;
    htmlpart1+=str;
    var myWindow = window.open('', 'popUpWindow', 'height=700,width=700,left=900,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')
    myWindow.document.write(htmlpart1);
}

var tmp = 0;
async function getAnswer() {
    var rsList = new Array();
    const quesList = getQuestion();
    const courseName = getCourseName();
    htmlpart1 += `<h3 style="margin: auto; padding: 10px; color:green; text-align: center;">` + courseName +`</h3>`;
    const url = enCodeUrl(courseName);
    const ansList = await getResult(url);
    for (i = 0; i < quesList.length; i++) {
        for (j = 0; j < ansList.length; j++) {
            var str1 = "" + quesList[i].quesCont();
            var str2 = "" + ansList[j].ques();
            if (removeChartX(str1) === removeChartX(str2)) {
                tmp++;
                var answers = ansList[j].answers();
                const rs = new Result(quesList[i].quesNum(), quesList[i].quesCont(), ansList[j].answers());
                rsList.push(rs);
            }
        }
    }
    
    try {
        readRsList(quesList, rsList);
    } catch (error) {
        alert("Nếu không hiện popup, mở console để xem kết quả ( Nhấn F12 hoặc Chuột phải -> Inspect)")
        console.error();
    }
}

htmlpart1+=`<h3 style="margin: auto; padding: 10px; color:green; text-align: center;">` + log +`</h3>`;


getAnswer();