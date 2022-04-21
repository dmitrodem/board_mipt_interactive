'use strict';

function click_callback(ev) {
    let index = ev.target['id'].slice(1);
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
function has_body(content) {
    return (content.innerHTML.search('\\(-\\)') == -1);
}

function handle_plus(doc) {
    doc.querySelectorAll('span[id*="m"]').forEach(function(link) {
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
    })
}

function handle_rolls(doc) {
    doc.querySelectorAll('span.roll1').forEach(function(node) {
        let link_id = node.parentNode['id'].slice(1);
        node.style.cursor = 'pointer';
        node.onclick = function(e) {
            let reader = new FileReader();
            reader.onloadend = function(e) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(reader.result, "text/html");
                handle_plus(doc);
                let block = doc.querySelector('div.w, div.g');
                let old_block = node.parentNode.parentNode;
                block.setAttribute('class', old_block.getAttribute('class'));
                old_block.parentNode.insertBefore(block, old_block);
                old_block.remove();
            }
            fetch(window.location.origin + '/index-tmp.cgi?read=' + link_id)
                .then(response => response.blob())
                .then(blob => reader.readAsText(blob, "windows-1251"));
        }
    })
}

function do_job() {
    let css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("href", browser.runtime.getURL("dark.css"));
    document.querySelector("head").appendChild(css);

    handle_plus(document);
    handle_rolls(document);
}
do_job();
