// ==UserScript==
// @name         HN Enhancements
// @version      1.0
// @description  Shows HN Top-level comments
// @license      MIT
// @author       Andy Rudoff
// @include      http*://news.ycombinator.com/item?id=*
// @grant        GM.addStyle
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  console.log('HN Enhancements loaded.');

  // Determine if an element is below the visible viewport
  const isBelowViewport = function(element) {
    const rect = element.getBoundingClientRect();
    const html = document.documentElement;
    return (rect.bottom >= window.innerHeight);
  };

  // HN Top-level thread additions all start with HNTop.
  // Add the CSS...
  GM.addStyle(`
    #HNTopStripe {
      position: fixed;
      top: 8px;
      right: 5px;
      background-color: yellow;
      color: black;
      border: 1px solid black;
      border-radius: 4px;
      cursor: pointer;
      padding: 3px 8px;
    }
    .HNTopTag {
      background-color: yellow;
      color: black;
      border: 1px solid black;
      border-radius: 3px;
      scroll-margin-top: 8px;
      padding: 2px;
    }
    @media screen and (max-width: 400px) {
      #HNTopLabel {
        display: none;
      }
    }
  `);

  // list of top-level comment tags (populated while adding them below)
  let $tags = [];

  // add <div> element for the stripe across the top
  const $topStripe = document.createElement('div');
  $topStripe.id = 'HNTopStripe';
  document.body.appendChild($topStripe);

  // find all the top-level comments on the page:
  //   comments are all in the <table> with class "comment-tree"
  //   each comment is a <tr> row with class "athing"
  //   comment level is presented by a <td> element with class "ind"
  //   the <td> element has an attribute "indent"
  //   indent="0" indicates a top-level comment
  // since we want the <tr> elements, find them first,
  // then filter down to only those with the <td> element we want in them
  const $trs = [...document.querySelectorAll('table.comment-tree tr.athing')]
    .filter(el => !! el.querySelector(':scope td.ind[indent="0"'))

  // go through them, add <span> tags to the comment headers
  for (const $tr of $trs) {
    const $comhead = $tr.getElementsByClassName('comhead')[0];
    const $newTag = document.createElement('span');
    $newTag.className = 'HNTopTag';
    $tags.push($newTag);
    $newTag.innerHTML = `${$tags.length}`;
    $comhead.appendChild($newTag);
  }

  $topStripe.innerHTML =
    `<span id="HNTopLabel">Top-level comments: </span>${$tags.length}`;

  $topStripe.addEventListener('click', function (ev) {
    // find first comment not yet scolled into screen
    for (let i = 0; i < $tags.length; i++) {
      if (isBelowViewport($tags[i])) {
        $tags[i].scrollIntoView();
        break;
      }
    }
    ev.stopPropagation();
    ev.stopImmediatePropagation();
    ev.preventDefault();
    return false;
  });
})();
