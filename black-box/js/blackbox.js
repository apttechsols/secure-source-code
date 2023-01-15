import {log} from './loader.js';

// MEMEX
// udela boxy pro umco ve forme memexu
export function blackbox() {

  log({"blackbox": "loading started"});

  // consts
        // velikosti elementu
  const win = {"h": $(window).height(),
               "w": $(window).width()},
        // limit je kolik % je odskok z kraje obrazovky
        limit = {"x": win.w/10,
                 "y": win.h/10};

  var itt = 0;

  // z tohohle si ve funkci loadPosts() vyzvednu vysledek
  window.blackbox = [];

  function chords() {

        // 70 + 15 ==> aby byl odskok (max width & height je 30vh ==> 30/2=15 ==> range 15-85)
    var x = Math.floor(Math.random()*80)+10,
        y = Math.floor(Math.random()*80)+10;

    return {"x": x, "y": y};

  }

  // pro kazdy post (fce start)
  $('.post').each(function() {

    // set vars and generate chords
    var post = $(this),
        pos = chords();

    if (post.hasClass('info')) {

      var title = post.find('.name');
      if (title[0].scrollWidth-1 > title.innerWidth()) {
        log({"warning": "text overlapping in infobox", "addClass": "wider", "solved": true});
        post.addClass('wider');
      }

    }

    window.blackbox.push({"id": post.attr('id'), "x": pos.x,"y": pos.y});
    log(window.blackbox[itt]);

    itt++;

  });

}

// naloaduje posty az na konci zobrazovani logu ;)
export function loadPosts() {

  var itt = 0,
      small = false,
      pocet = window.blackbox.length;

  if (pocet > 50) {
    small = true;
  }

  $.each(window.blackbox, function(i, elem) {

      // nastaveni koordinatu projektu
      setTimeout(function(){

        var post = $('#'+elem.id);
        post.css({top: elem.y+'vh', left: elem.x+'vw'});
        post.removeClass('large');

        if (small) {
          post.addClass('small');
        }

         // 1500 ==> cas co trva fadein animace + cas na rozkoukani
      }, 1500+itt*100+(Math.random()*50));

      itt++;

  });

  // po skonceni vynulovat promennou
  window.blackbox = [];

}



// OPENBOX
// udela supercool naminaci mezi memexem a blckboxem
export function openBox(link) {

  var orig = $('a[href="'+link+'"]').closest('.prj'),
      obsah = orig.html(),
      obj = {'pos': orig.position(),
             'w': orig.width(),
             'h': orig.height()};

  log({'fce': 'shadowMaster', 'link': link, 'started': true});

  // here goes magic <3 thx gaga
  $('body').append($('<div>', {class: 'prj',
                               id: 'shadowMaster',
                               css: {left: obj.pos.left+obj.w/2,
                                     top: obj.pos.top+obj.h/2},
                               html: orig.html()
                              // presune projekt doprostred s delay
                              }).delay(250).animate({top: '50vh', left: '50vw'}, 500, function(){

                                   var div = $(this);

                                   // od-animuje title a sidecick, i odstrani
                                   div.find('.title, .sidekick').addClass('away').delay(250).queue(function(){
                                        $(this).remove().dequeue();
                                   });
                                   // zvetsi hlavni obrazek
                                   setTimeout(function(){
                                     div.find('.mainPic').addClass('large blur');
                                   }, 250);

                             })
                  );

  // odstrani puvodni div ==> aby neslo poznat ze jde o duplikat
  orig.remove();

}
