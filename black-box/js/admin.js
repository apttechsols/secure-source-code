/*
ou shit admin.js!
tady urcite je hrozne moc tajnych funkci
diky kterym to vsechno pude hacknout
je to tak, vyhral jsi, totalne to hacknes
...
rozhodne! :D
*/
import {page} from './router.js';
import {error} from './router_fce.js';



// opravit znaky co tam nepatri
function makeRight(val) {

  // return
  //return val.replace(/"|'/gi, '&apos;');
  return val.replace(/"/gi, '&quot;').replace(/'/gi, '&apos;');

}



// mazaci prompt
$(document).on('click touch', '.togglePrompt', function(){

  $('#prompt, .deleteThis.togglePrompt').slideToggle();

});



// upload obrazku
$(document).on('submit', '.uploadForm', function(e) {

  var soubory = $('#files').prop("files"),
      pocet = soubory.length,
      id = $(this).attr('idkey'),
      fromForm = new FormData();

  // pokud je nejaky soubor k nahrani
  if (pocet) {

    $('form').hide();

    // nahraje jeden po druhym
    $.each(soubory, function(i, v){

      fromForm.set("files[]", soubory[i]);

      // gaga pls make it work
      $.ajax({
          url: '/php/admin/dataUpload.php?id='+id,
          type: "POST",
          data: fromForm,
          contentType: false,
          cache: false,
          processData: false,
          beforeSend: function(e) {
            $('#fronta').append('<li id="f'+i+'">'+v['name']+' [<span class="wait"><span>.</span><span>.</span><span>.</span></span>]</li>');
          },
          success: function (data) {

            // zkusi jestli se vrati json
            try {

                var obj = JSON.parse(data);

                if (obj.status == 'success') {
                  $('#f'+i).html('<table><tr><td><img src="/data/projects/'+obj.data+'.jpg"></td><td><form method="post" act="edit" class="adminForm" table="data" idKey="'+obj.dataId+'"><input name="popis" placeholder="POPIS" autocomplete="off"><input name="popis_en" placeholder="DESCRIPTION" autocomplete="off"><input type="submit" value="ULOŽIT"></form></td></tr></table>');
                } else {
                  console.log(obj);
                  $('#f'+i).html('<s>'+v['name']+'</s> [ERROR]');
                }

            // jinak error
            } catch (e) {

                console.log(data, e);

                if (e instanceof SyntaxError) {
                    error('data not json');
                } else {
                    error('general error');
                }

            }

          },
          error: function (e) {
            console.log(e);
            $('#f'+i).html('ERROR');
          }
      });


    });

  }

  e.preventDefault();
  return false;

});



// ai kurator
$(document).on('submit', '.clusterForm', function(e) {

  var pojistka = $('input[name="pojistka"]').val();

  // pokud je nejaky soubor k nahrani
  if (pojistka.toUpperCase() == "POTVRZUJI") {

    $('form').hide();
    $('#clusterLoading').html('<strong class="red"><br>GENERUJÍ SE NOVÉ CLUSTERY</strong><br><span class="wait big"><span>.</span><span>.</span><span>.</span></span><br><strong class="red"><br>NEOPOUŠTĚJTE TUTO STRÁNKU</strong><br><br>');

      // lady gaga make it work
      $.ajax({
          type: 'POST',
          url: '/python/clustersExe.php',
          data: {'url': '../data/projects'},
          timeout: 60*60*1000, // 1h timeout
          success: function (data) {

            // zkusi jestli se vrati json
            try {

                console.log(data);
                var obj = JSON.parse(data);

                // pokud je to uspesny to generovani, tak posle vysledek do databaze
                if (obj.status == "success") {

                  $('#clusterLoading').html('<h1>CLUSTERS OK, SQL INSERT <span class="wait"><span>.</span><span>.</span><span>.</span></span></h1>');

                  // zpracuje vysledky
                  var data = JSON.stringify(obj.result.clusters);
                  console.log(data);

                  // post co to posle do databaze ten json
                  $.post('/php/admin/clustersUpload.php', {'data': data}, function(res){

                     console.log(res);
                     var result = JSON.parse(res);

                     // jestli to vyslo, napise ok!
                     if (result.status == 'success') {

                       $('#clusterLoading').html('<h1>CLUSTERY VYGENEROVÁNY A ULOŽENY</h1><ul><li><a href="/admin/clusters">potvrdit, obnovit seznam</a></li></ul>');

                     } else {

                       console.log(result);
                       $('#clusterLoading').html('<h1 class="red">SQL ERROR</h1>');
                       error('error saving results');

                     }

                  });

                } else {

                  console.log(obj);
                  $('#clusterLoading').html('<h1 class="red">CLUSTERS PYTHON ERROR</h1>');

                }

            // jinak error
            } catch (e) {

                console.log(data, e);

                if (e instanceof SyntaxError) {
                    $('#clusterLoading').html('<h1 class="red">JSON ERROR</h1>');
                    error('data not json');
                } else {
                    $('#clusterLoading').html('<h1 class="red">GENERAL ERROR</h1>');
                    error('general error');
                }

            }

          },
          error: function (e) {
            console.log(e);
            $('#clusterLoading').html('<h1 class="red">AJAX<=>PHP ERROR</h1>');
          }
      });

  } else {

    error('není napsáno "POTVRZUJI"');

  }

  e.preventDefault();

});



// zaradi do kuryra
$(document).on('touch click', '.toggleKurator', function(){

  var span = $(this),
      data = span.attr('data');

  $.post('/php/admin/data.php', {'action': 'display', 'id': data}, function(res){

    var obj = JSON.parse(res);

    switch(obj.status) {
      case 'added':
        span.removeClass('not').addClass('selected').html('[KURÁTOR-]');
      break;
      case 'removed':
        span.removeClass('selected').addClass('not').html('[KURÁTOR+]');
      break;
    }

  });

});



// pripomenout ze probehly neulozene upravy
$(document).on('change input', '.adminForm input, .adminForm textarea', function(){

  var input = $(this),
      submit = input.closest('form').find('input[type="submit"]');

  if (input.attr('name') == 'autor') {
    $('#nazevProjektu').html(input.val());
  }

  if (submit.val() == 'ULOŽENO') {
    submit.val('ULOŽIT');
  }

  submit.addClass('reminder');

});



// odeslani dat z bezneho formulare
$(document).on('submit', '.adminForm', function(e){

  // consts
  const form = $(this),
        table = form.attr('table'),
        action = form.attr('act');

  var greenLight = false,
      wrongs = [],
      params = {};

  switch (table) {

    /*
    sprava projektu
    */
    case 'projects':

      var file = '/php/admin/projects.php';

      switch (action) {

        // editace
        case 'edit':

          var id = form.attr('idkey'),
              active = $('input[name="active"]:checked').length?1:0,
              name = makeRight($('input[name="autor"]').val()),
              keywords = makeRight($('textarea[name="keywords"]').val()),
              keywords_en = makeRight($('textarea[name="keywords_en"]').val()),
              info = makeRight($('textarea[name="info"]').val()),
              info_en = makeRight($('textarea[name="info_en"]').val());

            if  (id.length && name.length && (info.length || info_en.length)) {
              var params = {'id': id, 'name': name, 'info': info, 'info_en': info_en, 'keywords': keywords, 'keywords_en': keywords_en, 'active': active, 'action': action, 'sql': true},
                  greenLight = true;
            } else {
                if (!id.length) {wrongs.push('není zadáno id');}
                if (!name.length) {wrongs.push('není vyplněno jméno');}
                if (!info.length) {wrongs.push('nic není napsáno v info');}
            }

        break;

        // pridani noveho
        case 'add':

          var name = makeRight($('input[name="autor"]').val());

            if (name.length) {
              var params = {'name': name, 'action': action, 'sql': true},
                  greenLight = true;
            } else {
              wrongs.push('není vyplněno jméno');
            }

        break;

      }

    break;


    /*
    sprava dat v projektech
    */
    case 'data':

      var file = '/php/admin/data.php';

      switch (action) {

        // editace
        case 'edit':

          var id = form.attr('idkey'),
              popis = form.find('input[name="popis"]').val(),
              popis_en = form.find('input[name="popis_en"]').val();

            if  (id.length && (popis.length || popis_en.length)) {
              var params = {'id': id, 'popis': popis, 'popis_en': popis_en, 'active': active, 'action': action, 'sql': true},
                  greenLight = true;
            } else {
                if (!id.length) {wrongs.push('není zadáno id');}
                if (!popis.length) {wrongs.push('není vyplněn popis [cs]');}
                if (!popis_en.length) {wrongs.push('není vyplněn popis [en]');}
            }

        break;

        // pridani noveho resi funkce nahore

      }

    break;

  }

  // pouze pokud je odslouhlaseno ze jdem na vec
  if (greenLight) {

    $.post(file, params, function(res){

      var obj = JSON.parse(res);

      if (obj.status == "success") {

        switch(table) {
          case 'data':
            $('form[idKey='+obj.id+']').find('input[type="submit"]').val('ULOŽENO').removeClass('reminder');
          break;
          default:
            page('/admin/'+table+'/edit/'+obj.id);
          break;
        }

      } else {
        error('db error');
      }

    });

  // nebo ukaze co je spatne
  } else {
    error(wrongs.join('\n'));
  }

  // prevent default return false
  // return false;
  // prevent def
  e.preventDefault();

});
