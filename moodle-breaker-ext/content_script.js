// Put all the javascript code here, that you want to execute after page load.
const sendAddress = "https://moodle-breaker.kmsign.ru/addQuestionResult"
const getAnswer = "https://moodle-breaker.kmsign.ru/getQuestionResult";
const urlParams = new URLSearchParams(window.location.search);
const cmid = parseInt(urlParams.get('cmid'))

const sss = window.location.pathname.split('/');
if (sss[sss.length - 1] === "review.php") {
    console.log("if srabotal")
    let completeQuestBlocks = document.getElementsByClassName("que multichoice deferredfeedback complete");
    for (let block of completeQuestBlocks) {
        // let bl = questBlocks[block];
        if (typeof (block) !== "object") continue;

        let currentBall = block.getElementsByClassName("grade")[0].textContent.split(" ")[1];
        // let maximumBall = block.getElementsByClassName("grade")[0].textContent.split(" ")[3];

        let question = block.getElementsByClassName("qtext")[0].textContent;

        let rightAnswerBlocks = block.getElementsByClassName("r1");
        let rightAnswers = [];
        for (let b of rightAnswerBlocks) {
            if (b.getElementsByTagName('input')[0].checked){
                const restext = b.textContent.slice(2);
                rightAnswers.push({ "text": restext, "result": parseFloat(currentBall)});
            }
        }
        rightAnswerBlocks = block.getElementsByClassName("r0");
        for (let b of rightAnswerBlocks) {
            if (b.getElementsByTagName('input')[0].checked){
                const restext = b.textContent.slice(2);
                rightAnswers.push({ "text": restext, "result": parseFloat(currentBall)});
            }
        }

        let requestBody = {
            "test_id": cmid,
            "question_text": question,
            "answers": rightAnswers
        }

        fetch(sendAddress, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(response => console.log(response))
    }
    let correctQuestBlocks = document.getElementsByClassName("que multichoice deferredfeedback correct");
    for (let block of correctQuestBlocks) {
        // let bl = questBlocks[block];
        if (typeof (block) !== "object") continue;

        let currentBall = block.getElementsByClassName("state")[0].textContent.includes("Верно")?1.:0;

        let question = block.getElementsByClassName("qtext")[0].textContent;

        let rightAnswerBlocks = block.getElementsByClassName("r1 correct");
        let rightAnswers = [];
        for (let b of rightAnswerBlocks) {
            const restext = b.textContent.slice(2);
            rightAnswers.push({ "text": restext, "result": currentBall});
        }
        rightAnswerBlocks = block.getElementsByClassName("r0 correct");
        for (let b of rightAnswerBlocks) {
            const restext = b.textContent.slice(2);
            rightAnswers.push({ "text": restext, "result": currentBall});
        }

        let requestBody = {
            "test_id": cmid,
            "question_text": question,
            "answers": rightAnswers
        }

        fetch(sendAddress, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(response => console.log(response))
    }
    let incorrectQuestBlocks = document.getElementsByClassName("que multichoice deferredfeedback incorrect");
    for (let block of incorrectQuestBlocks) {
        // let bl = questBlocks[block];
        if (typeof (block) !== "object") continue;

        let currentBall = block.getElementsByClassName("state")[0].textContent.includes("Верно")?1.:0;
        // let maximumBall = block.getElementsByClassName("grade")[0].textContent.split(" ")[3];

        let question = block.getElementsByClassName("qtext")[0].textContent;

        let rightAnswerBlocks = block.getElementsByClassName("r0 incorrect");
        let rightAnswers = [];
        for (let b of rightAnswerBlocks) {
            rightAnswers.push({ "text": b.textContent.slice(2), "result": currentBall});
        }
        rightAnswerBlocks = block.getElementsByClassName("r1 incorrect");
        for (let b of rightAnswerBlocks) {
            const restext = b.textContent.slice(2);
            rightAnswers.push({ "text": restext, "result": currentBall});
        }

        let requestBody = {
            "test_id": cmid,
            "question_text": question,
            "answers": rightAnswers
        }

        fetch(sendAddress, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(response => console.log(response))
    }
}

if (sss[sss.length - 1] === "attempt.php") {
    let questBlocks = document.getElementsByClassName("que multichoice deferredfeedback notyetanswered");
    for (let block of questBlocks) {
        // let bl = questBlocks[block];
        if (typeof (block) !== "object") continue;

        let question = block.getElementsByClassName("qtext")[0].textContent;

        let requestBody = {
            "test_id": cmid,
            "question_text": question,
        }

        console.log(requestBody);

        fetch(getAnswer, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then((response) => response.json())
            .then((data) => {
                let flag = false;
                let ans = block.getElementsByClassName("r0");
                for (let a of ans) {
                    console.log("teg: '" + a.textContent + "'")
                    for (let ta of data.answers) {
                        console.log("ans: '" + ta.text + "'")
                        if (a.textContent.slice(2) ===  ta.text){
                            console.log("its true")
                            a.style.backgroundColor = "#ff6505"
                            if (ta.result != 1 && !flag){
                                document.getElementsByClassName("info")[0].outerHTML += '<div style="background-color: #ff6505; margin: 10px; padding: 10px;">Внимание! Ответы на балл: ' + ta.result + '</div>'
                                flag = true;
                            }
                        }
                    }
                }

                ans = block.getElementsByClassName("r1");
                for (let a of ans) {
                    console.log("teg: '" + a.textContent + "'")
                    for (let ta of data.answers) {
                        console.log("ans: '" + ta.text + "'")
                        if (a.textContent.slice(2) === ta.text) {
                            console.log("its true")
                            a.style.backgroundColor = "#ff6505"
                            if (ta.result != 1 && !flag){
                                document.getElementsByClassName("info")[0].outerHTML += '<div style="background-color: #ff6505; margin: 10px; padding: 10px;">Внимание! Ответы на балл: ' + ta.result + '</div>'
                                flag = true;
                            }
                        }
                    }
                }


                console.log(data);
            });
    }
}


