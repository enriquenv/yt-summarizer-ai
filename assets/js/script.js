document.getElementById('yes').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('language').style.display = 'block';
    }
});

document.getElementById('no').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('language').style.display = 'none';
        document.getElementById('otherLanguage').style.display = 'none';
        document.getElementById('language').value = 'no_translation';
        document.getElementById('otherLanguage').value = '';
    }
});

function checkLanguage() {
    var language = document.getElementById('language').value;
    if (language === 'Other') {
        document.getElementById('otherLanguage').style.display = 'block';
    } else {
        document.getElementById('otherLanguage').style.display = 'none';
    }
}

function submit() {
    var videoUrl = document.getElementById('videoUrl').value;
    var videoId;
    if (videoUrl.indexOf('youtu.be') !== -1) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    } else if (videoUrl.indexOf('youtube.com/shorts') !== -1) {
        videoId = videoUrl.split('youtube.com/shorts/')[1].split('?')[0];
    } else {
        videoId = videoUrl.split('v=')[1].split('&')[0];
    }
    var language = document.getElementById('language').value;
    console.log(language);
    if (language === 'Other') {
        language = document.getElementById('otherLanguage').value;
        console.log(language);
    }
    var data = {
        videoId: videoId,
        sumLang: language
    };
    console.log(data);
    document.getElementById('loading').style.display = 'block';
    fetch('https://zii9141p4i.execute-api.us-east-1.amazonaws.com/dev', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(summary => {
        if (summary.startsWith('{"errorType":"Error","errorMessage":"[YoutubeTr')) {
            summary = '<br><br>🚨Unfortunately there are no public captions for that video, please try another one😊';
        } else if (summary.startsWith('{"errorType":"Error","errorMessage":"[Google')) {
            summary = '<br><br>🙁Unfortunately there is a problem summarizing that video, please try again later😊';
        } else if (summary.startsWith('{"message": "Endpoint request tim')) {
            summary = '<br><br>🤪Wow that video was long, but not to worry, please try one more time😊';
        } else {
            summary = summary.replace(/\\n/g, '<br>');
            summary = summary.replace(/(<br>\s*){3,}/g, '<br><br>');
            summary = summary.replace(/<\/h1><br>/g, '</h1>');
            summary = summary.replace(/<\/h2><br>/g, '</h2>');
            summary = summary.replace(/<\/h3><br>/g, '</h3>');
            summary = summary.replace(/<\/p><br>/g, '</p>');
            summary = summary.replace(/<\/ul><br>/g, '</ul>');
            summary = summary.replace(/<\/ol><br>/g, '</ol>');
            summary = summary.replace(/^"(.*)"$/, '$1');
        }
        document.getElementById('summary').innerHTML = summary;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('copyButton').style.display = 'inherit';
    });
}

document.getElementById('videoUrl').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submit();
    }
});

document.getElementById('copyButton').addEventListener('click', function() {
    var summary = document.getElementById('summary').innerText;
    var tempInput = document.createElement('textarea');
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = summary;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Summary copied to clipboard!');
});