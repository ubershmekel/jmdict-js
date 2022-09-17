const fs = require("fs");
const sax = require("sax");

const strict = false; // set to false for html-mode
const parser = sax.parser(strict);

// parser.onerror = function (e) {
//   // an error happened.
// };
// parser.ontext = function (t) {
//   // got some text.  t is the string of text.
// };
// parser.onopentag = function (node) {
//   // opened a tag.  node has "name" and "attributes"
// };
// parser.onattribute = function (attr) {
//   // an attribute.  attr has "name" and "value"
// };
// parser.onend = function () {
//   // parser stream is done, and ready to have more stuff written to it.
// };

// parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close();

// stream usage
// takes the same options as the parser
var saxStream = require("sax").createStream(strict, {
  trim: true,
  normalize: true,
  lowercase: true,
});
saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e);
  // clear the error
  this._parser.error = null;
  this._parser.resume();
});

let i = 0;
let entry = null;
let nodeName = null;

saxStream.on("opentag", function (node) {
  // console.log("opentag", node);
  nodeName = node.name;
  if (node.name === "entry") {
    entry = {};
  }
});

saxStream.on("text", function (text) {
  // if (text.indexOf("高校") >= 0) {
  //   console.log("found");
  // }
  // console.log("text", text, nodeName);
  if (!entry) {
    return;
  }
  entry[nodeName] = text;
});

saxStream.on("closetag", function (name) {
  // console.log("closetag", name);
  if (name === "entry") {
    processEntry(entry);
  }
});

function processEntry(entry) {
  i = i + 1;
  // if (entry.keb == "高校") {
  //   console.log("entry", i, entry);
  //   process.exit();
  // }

  // {
  //   ent_seq: '1283500', 
  //   keb: '高校',        
  //   ke_pri: 'nf01',     
  //   reb: 'こうこう',    
  //   re_pri: 'nf01',     
  //   pos: '&n;',
  //   xref: '高等学校',   
  //   misc: '&abbr;',     
  //   gloss: 'high school'
  // }
  // if (i > 100) {
  //   process.exit();
  // }
  const kanji = entry.keb;
  const hiragana = entry.reb;
  if (!kanji || !hiragana) {
    return;
  }
  const kanjiCount = kanji.length;
  const readCount = hiragana.length;
  const step = readCount / kanjiCount;
  let found = false;
  let reps = 0;
  for (let j = 0; j < kanjiCount - 1; j++) {
    reps += 1;
    if (hiragana.slice(j * step, (j + 1) * step) == hiragana.slice((j + 1) * step, (j + 2) * step)) {
      found = true;
    } else {
      found = false;
      break;
    }
  }

  // I was hoping to find `reps > 1` but there aren't any
  // if (found && reps > 0 && kanji[0] != kanji[1]) {
  if (found && reps > 1) {
    console.log("entry", i, reps, entry);
  }
}

// pipe is supported, and it's readable/writable
// same chunks coming in also go out.
fs.createReadStream("JMdict_e", { encoding: "utf8" }).pipe(saxStream);
