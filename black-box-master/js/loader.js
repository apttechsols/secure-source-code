import {loading, disableScroll, jazyk} from './router_fce.js';
import {loadPosts} from './blackbox.js';

// firestarter
var logCount = 0;

// log strelec
export function log(data) {

  /*
  //  nice json sakra prace
  */
  function niceJson(json){

    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }

    // odstrani html
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // prokontroluje vsechny druhy dat a rozradi je + provede return
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {

      // otestuje ty data o typ a prideli class
      var cls = 'n';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'k';
        } else {
          cls = 's';
        }
      } else if (/true|false/.test(match)) {
        cls = 'b';
      } else if (/null/.test(match)) {
        cls = 'null';
      } else {

        // zaokrouhli cislo na desetinne mista (je to tak hezci)
        match = Math.floor(match* 10000)/10000;
      }

      // prida do vysledku
      return '<span class="'+cls+'">'+match+'</span>';
    });

  }

  // pokud konzole neni v html, pridej
  if (!$('#console').length) {
    $('body').append($('<div>', {id: 'console', class: 'log'}));
  }

  /*
  // MAIN FCE
  */
  // variables
  var con = $('#console'),
      delay = logCount*10+(Math.random()*10), // delay = logCount*30+(Math.random()*20),
      totalDelay =+ delay;

      // pokud se vola log znova, tak zobrazit
      if (!con.hasClass('log') && logCount > 1) {
        con.addClass('log');
      }

      // on finish of loading
      if (data.finish == true) {

        if ($('#console li').length == 0) {

          con.append('<br><br><br><br><br><br><br><br><br><br>');

        }

        // exit console
        setTimeout(function(){

          // erase log counter
          logCount = 0;

          // jaky je jazyk
          var langHtml = $('html').attr('lang');
          switch (langHtml) {
            default: case 'en': var lang = 'CZ'; break;
            case 'cs': var lang = 'EN'; break;
          }

          // napise zakonceni konzole ›_
          con.append('<br><br><div class="menuTop"><a href="/" class="textBlackBox">'+jazyk('ČERNÁ SKŘÍŇKA / BLACK BOX', 'BLACK BOX / ČERNÁ SKŘÍŇKA')+'</a><div class="tools"><div class="langIcon">'+lang+'</div><div class="consoleIcon toggleLog"></div><a href="/list"><div class="listIcon"></div></a><a href="/memex"><div class="memexIcon"></div></a></div></div>');
          con.scrollTop(con.prop('scrollHeight') - con.innerHeight());

          // disable scrolling
          disableScroll('#console', true);

          // IMPORTANT!
          setTimeout(function(){

            // load content + hide log
            $('#console').removeClass('log');
            $('#content').removeClass('fadeoutUp fadeout');

            // turn loading off
            loading('off');

          }, 300);

        }, totalDelay+100);

      // on finish loading blackbox
      } else if (data.blackbox == "loaded") {

          // zacne animovat posty do pridelenych souradnic
          loadPosts();

          // pokud probihala animace z prechozi stranky
          var mainPic = $('.mainPic');
          if (mainPic.length) {
            totalDelay += 1000; // += 1000

            setTimeout(function(){
              // odstrani obrazek po skonceni logu, i jeho parent
              // cas max 300 ==> 2×100 trvaji animovat .info divy
              mainPic.fadeOut(300, function(){
                $('#shadowMaster').remove();
              });
            }, totalDelay);

          }

      }

  // write line to log
  setTimeout(function(){

    con.append('<ul><li>'+niceJson(data)+'</li></ul>');
    con.scrollTop(con.prop('scrollHeight') - con.innerHeight());

  }, delay);

  // itt
  logCount++;

  return totalDelay;

}
