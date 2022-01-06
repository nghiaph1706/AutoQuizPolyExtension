var refId, locate, quesCont, sequence, point;

async function getInfo() {
    var urlCurrent = window.location.href;
    refId = urlCurrent.substr(urlCurrent.lastIndexOf('ref_id='), 13).replace('ref_id=', '');
    locate = urlCurrent.substring(urlCurrent.lastIndexOf('http://') + 7, urlCurrent.lastIndexOf('.poly.edu.vn'));
    var temp = document.getElementsByClassName("small text-muted");
    quesCont = Number(temp[0].textContent.substring(temp[0].textContent.lastIndexOf('of') + 2, temp[0].textContent.lastIndexOf(`(`)).trim());
    sequence = Number(urlCurrent.substring(urlCurrent.lastIndexOf('sequence=') + 9, urlCurrent.indexOf('&active_id')));
    var url = `http://` + locate + `.poly.edu.vn/ilias.php?ref_id=` + refId + `&cmd=outUserResultsOverview&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilrepositorygui`;
    await fetch(url)
        .then(function (response) {
            return response.text()
        })
        .then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var table = doc.querySelector('#tst_pass_overview_314685');
            var tmpString = table.rows[table.rows.length - 1].cells[4].innerHTML;
            point = Number(tmpString.substring(0, tmpString.lastIndexOf(`Of`)).trim());
        })
    // console.log(`refId: ` + refId + ` locate: ` + locate + ` quesCont: ` + quesCont + ` sequence: ` + sequence + ` point: ` + point)
}

async function start() {
    await getInfo();
    var count = Number(localStorage.getItem('count'));
    var prev = Number(localStorage.getItem('prev'));
    var pointOld = Number(localStorage.getItem('pointOld'));
    var ans = Number(localStorage.getItem('ans'));
    // console.log(`count: ` + count + ` prev: ` + prev + ` pointOld: ` + pointOld + ` ans: ` + ans)
    if (Number(null) == count) {

        localStorage.setItem('count', '1');
        localStorage.setItem('ans', '1');
        localStorage.setItem('pointOld', '0');
        localStorage.setItem('prev', '1');

        document.getElementById(`answer_0`).click();
        var next = document.getElementById('bottomnextbutton');
        next.click();

        try {
            var save = document.getElementById('save_on_navigation_prevent_confirmation');
            save.click();
            var confirm = document.getElementById('tst_save_on_navigation_button');
            confirm.click();
        } catch (error) {
        }

    } else if (prev == 1) {

        localStorage.setItem('prev', '0');

        var prev = document.getElementById('bottomprevbutton');
        prev.click();

    } else if (prev == 2) {
        if (point == quesCont) {

            localStorage.setItem('count', '' + Number(1000));
            
            var url = `http://` + locate + `.poly.edu.vn/ilias.php?ref_id=` + refId + `&cmd=outUserResultsOverview&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilrepositorygui`;
            var popup = window.open(url, 'popUpWindow', 'height=700,width=700,left=900,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')
            
        } else {
            localStorage.setItem('prev', '0');
            var next = document.getElementById('bottomnextbutton');
            next.click();

            try {
                var save = document.getElementById('save_on_navigation_prevent_confirmation');
                save.click();
                var confirm = document.getElementById('tst_save_on_navigation_button');
                confirm.click();
            } catch (error) {
            }

        }
    } else if (count < quesCont) {

        if (point == sequence) {

            localStorage.setItem('prev', '0');
            localStorage.setItem('count', '' + Number(count + 1));
            localStorage.setItem('ans', '' + Number(0));

            var next = document.getElementById('bottomnextbutton');
            next.click();

            try {
                var save = document.getElementById('save_on_navigation_prevent_confirmation');
                save.click();
                var confirm = document.getElementById('tst_save_on_navigation_button');
                confirm.click();
            } catch (error) {
            }

        } else {

            localStorage.setItem('prev', '1');
            localStorage.setItem('ans', '' + Number(ans + 1));
            localStorage.setItem('pointOld', '' + Number(point));

            document.getElementById(`answer_` + ans).click();
            var next = document.getElementById('bottomnextbutton');
            next.click();

            try {
                var save = document.getElementById('save_on_navigation_prevent_confirmation');
                save.click();
                var confirm = document.getElementById('tst_save_on_navigation_button');
                confirm.click();
            } catch (error) {
            }

        }

    } else if (count == quesCont) {
        localStorage.setItem('prev', '2');
        localStorage.setItem('ans', '' + Number(ans + 1));

        document.getElementById(`answer_` + ans).click();
        var prev = document.getElementById('bottomprevbutton');
        prev.click();
    }
}

start();
