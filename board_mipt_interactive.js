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

        let reader = new FileReader();
        reader.onloadend = function(e) {
            let parser = new DOMParser();
            let xdoc = parser.parseFromString(reader.result, "text/xml");
            content.innerHTML = xdoc.querySelector('mes_body').textContent;
        }
        fetch(window.location.origin + '/index-tmp.cgi?xmlread=' + index)
            .then(response => response.blob())
            .then(blob => reader.readAsText(blob, "windows-1251"));
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
    doc.querySelectorAll('div.w, div.g').forEach(function(container) {
        container.querySelectorAll('span.roll1').forEach(function(node) {
            let link_id = container.childNodes[0]['id'].slice(1);
            node.style.cursor = 'pointer';
            node.onclick = function(e) {
                let reader = new FileReader();
                reader.onloadend = function(e) {
                    let parser = new DOMParser();
                    let xdoc = parser.parseFromString(reader.result, "text/html");
                    handle_plus(xdoc);
                    let block = xdoc.querySelector('div.w, div.g');
                    block.className = container.className;
                    console.log(container.parentNode);
                    container.parentNode.insertBefore(block, container);
                    container.remove();
                }
                fetch(window.location.origin + '/index.cgi?read=' + link_id)
                    .then(response => response.blob())
                    .then(blob => reader.readAsText(blob, "windows-1251"));
            }
        })
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
