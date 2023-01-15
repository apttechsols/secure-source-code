/*
memex, resi zobrazeni projektu na hl. strance
input json
lady gaga would adore
*/
import {log} from './loader.js';

// MEMEX
// udela boxy pro umco ve forme memexu
export function memex() {

  log({"memex": "loading started"});
  log({"projects": "loading started"});

  // constants
        // kolik je projektu
  const projects = $('.prj').length,

        // velikosti elementu
        win = {"h": $(window).height(),
               "w": $(window).width()},
        obj = {"h": $('.prj').height(),
               "w": $('.prj').width()},
        // tol = hv tolerance, t = obj size tolerance
        tol = 2,
        t = {"w": Math.floor(obj.w/win.w*100),
             "h": Math.floor(obj.h/win.h*100)},
        // limit je kolik % je odskok z kraje obrazovky
        limit = {"x": t.w/2,
                 "y": t.h/2},
        // pocet projektu na stranku, multiplier
        pns = 100/t.w,
        pnsMlt = 1.1,
        // limit for trying to find chords
        //438 = rekl sem kaji at rekne nahodne cislo
        passLimit = projects*43.8*pnsMlt;

      // pole pro vysledne koordinaty
  var ress = [],
      // pocet iteraci v each pro projekty
      itt = 0,
      // sirka platna
      minWidth = 100;


  // pokud je vic nez X projektu, zvetsit obrazovku
  if (projects > pns/pnsMlt) {
    minWidth = projects/pns*100/pnsMlt;
    $('#content').addClass('grabber');
    // +10 ==> side panel
    $('#content').prepend($('<div>', {id: 'pixelhelper', css: {left: minWidth+10+'vw'}}));
  }


  // generovani koordinatu
  function chords() {

    var seed = Math.random()<0.5?(-1):1;
        // -10 + 10 ==> vlevo aby byl odskok
    var x = Math.floor(Math.random()*(minWidth-10-limit.x))+limit.x/2+10,
        /*
        without seed
        // 75 + 15 ==> odskok shora kvuli liste, a zespoda kvuli vzhledu
        y = Math.floor(Math.random()*(75-limit.y))+limit.y/2+15;
        */
        // change top/bot acc to seed == part random
        y = (Math.floor(Math.random()*(20-limit.y))+limit.y/2+10)*seed+50;

    return {"x": x, "y": y};

  }


  // testovani koordinatu
  function chord_tester(pos, pass) {

    var faulty = false;

      // test jestli nenarazi do jineho projektu
      if (ress.length > 0) {
        for (var i = 0; i < ress.length; i++) {

          if (pos.x-tol < ress[i].x+t.w && pos.x+t.w > ress[i].x-tol &&
              pos.y-tol < ress[i].y+t.h && pos.y+t.h > ress[i].y-tol) {
            faulty = true;
            break;
          }

        }
      }

    // posle vysledek zpet do whilu
    // pass ==> pokud while jede uz po XXX. pusti i spatne vysledky // 333
    if (faulty == true && pass < passLimit) {
      return false;
    } else {
      ress.push({"x": pos.x, "y": pos.y});
      if (pass > passLimit-2) {
        log({"fce": "chord_tester", "chords": ress[ress.length-1], "passed": false, "msg": "failed at ["+pass+"] tries, abort & setting random chords"});
      } else {
        log({"fce": "chord_tester", "chords": ress[ress.length-1], "passed": true, "msg": "passed at ["+pass+"] try"});
      }
      return true;
    }

  }


  // load sidekick obrazky
  function loadSidekicks(imgs) {

    // vars
    var base = 3,
        mpl = {"l": Math.random()<0.5?(-1):1,
               "t": Math.random()<0.5?(-1):1},
        rand = {"x": mpl.l*(base+Math.random()*base+base),
                "y": mpl.t*(base+Math.random()*base/2)};

    // pro oba sidekick obrazky v projektu
    $(imgs[0]).css({marginLeft: rand.x+'vh', marginTop: rand.y+'vh'});
    $(imgs[1]).css({marginLeft: rand.x*(-1)+'vh', marginTop: rand.y*(-1)+'vh'});

    log({"fce": "sidekick_img", "chords": rand});

  }

  // MEMEX ==> hlavni funkce
  // for every project
  $('.prj').each(function() {

    var prj = $(this),
        pos = chords(),
        pass = 0,
        rand = {"delay": (-1)*(5000+Math.random()*5000)/1000,
                "dur": (15000+Math.random()*5000)/1000};

    // nastavi unikatni souradnice
    while (chord_tester(pos, pass) == false) {
      pos = chords();
      pass++;
    }

    // nastaveni koordinatu projektu
    prj.css({top: pos.y+'vh', left: pos.x+'vw', 'animation-delay': rand.delay+'s', 'animation-duration': rand.dur+'s'});

    loadSidekicks(prj.find('.sidekick'));

    itt++;

        // po poslednim umisteni projektu spustit linkovani
        if (itt == projects) {
          log({"projects": "loaded"});
          links('memex');
        }

  });

  var scrollCenter = $('#content').width() * (minWidth / 100) / 2 - $(window).width() / 2;
  $('#content').animate({scrollLeft: scrollCenter}, 1000);

}


/*
resi prepocteni linku
*/
// LINKS
// vytvoreni linku (car) mezi projektama
export function links(call) {

    log({"connections": "loading started"});

    // constants
    var net = [],
        netKey = [],
        project = [],
        itt = 0;

    // if resize, make <br> in log :D ==> for design
    if (call == 'resize') {
        $('#console').append('<br><br>');
        log({"connections": "relocation started"});
    }

    // funkce na testovani duplicity konexi
    function inNet(match) {

        // projde kazdou polozku v netu
        for (var n = 0; n < net.length; n++) {

            // porovna jestli nejde o duplikat
            if (net[n][0] == match[0] && net[n][1] == match[1]) {
                return true;
            }
        }

        return false;
    }

    // vraci klice pro dane ID projektu
    function matchKeywords(id) {

      var keywords = [];
      $.each(netKey, function(i, tag){

        // testuje 2 varianty, sort nefunguje?
        if (tag[0] == id[0] || tag[0] == id[1]) {
          keywords.push('#'+tag[1]);
        }

      });

      return keywords.join(" ― ");

    }

    // nahraje tagy a pozice z kazdeho projektu
    $('.prj').each(function() {

      var prj = $(this),
          obj = {"h": prj.height(),
                 "w": prj.width(),
                 "x": parseInt(prj.css('left'), 10),
                 "y": parseInt(prj.css('top'), 10)},
          tags = prj.attr('tags'),
          id = prj.attr('id');

          // nahraje do objektu vsechny udaje o projektu
          project.push({"id": id, "obj": obj, "tag": tags.split(",")});

          log(project[project.length-1]);

    });

    // create array of connections
    // console.log(project);
    // projede vsechny projekty
    $.each(project, function(i, pr){

      // projede vsechny tagy v projektu pokud ma nejake tagy
      if (pr.tag.length > 0 && pr.tag[0] != '') {
      $.each(pr.tag, function(ti, tg){

        // porovna je se vsema ostatnima tagama v ostatnich projektech
        $.each(project, function(li, lpr){

          // pokud uz se projekt prochazel, nevyhodnocuje ho
          if (i < li) {

            // otestovat pokud se najde shoda
            var shoda = lpr.tag.indexOf(tg);
            if (shoda != -1) {

              // pokud se nasha shoda, otestovat jestli uz neni v netu
              var match = [project[i].id, project[li].id].sort();

              // jestli jeste neni v poli, pridat shodu
              if (!inNet(match)) {
                net.push(match);
              }

              // id = pozice v net poli, keyword ve kterem se shoduji
              netKey.push([project[i].id+project[li].id, tg]);

              // to log
              log(match);

            }

          }

        });

      });
      }

    });

    //console.log(netKey);

    // pro kazdou konexi vytvori cary mezi nima
    $.each(net, function(){

      //console.log(net[itt][0], net[itt][1]);
      // najde o kterou polozku v poli se jedna a vraci objekt
      var spoj = $(this),
          obj1 = project.find(o => o.id === spoj[0]),
          obj2 = project.find(o => o.id === spoj[1]),
          limit = 3,
          lim = {"x1": obj1.obj.w/limit,
                 "y1": obj1.obj.h/limit,
                 "x2": obj2.obj.w/limit,
                 "y2": obj2.obj.h/limit};

      // nasetuje x a y souradnice pro zacatek a konec cary
      var chor = {"x1": Math.random() * (obj1.obj.w - lim.x1*2) + (obj1.obj.x - obj1.obj.w/2) + lim.x1,
                  "y1": Math.random() * (obj1.obj.h - lim.y1*2) + (obj1.obj.y - obj1.obj.h/2) + lim.y1,
                  "x2": Math.random() * (obj2.obj.w - lim.x2*2) + (obj2.obj.x - obj2.obj.w/2) + lim.x2,
                  "y2": Math.random() * (obj2.obj.h - lim.y2*2) + (obj2.obj.y - obj2.obj.h/2) + lim.y2};

      // spocita atributy cary, i delku a uhel (len+ang)
      var len = Math.sqrt(((chor.x2-chor.x1)*(chor.x2-chor.x1))+((chor.y2-chor.y1)*(chor.y2-chor.y1))),
          attr = {"t": ((chor.y1+chor.y2)/2),
                  "l": ((chor.x1+chor.x2)/2-len/2),
                  "len": len,
                  "ang": Math.atan2((chor.y1-chor.y2),(chor.x1-chor.x2))*(180/Math.PI)
                 },
          // nevim proc ale nejdou seradit pomoc .sort()
          // takze testuju obe varianty spojeni...
          spojnice = [net[itt][0]+net[itt][1], net[itt][1]+net[itt][0]],
          keys = matchKeywords(spojnice);

      log({attr, "match_tags": keys});

      // repair angle
      if (attr.ang < -90) {
        attr.ang = attr.ang+180;
      } else if (attr.ang > 90) {
        attr.ang = attr.ang-180;
      }

      // vykresli caru
      $('#content')
      .append($('<div>',{class: 'line',
                         //id: +net[itt][0]+net[itt][1],
                         css:   {top: attr.t+'px',
                                 left: attr.l+'px', // attr.l/win.w*100+'vw'
                                 width: attr.len+'px', // 'calc(100vw / 100vh * 1vh * '+attr.len+' / 100vh)' ? nefunguje
                                 transform: "rotate("+attr.ang+"deg)"
                                 /*
                                 "animation-delay": +'s',
                                 "animation-duration": attr.dur+'s'
                                 */
                               }
                        })
      .html('<div class="keys">'+keys+'</div>')
      .attr('baseX', obj1.obj.x).attr('baseX2', obj2.obj.x)
      .delay(itt*100).animate({opacity: 1}, 1000, function(){

          // neco jeste?

      }));

      // zakonci log po posledni lince
      if (itt == net.length-1) {

        log({"connections": "loaded"});

        // pokud dochazi k repaintu linek kvuli resize okna
        if (call == 'resize') {
          log({"connections": "relocation finised"});
          log({"finish": true});
        }

      }

      itt++;

    });


}

/*
* praise lady gaga
*/
