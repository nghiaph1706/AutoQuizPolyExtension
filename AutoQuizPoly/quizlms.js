
var refId, locate, pass, quesCont, sequence, activeId, count;
var rsList = new Array();

function getInfo() {
    var urlCurrent = window.location.href;
    refId = urlCurrent.substr(urlCurrent.lastIndexOf('ref_id='), 13).replace('ref_id=', '');
    locate = urlCurrent.substring(urlCurrent.lastIndexOf('http://') + 7, urlCurrent.lastIndexOf('.poly.edu.vn'));

    var temp = document.getElementsByClassName("small text-muted");
    quesCont = Number(temp[0].textContent.substring(temp[0].textContent.lastIndexOf('of') + 2, temp[0].textContent.lastIndexOf(`(`)).trim());
    for (let i = 0; i < rsList.length; i++) {
        rsList.push(0);
    }
    sequence = Number(urlCurrent.substring(urlCurrent.lastIndexOf('sequence=') + 9, urlCurrent.indexOf('&active_id')));

    activeId = urlCurrent.substring(urlCurrent.lastIndexOf('&active_id=') + 11, urlCurrent.lastIndexOf('&cmd=showQuestion&'), -1);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


async function getResult() {
    rsList.length = 0;
    var url = 'http://' + locate + '.poly.edu.vn/ilias.php?ref_id=' + refId + '&active_id=&pass=' + pass + '&cmd=outUserPassDetails&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilRepositoryGUI';
    await fetch(url)
        .then(function (response) {
            return response.text()
        })
        .then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var table = doc.querySelector('table');
            for (var r = 0, n = table.rows.length; r < n; r++) {
                rsList.push(Number(table.rows[r].cells[4].innerHTML));
            }
        })
}


async function start(ans) {
    await getResult();
    var rschild = rsList[sequence];
    if (Number(rschild) == 0) {
        document.getElementById(`answer_` + ans).click();
    }
    if (count == 0 || count == 2 || count == 99) {
        try {
            var next = document.getElementById('bottomnextbutton');
            next.click();
        } catch (error) {
            var prev = document.getElementById('bottomprevbutton');
            prev.click();
        }
    } else if (count == 1 || count == 3) {
        try {
            var prev = document.getElementById('bottomprevbutton');
            prev.click();
        } catch (error) {
            var next = document.getElementById('bottomnextbutton');
            next.click();
        }
    }
    try {
        var save = document.getElementById('save_on_navigation_prevent_confirmation');
        save.click();
        var confirm = document.getElementById('tst_save_on_navigation_button');
        confirm.click();
    } catch (error) {
    }
    localStorage.setItem('status', '' + (Number(tmpCount) + 1))


}

async function getPass(refId, locate) {
    var url = 'http://' + locate + '.poly.edu.vn/ilias.php?ref_id=' + refId + '&cmd=outUserResultsOverview&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilrepositorygui';
    await fetch(url)
        .then(res => res.text())
        .then(text => {
            var tmp = text.split(`This object is empty and contains no items.`).length - 1;
            if (tmp == 1) {
                pass = 0;
            } else {
                pass = text.split(`<tr class="tblrow`).length - 1;
                localStorage.setItem('pass', ''+pass);
            }
        })
    start(count)
}

var tmpCount = Number(localStorage.getItem('status'))

if (Number(null) == tmpCount) {
    localStorage.setItem('status', '1');
    tmpCount = Number(localStorage.getItem('status'))
    count = 0;
    getInfo()
    getPass(refId, locate);
} else if (Number(null) != tmpCount) {
    tmpCount = Number(localStorage.getItem('status'));
    getInfo();
    if (tmpCount <= quesCont) { //1-44
        count = 0;
        getInfo();
        getPass(refId, locate);
    } else if (tmpCount > quesCont && tmpCount <= quesCont * 2) { //45-89
        count = 1;
        getInfo()
        getPass(refId, locate);
        if (tmpCount == quesCont*2) {
            count = 2;
            getInfo()
            getPass(refId, locate);
        }
    } else if (tmpCount > quesCont * 2 && tmpCount <= quesCont * 3) { //90-134
        count = 2;
        getInfo()
        getPass(refId, locate);
        if (tmpCount == quesCont*3) {
            count = 3;
            getInfo()
            getPass(refId, locate);
        }
    } else if (tmpCount > quesCont * 3 && tmpCount <= quesCont * 4) { //135-179
        count = 3;
        getInfo()
        getPass(refId, locate);
        if (tmpCount == quesCont*4) {
            count = 3;
            getInfo()
            getPass(refId, locate);
        }
    } else {
        localStorage.removeItem('status');
        alert('done');
        count = 999;
        getInfo();
        getPass(refId, locate);
        var passnow = Number(localStorage.getItem('pass'))
        var urlsnow = 'http://' + locate + '.poly.edu.vn/ilias.php?ref_id=' + refId + '&active_id=&pass=' + passnow + '&cmd=outUserPassDetails&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilRepositoryGUI';
        var popup = window.open(urlsnow, 'popUpWindow', 'height=700,width=700,left=900,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')
    }
}


