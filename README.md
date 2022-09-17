This repo is me messing with the Japanese dictionary

## Why?

I noticed that highschool 高校 is two different kanji but they have the same pronunciation こうこう (koukou). I wondered if there are words with 3 of those.

I found 点点点 => a 3 repetition word. I did not find a word with 3 repeated sounds that are different kanji. But there are many with 2 repeats like 高校. Like: 銘名, 偸盗, 乳母, 蒐輯, 毀棄, 廷丁, 要用, 小竹, 頌壽, etc... A lot of こうこう too: 硬鋼, 後攻, 後項, 皇考, 交媾

## Technical details

Download the dictionary at:

http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz

I tried `libxmljs`, `xml-js` and they choked at the 54 MB xml file. So I used `sax` and it worked well.
