'use strict';

function my_content(index) {
    let container = document.querySelector('div[id*=d' + index + ']');
    let content = container.querySelector('div[id*=q' + index + ']');
    if (content) {
        switch (content.style.display) {
        case 'none':
            content.style.display = 'block';
            break;
        default:
            content.style.display = 'none';
            break;
        }
    } else {
        content = document.createElement('div');
        content.className = 'custom';
        content.setAttribute('id', 'q' + String(index));
        content.style.display = 'block';
        container.insertBefore(content, container.firstChild);
        let url = window.location.origin + '/index-tmp.cgi?xmlread=' + index;
        let xhr = new XMLHttpRequest()        
        xhr.onload = function () {
            let msg = this.responseXML.querySelector('mes_body').textContent;
            content.innerHTML = msg;
        }
        xhr.open('GET', url, true);
        xhr.responseType = 'document';
        xhr.send(null);
    }
}
function click_callback(ev) {
    let index = ev.target['id'].slice(1);
    my_content(index);
}
function has_body(content) {
    let result = content.innerHTML.search('\\(-\\)');
    if (result != - 1) {
        return false;
    } else {
        return true;
    }
}

function do_job() {
    let links = document.querySelectorAll('span[id*="m"]');
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        let link_id = link['id'].slice(1);
        let plus_span = link.querySelector('span.e');
        if (plus_span) {
            let plus = plus_span.querySelector('a');
            plus.parentNode.removeChild(plus);
        } else {
            plus_span = document.createElement('span');
            plus_span.className = 'e';
            plus_span.setAttribute('id', 'p' + link_id);
            link.insertBefore(plus_span, link.firstChild);
        }
        if (has_body(link)) {
            plus_span.textContent = ' + ';
            plus_span.style.cursor = 'pointer';
            plus_span.addEventListener('click', click_callback, false);
        } else {
            plus_span.textContent = ' . ';
        }
    }
}
do_job();
