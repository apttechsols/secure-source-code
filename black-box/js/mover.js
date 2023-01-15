/*
* TERMS OF USE mover.js
* Open source under the BSD License.
* Copyright 2020 Oliver Stasa. All rights reserved.
*
* plati pro divy co maji class .moveable
* daji se chytit a da se s nema hybat, necekane...
*/
$(function(){

  // constants
  var grabMov = false,
      curMov = {"x": 0, "y": 0},
      win = {"h": $(window).height(),
             "w": $(window).width()};

  $(window).on('resize', function(){
    win = {"h": $(window).height(),
           "w": $(window).width()};
  });

  // z index default na 10, blackbox() vyzaduje 3+
  window.zindex = 10;

  // id objektu kterym hybu
  window.moveId = false;


  // main fce
  // pohyb mysi
  const moveMov = function(e) {

    var moving = $('.moving'),
        mover = {"pos": moving.position(),
                 "h": moving.height(),
                 "w": moving.width()};

    // overuje ze sme v pohybu a ze sme nad spravnym divem
    if (grabMov && window.moveId == moving.attr('id')) {

      var movement = {"x": e.pageX || e.originalEvent.touches[0].pageX,
                      "y": e.pageY || e.originalEvent.touches[0].pageY};

      // presun na pozici dle posunuti
      var moveX = movement.x+curMov.x,
          moveY = movement.y+curMov.y;

      // ochrana proti zahozeni objektu mimo obrazovku ==> zastavi v pulce objektu
      // zastavit na kraji objektu ==> if (moveX < win.w-mover.w/2 && moveX > mover.w/2)
      if (moveX < win.w && moveX > 0) {
        moving.css({left: moveX});
      }
      if (moveY < win.h && moveY > 0) {
        moving.css({top: moveY});
      }

    }

  };

  // ukonceni movementu
  const outMov = function(e) {

    grabMov = false;

      // odstrani grabbed rucku
      $('.moveable').removeClass('moving');

      // vypnout event listenery
      $(document).off('mousemove touchmove', moveMov);
      $(document).off('mouseup blur touchend', outMov);

  };

  // zacatek grabu
  $(document).on('mousedown touchstart', '.moveable', function(e) {

    // pozice
    var obj = $(this),
        mover = {"pos": obj.position(),
                 "h": obj.height(),
                 "w": obj.width()},
        movement = {"x": e.pageX || e.originalEvent.touches[0].pageX,
                    "y": e.pageY || e.originalEvent.touches[0].pageY};


    // zastavi animovani, pokud se deje
    obj.stop();
    // prevent default pro touch eventy
    // e.preventDefault();

    // zabezpecujici id
    window.moveId = obj.attr('id');

    // pocatecni pozice
    curMov.x = mover.pos.left + mover.w/2 - movement.x;
    curMov.y = mover.pos.top + mover.h/2 - movement.y;

    // potvrzuje grab
    grabMov = true;

    // zvysuje z-index oproti poslednimu kliknutemu
    window.zindex++;

    // zapne grabbed rucku
    obj.addClass('moving');

    // pokud se nejedna o info ktere ma z-index ve vesmiru, preda z-index
    //if (!obj.hasClass('info')) {
      obj.css({"z-index": window.zindex});
    //}

      // event listenery
      $(document).on('mousemove touchmove', moveMov);
      $(document).on('mouseup blur touchend', outMov);

  });

});
