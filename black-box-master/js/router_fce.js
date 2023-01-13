/*
obecne funkce
venuji lady gaga
*/



/*
error handler
*/
export function error(e) {

  alert(e);

}



/*
loading lista
*/
export function loading(e) {

  switch (e) {

    case 'on':

      // blinder zaslepi klikani na html pred fade-in
      if (!$('#blinder').length) {
        $('body').append($('<div>', {id: 'blinder'}));
      }

      // zapina loading bary
      if (!$('.loading').length) {
        $('body').append('<div class="loading t"></div><div class="loading r"></div><div class="loading b"></div><div class="loading l"></div>');
          $('.loading').fadeIn(100, function(){
            // set interval => pojistka? (dole)
          });
      }

      // timeout nahravani, at netrva dlouho, kdyztak error
      window.timeout = setTimeout(function(){
        loading('off');
        error('request timeout, please reload page');
      }, 120*1000);

    break;

    case 'off':

      // blinder zmizi
      if ($('#blinder').length) {
        $('#blinder').remove();
      }

      // loading zmizi
      $('.loading').fadeOut(500,
      function() {
        $('.loading').remove();
      });

      clearTimeout(window.timeout);

    break;

  }

}



/*
prida title strance a upravi jeji url
*/
export function title(new_url) {

  var title = new_url;
  new_url = location.protocol+'//'+location.host+''+new_url;

  // TITLE A URL
  $.post('/php/title.php', {url: title}, function(title) {
      document.title = title;
      window.history.pushState("object or string", title, new_url);
  });

}



/*
vypina moznost scrollovat pro urcity element
*/
export function disableScroll(elem, state) {

  const noScroll = function(e){
    e.preventDefault();
  }

  switch (state) {
    case 'toggle':
      if ($(elem).hasClass('disableScroll')) {
        $(elem).off().removeClass('disableScroll');
      } else {
        $(elem).on('wheel', noScroll).addClass('disableScroll');
      }
    break;
    case true:
      $(elem).on('wheel', noScroll).addClass('disableScroll');
    break;
    case false:
      $(elem).off().removeClass('disableScroll');
    break;
  }

}



/*
toggle konzole
*/
export function consoleToggle(){

  const con = $('#console');

  // prepne tridy a z neaktivni scrollovaci
  con.toggleClass('log grabber');
  disableScroll('#console', 'toggle');

  // zastavit vsechny animace a posunout zase na konec k napisu blackbox
  con.stop().animate({scrollTop: con.prop('scrollHeight') - con.innerHeight()}, 500);

}



/*
naloaduje MENU do stranky
*/
export function menu(action) {

  switch (action) {

    // vytvori div s menu
    case 'create':

      if (!$('#menu').length) {

        $.get('/php/page/menu.php', function(obsah){

            $('body').append($('<div>', {id: 'menu', class: 'hidden'}).html(obsah).delay(500).queue(function(){
              $(this).removeClass('hidden').dequeue();
            }));

        });

      }

    break;

    // zobrazi/skryje menu (nevim jestli to vubec mam programovat ale necham to tady otevreny...)
    case 'toggle':

    break;



  }

}



/*
menu tlaticka spinace obsahu
*/
export function menuContent(id) {

  function toggleMenu(id) {

    // aby vzdycky byla ta karta dole pod ostatnima
    $('.text').css({"z-index": 3});
    $('#'+id).css({"z-index": 1});

    // ktera karta se ma zobrazit a ktera schovat
    if ($('#'+id).hasClass('show')) {
      $('.text').removeClass('show');
    } else {
      $('.text').removeClass('show');
      $('#'+id).addClass('show');
    }

  }

  var content = $('#'+id).find('.content');

  // pokud neni zadny content, tak ho vytvori
  if (!content.length) {

    loading('on');

    // ktery conent se ma nahrat
    switch (id) {
      case 't1': var file = '/php/page/content/oprojektu.php'; break;
      case 't2': var file = '/php/page/content/kuratori.php'; break;
      case 't3': var file = '/php/page/content/teorie.php'; break;
    }

    // nahraje je do fajlu
    $.get(file, function(res){

      $('#'+id).prepend($('<div>', {class: 'content grabber'}).html(res).addClass('loaded'));
      setTimeout(function(){

          toggleMenu(id);
          loading('off');

      }, 1);

    });

  // jinak kdyz uz je vytvorenej, tak ho jen znova zobrazi
  } else {
    toggleMenu(id);
  }

}



/*
kontrolor jestli je stranka horizontalni, vraci true/false
*/
export function isHorizontal(){

  var win = {'w': $(window).width(),
             'h': $(window).height()};

  // pokud je vertikalni obraz
  if (win.w/win.h < 1) {
    // ukaze div s obrazkem at si otoci telefon
    if (!$('#turnHorizontal').length) {
    	$('body').append($('<div>', {id: 'turnHorizontal', class: 'fadeout'}).delay(500).queue(function(){$(this).removeClass('fadeout').dequeue();}));
    }
    // vrati false
    return false;
  // pokud je horizontalni obraz
  } else {
    // pokud je div s legendou, odstrani ho
    if ($('#turnHorizontal').length) {
      $('#turnHorizontal').remove();
    }
    // vrati false
    return true;
  }

}



/*
prepinac jazyku
*/
export function jazyk(cz, en) {

  switch($('html').attr('lang')) {
    case 'cs': return cz; break;
    default: case 'en': return en; break;
  }

}



/*
EOF
*/



/*
just kidding
love your godess lady gaga
*/
