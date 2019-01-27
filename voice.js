var observer;
var domSelector = 'audio';

//Fetch facebook audio url: document.getElementsByTagName('audio')[0]
//ref: https://github.com/cornguo/nKemono

runObserver();

function createObserver () {
   return new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0 ) {
                mutation.addedNodes.forEach(function (node) {
                    if (node) {
                        replaceVoice(domSelector, node);
                    }
                });
            }
        });
        observer.disconnect();
        runObserver();
    });
}

function runObserver () {
    chrome.runtime.sendMessage({msg: 'getDisabled'}, function(response) {
        if (!response.disabled) {
            replaceVoice(domSelector);
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            observer = createObserver();
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });
};

function replaceVoice(selector, node) {
    var objects;
    if (node) {
        if (node.querySelectorAll) {
            objects = [ node, ...node.querySelectorAll(selector) ];
        } else {
            objects = [ node ];
        }
    } else {
        objects = document.querySelectorAll(selector);
    }
    // src
    var voiceSrc = 'https://www.myinstants.com/media/sounds/kc144v26.mp3';

    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (object.classList && object.classList.contains('voice-injected')) {
            continue;
        }
        if (object.src && 'AUDIO' === object.tagName) {
            object.src = voiceSrc;
            object.classList.add('voice-injected');

        } 
    }

}