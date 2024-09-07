// ==UserScript==
// @name         Anti-annoyance Tampermonkey 
// @namespace    https://github.com/NotJoeMartinez/anti-annoyance-tampermonkey 
// @version      0.4
// @description  Prevents annoying scripts from being annoying 
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    blockKeyboardShortcuts();
    preventBackButtonInterference();
    preventRightClickDisabling();
    preventTextSelectionDisabling();
    preventCopyPasteDisabling();

})();

function blockKeyboardShortcuts() {
    const targetKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'l', 'f', 'g', 'p', 'o', '=', '-', 'i', 's', 'j', 
        'd', 'c', 'v', 'x', 'z', 'a', 'u', 'y', 'b',
        'ArrowLeft', 'ArrowRight',
    ];

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && targetKeys.includes(e.key)) {
            e.stopPropagation();
        }
    }, true);
}

function preventBackButtonInterference() {
    let isBackButtonClicked = false;

    window.addEventListener('popstate', function(event) {
        if (!isBackButtonClicked) {
            window.history.pushState(null, null, window.location.href);
        }
        isBackButtonClicked = false;
    });

    history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function() {
        isBackButtonClicked = true;
        history.back();
    });
}

function preventRightClickDisabling() {
    document.addEventListener('contextmenu', function(e) {
        e.stopPropagation();
        return true;
    }, true);

    document.addEventListener('mousedown', function(e) {
        if(e.button === 2) {
            e.stopPropagation();
            return true;
        }
    }, true);

    Object.defineProperty(document, 'oncontextmenu', {
        get: function() {
            return null;
        },
        set: function() {
            // Do nothing
        }
    });
}

function preventTextSelectionDisabling() {
    document.addEventListener('selectstart', function(e) {
        e.stopPropagation();
        return true;
    }, true);
}

function preventCopyPasteDisabling() {
    ['copy', 'cut', 'paste'].forEach(function(event) {
        document.addEventListener(event, function(e) {
            e.stopPropagation();
            return true;
        }, true);
    });

    // Prevent overriding of copy, cut, and paste
    const overriddenFunctions = {
        copy: Document.prototype.execCommand,
        cut: Document.prototype.execCommand,
        paste: Document.prototype.execCommand
    };

    Document.prototype.execCommand = function(commandId, ...args) {
        if (['copy', 'cut', 'paste'].includes(commandId.toLowerCase())) {
            console.log(`Prevented blocking of ${commandId}`);
            return true;
        }
        return overriddenFunctions[commandId].apply(this, args);
    };

    // Prevent disabling of clipboard events
    ['copy', 'cut', 'paste'].forEach(function(event) {
        Object.defineProperty(document, 'on' + event, {
            get: function() {
                return null;
            },
            set: function() {
                // Do nothing
            }
        });
    });
}