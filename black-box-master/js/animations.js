// MEMEX
export function memex() {

  // constants
        // kolik je projektu
  const projects = $('.prj').length,

        // velikosti elementu
        win = {"h": $(window).height(),
               "w": $(window).width()},
        obj = {"h": $('.prj').height(),
               "w": $('.prj').width()},
        // t = tolerance, 5 = bezpecny odstup
        t = {"w": Math.floor(obj.h/win.w*100)+0,
             "h": Math.floor(obj.h/win.h*100)+0},
        // limit je kolik % je odskok z kraje obrazovky
        limit = {"x": t.w/2,
                 "y": t.h/2},
        // pocet projektu na stranku
        pns = 100/t.w;

      // pole pro vysledne koordinaty
  var ress = [],
      // pocet iteraci v each pro projekty
      itt = 0,
      // sirka platna
      minWidth = 100;


  // pokud je vic nez X projektu, zvetsit obrazovku
  if (projects > pns) {
    minWidth = pns*70;
    $('#content').addClass('grabber');
  }


  // generovani koordinatu
  function chords() {

    var x = Math.floor(Math.random()*(minWidth-limit.x*2))+limit.x,
        // 95 + 5 ==> odskok 5vh shora kvuli liste
        y = Math.floor(Math.random()*(95-limit.y*2))+limit.y+5;

    return {"x": x, "y": y};

  }


  // testovani koordinatu
  function chord_tester(pos, pass) {

    var faulty = false;

      // test jestli nenarazi do jineho projektu
      if (ress.length > 0) {
        for (var i = 0; i < ress.length; i++) {

          if (pos.x < ress[i].x+t.w && pos.x+t.w > ress[i].x &&
              pos.y < ress[i].y+t.h && pos.y+t.h > ress[i].y) {
            faulty = true;
            break;
          }

        }
      }

    // posle vysledek zpet do whilu
    // pass ==> pokud while jede uz po 100. pusti i spatne vysledky
    if (faulty == true && pass < 100) {
      return false;
    } else {
      ress.push({"x": pos.x, "y": pos.y});
      return true;
    }

  }


  // for every object
  $('.prj').each(function() {

    var prj = $(this),
        pos = chords(),
        pass = 0;

    while (chord_tester(pos, pass) == false) {
      pos = chords();
      pass++;
    }

    // animace
    setTimeout(function(){
      prj.css({top: pos.y+'vh', left: pos.x+'vw'});
      prj.removeClass('fadeout');
    }, itt*(1/projects)*1000);

    itt++;

  });

  var scrollCenter = $('#content').width() * (minWidth / 100) / 2 - $(window).width() / 2;
  $('#content').animate({scrollLeft: scrollCenter}, 1000);

}
