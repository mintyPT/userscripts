// ==UserScript==
// @name         HN - colorize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://news.ycombinator.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==


const usersToHighlight = ["xcubic"];

const rand255 = () => Math.round(Math.random() * 255);

const existsIn = (haystack, needle) => haystack.indexOf(needle) > -1;

const isValidLinkForColorizing = (text, href) => {
  return (
    text.match(/\d+\s(hours?|minutes?)\sago/gi) || href == "javascript:void(0)"
  );
};

const addBackground = ($a, h, s, l) => {
  $a.css({
    background: `hsl(${h}, ${s}%, ${l}%)`,
    padding: 2,
    color: "white",
    fontWeight: "bold"
  });
};

const addBorder = ($a, h, s, l) => {
  $a.css({
    borderBottom: `3px solid hsl(${h}, ${s}%, ${l}%)`
  });
};

//  uses hsl colors
const colorizeLink = ($a, color) => {
  const [h, s, l] = color;

  $a.css({ textDecoration: "none" });

  const highlight = existsIn(usersToHighlight, $a.text());
  if (!highlight) {
    addBorder($a, h, s, l);
  } else {
    addBackground($a, h, s, l);
  }
};


(function() {
    const $ = jQuery;
    
    const processLinkWithState = (state = {}) => (i, a) => {
    const $a = $(a);
    const text = $a.text();
    const href = $a.attr("href");

    const match = isValidLinkForColorizing(text, href);

    if (match) {
      return false;
    }

    if (!state[href]) {
      state[href] = [rand255(), 100, 40];
    }

    colorizeLink($a, state[href]);
  };

  $("a").map(processLinkWithState({}));
})();
