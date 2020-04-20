// ==UserScript==
// @name         Hacker news - hide visited links
// @namespace    https://github.com/mintyPT/userscripts
// @version      0.2
// @description  On click, hide link
// @author       mintyPT
// @license      MIT
// @match        *://news.ycombinator.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

async function fetchJson(url) {
    const response = await fetch(url);
    return response.json();
}

function assert(a, b = true, message) {
    if (a != b) {
        const msg = message || `Assertion failed ${a}!=${b}`;
        console.error(msg);
    }
}

const flow = (...fs) => {
    return input => {
        return fs.reduce((accu, f) => {
            const res = f(accu);
            return res;
        }, input);
    };
};

const defaultObject = a => {
    try {
        return a ? JSON.parse(a) : {};
    } catch (e) {
        return {};
    }
};

const getItem = key => () => localStorage.getItem(key);
const setItem = key => value => localStorage.setItem(key, value) || true;

const getObj = k => flow(getItem(k), defaultObject);
const saveObj = k => flow(JSON.stringify, setItem(k));
const showElement = $el => {
    $el.show();
    $el.next().show();
    $el.prev().show();
};

const hideElement = $el => {
    $el.hide();
    $el.next().hide();
    $el.prev().hide();
};

const $ = jQuery;

(function() {
    'use strict';


    const getter = getObj("hnseen");
    const setter = saveObj("hnseen");

    const append = flow(url => ({ ...getter(), [url]: true }), setter);
    const wasSeen = href => getter()[href];

    const $elements = $(".itemlist .athing");

    $elements.map((i, el) => {
        const $el = $(el);
        const link = $el.find("td.title a.storylink").first();
        const href = link.attr("href");

        if (wasSeen(href)) {
            hideElement($el);
        }

        link.on("click", e => {
            e.preventDefault();
            hideElement($el);
            append(href);
            window.open(href);
        });
    });

    const onHideLink = e => {
        e.preventDefault();
        $elements.map((i, el) => {
            const $el = $(el);
            const link = $el.find("td.title a.storylink").first();
            const href = link.attr("href");

            if (!wasSeen(href)) {
                hideElement($el);
            }

            append(href);
        });
    };

    const onShowLink = e => $elements.map((i, el) => {
        const $el = $(el);
        showElement($el);
    });

    const $hideLink = $('<a class="morelink" href="#">Hide</a>')
    .css({ marginLeft: "10px" })
    .on("click", onHideLink);

    const $showLink = $('<a class="morelink" href="#">Show</a>')
    .css({ marginLeft: "10px" })
    .on("click", onShowLink);

    $(".morelink")
        .after($hideLink)
        .after($showLink);

})();
