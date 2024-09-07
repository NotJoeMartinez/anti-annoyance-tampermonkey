// ==UserScript==
// @name         Anti-annoyance Tampermonkey 
// @namespace    https://github.com/NotJoeMartinez/anti-annoyance-tampermonkey 
// @version      0.3
// @description  Prevents annoying scripts from being annoying 
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Block scripts from breaking keyboard shortcuts 
    document.addEventListener('keydown', function(e) {
        const targetKeys = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'l', 'f', 'g', 'p', 'o', '=', '-', 'i', 's',
            'j', 'd', 'c', 'v', 'x', 'z', 'a', 'u', 'y', 'b',
            'ArrowLeft', 'ArrowRight',
        ];

        if ((e.ctrlKey || e.metaKey) && targetKeys.includes(e.key)) {
            console.log('Blocked key:', e.key);
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);

    // Prevent interference with back button
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

    // Prevent disabling right-click
    document.addEventListener('contextmenu', function(e) {
        e.stopPropagation();
        return true;
    }, true);

    // Prevent disabling default context menu
    document.addEventListener('mousedown', function(e) {
        if(e.button === 2) {
            e.stopPropagation();
            return true;
        }
    }, true);

    // Override any attempts to disable right-click or context menu
    Object.defineProperty(document, 'oncontextmenu', {
        get: function() {
            return null;
        },
        set: function() {
            // Do nothing
        }
    });

    // Prevent disabling of text selection
    document.addEventListener('selectstart', function(e) {
        e.stopPropagation();
        return true;
    }, true);

})();