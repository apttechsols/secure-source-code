      </div>
      <div class="container my-auto py-5">
        <div class="copyright text-center my-auto">
          <span>Copyright &copy; <a target="_blank" href="<?php echo site_footer_url; ?>"><?php echo site_footer_name; ?></a><?php echo ', '.date('Y') ?></span>
        </div>
      </div>
      </main>
      <!-- ========== END MAIN CONTENT ========== -->
      <!-- ========== SECONDARY CONTENTS ========== -->
      <!-- ========== END SECONDARY CONTENTS ========== -->
      <!-- ========== VENDER JAVASCRIPT ========== -->
      <script src="<?php echo current_protocol_domain; ?>/system/theme/theme3/vendor/jquery/jquery.min.js"></script>
      <script src="<?php echo current_protocol_domain; ?>/system/theme/theme3/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

      <!-- Core plugin JavaScript-->
      <script src="<?php echo current_protocol_domain; ?>/system/theme/theme3/vendor/jquery-easing/jquery.easing.min.js"></script>
      <!-- ========== VENDER JAVASCRIPT ========== -->
      <!-- JS Plugins -->
      <script src="<?php echo current_protocol_domain; ?>/system/theme/theme1/js/demo1.1.js"></script>
      <!-- JS Implementing Plugins -->
      <script src="<?php echo current_protocol_domain; ?>/system/theme/theme1/js/vendor.min.js"></script>
      <!-- JS Front -->
      <script src="<?php echo current_protocol_domain; ?>/system/theme/theme1/js/theme.min.js"></script>

      <!-- Javascript bootstrap sb admin -->
      <script src="<?php echo current_protocol_domain; ?>/system/theme/theme2/js/sb-admin-2.min.js"></script>
      <!-- MDB ESSENTIAL -->
      <script type="text/javascript" src="<?php echo current_protocol_domain; ?>/system/theme/theme1/mdb-ui-kit-pro-advanced-3.0.0/js/mdb.min.js"></script>
      <!-- MDB PLUGINS -->
      <script type="text/javascript" src="<?php echo current_protocol_domain; ?>/system/theme/theme1/mdb-ui-kit-pro-advanced-3.0.0/plugins/js/all.min.js"></script>
      <script>
        $('.header_menu_topic_choose').click(function(){
          if(window.location.pathname != '/' && window.location.pathname != '/index.php' && window.location.pathname != '/index.html'){
            topic = $(this).attr('topic');
            window.location.href = "<?php echo current_protocol_domain; ?>/?set_topic="+topic;
          }
        });
      </script>
      <!-- JS Plugins Init. -->
      <script>
         $(document).on('ready', function () {
           // ONLY DEV
           
             if (window.localStorage.getItem('hs-builder-popover') === null) {
               $('#builderPopover').popover('show');
         
               $(document).on('click', '#closeBuilderPopover' , function() {
                 window.localStorage.setItem('hs-builder-popover', true);
                 $('#builderPopover').popover('dispose');
               });
             } else {
               $('#builderPopover').on('show.bs.popover', function () {
                 return false
               });
             }
           
           // END ONLY DEV
         
           $('.js-navbar-vertical-aside-toggle-invoker').click(function () {
             $('.js-navbar-vertical-aside-toggle-invoker i').tooltip('hide');
           });
         
           
             // initialization of mega menu
             var megaMenu = new HSMegaMenu($('.js-mega-menu'), {
               desktop: {
                 position: 'left'
               }
             }).init();
           
         
           // initialization of navbar vertical navigation
           var sidebar = $('.js-navbar-vertical-aside').hsSideNav();
         
           // initialization of tooltip in navbar vertical menu
           $('.js-nav-tooltip-link').tooltip({ boundary: 'window' })
         
           $(".js-nav-tooltip-link").on("show.bs.tooltip", function(e) {
             if (!$("body").hasClass("navbar-vertical-aside-mini-mode")) {
               return false;
             }
           });
         
           // initialization of unfold
           $('.js-hs-unfold-invoker').each(function () {
             var unfold = new HSUnfold($(this)).init();
           });
         
           // initialization of form search
           $('.js-form-search').each(function () {
             new HSFormSearch($(this)).init()
           });
         
           // initialization of select2
           $('.js-select2-custom').each(function () {
             var select2 = $.HSCore.components.HSSelect2.init($(this));
           });
         
           // initialization of chartjs
           Chart.plugins.unregister(ChartDataLabels);
         
           $('.js-chart').each(function () {
             $.HSCore.components.HSChartJS.init($(this));
           });
         
           var updatingChart = $.HSCore.components.HSChartJS.init($('#updatingData'));
         
           // Call when tab is clicked
           $('[data-toggle="chart-bar"]').click(function(e) {
             let keyDataset = $(e.currentTarget).attr('data-datasets')
         
            if (keyDataset === 'lastWeek') {
              updatingChart.data.labels = ["Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26", "Apr 27", "Apr 28", "Apr 29", "Apr 30", "Apr 31"];
              updatingChart.data.datasets = [
                {
                  "data": [120, 250, 300, 200, 300, 290, 350, 100, 125, 320],
                  "backgroundColor": "#377dff",
                  "hoverBackgroundColor": "#377dff",
                  "borderColor": "#377dff"
                },
                {
                  "data": [250, 130, 322, 144, 129, 300, 260, 120, 260, 245, 110],
                  "backgroundColor": "#e7eaf3",
                  "borderColor": "#e7eaf3"
                }
              ];
              updatingChart.update();
            } else {
              updatingChart.data.labels = ["May 1", "May 2", "May 3", "May 4", "May 5", "May 6", "May 7", "May 8", "May 9", "May 10"];
              updatingChart.data.datasets = [
                {
                  "data": [200, 300, 290, 350, 150, 350, 300, 100, 125, 220],
                  "backgroundColor": "#377dff",
                  "hoverBackgroundColor": "#377dff",
                  "borderColor": "#377dff"
                },
                {
                  "data": [150, 230, 382, 204, 169, 290, 300, 100, 300, 225, 120],
                  "backgroundColor": "#e7eaf3",
                  "borderColor": "#e7eaf3"
                }
              ]
              updatingChart.update();
            }
           })
         
           // initialization of bubble chartjs with Datalabels plugin
           $('.js-chart-datalabels').each(function () {
             $.HSCore.components.HSChartJS.init($(this), {
               plugins: [ChartDataLabels],
               options: {
                 plugins: {
                   datalabels: {
                     anchor: function(context) {
                       var value = context.dataset.data[context.dataIndex];
                       return value.r < 20 ? 'end' : 'center';
                     },
                     align: function(context) {
                       var value = context.dataset.data[context.dataIndex];
                       return value.r < 20 ? 'end' : 'center';
                     },
                     color: function(context) {
                       var value = context.dataset.data[context.dataIndex];
                       return value.r < 20 ? context.dataset.backgroundColor : context.dataset.color;
                     },
                     font: function(context) {
                       var value = context.dataset.data[context.dataIndex],
                         fontSize = 25;
         
                       if (value.r > 50) {
                         fontSize = 35;
                       }
         
                       if (value.r > 70) {
                         fontSize = 55;
                       }
         
                       return {
                         weight: 'lighter',
                         size: fontSize
                       };
                     },
                     offset: 2,
                     padding: 0
                   }
                 }
               },
             });
           });
         
           // initialization of daterangepicker
           $('.js-daterangepicker').daterangepicker();
         
           $('.js-daterangepicker-times').daterangepicker({
             timePicker: true,
             startDate: moment().startOf('hour'),
             endDate: moment().startOf('hour').add(32, 'hour'),
             locale: {
               format: 'M/DD hh:mm A'
             }
           });
         
           var start = moment();
           var end = moment();
         
           function cb(start, end) {
             $('#js-daterangepicker-predefined .js-daterangepicker-predefined-preview').html(start.format('MMM D') + ' - ' + end.format('MMM D, YYYY'));
           }
         
           $('#js-daterangepicker-predefined').daterangepicker({
             startDate: start,
             endDate: end,
             ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
             }
           }, cb);
         
           cb(start, end);
         
           // initialization of datatables
           var datatable = $.HSCore.components.HSDatatables.init($('#datatable'), {
             select: {
               style: 'multi',
               selector: 'td:first-child input[type="checkbox"]',
               classMap: {
                 checkAll: '#datatableCheckAll',
                 counter: '#datatableCounter',
                 counterInfo: '#datatableCounterInfo'
               }
             },
             language: {
               zeroRecords: '<div class="text-center p-4">' +
                   '<img class="mb-3" src="./assets/svg/illustrations/sorry.svg" alt="Image Description" style="width: 7rem;">' +
                   '<p class="mb-0">No data to show</p>' +
                   '</div>'
             }
           });
         
           $('.js-datatable-filter').on('change', function() {
             var $this = $(this),
               elVal = $this.val(),
               targetColumnIndex = $this.data('target-column-index');
         
             datatable.column(targetColumnIndex).search(elVal).draw();
           });
         
           $('#datatableSearch').on('mouseup', function (e) {
             var $input = $(this),
               oldValue = $input.val();
         
             if (oldValue == "") return;
         
             setTimeout(function(){
               var newValue = $input.val();
         
               if (newValue == ""){
                 // Gotcha
                 datatable.search('').draw();
               }
             }, 1);
           });
         
           // initialization of clipboard
           $('.js-clipboard').each(function() {
             var clipboard = $.HSCore.components.HSClipboard.init(this);
           });
         });
      </script>
      <!-- IE Support -->
      <script>
         if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) document.write('<script src="<?php echo current_protocol_domain; ?>/system/theme/theme1/vendor/babel-polyfill/polyfill.min.js"><\/script>');
      </script>
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
      <?php if(isset($alert_message['status']) and isset($alert_message['time']) and isset($alert_message['type']) and isset($alert_message['msg']) and strlen($alert_message['msg']) > 0 and $alert_message['time']+30 >= time()){ ?>
            <script>
                Swal.fire("<?php echo $alert_message['title'] ? $alert_message['title'] : ''; ?>","<?php echo $alert_message['msg']; ?>","<?php echo $alert_message['status']; ?>");
            </script>
        <?php } else if (isset($_GET['status']) and isset($_GET['time']) and isset($_GET['type']) and isset($_GET['msg']) and strlen($_GET['msg']) > 0 and $_GET['time']+30 >= time()) { ?>
            <script>
                Swal.fire("<?php echo $_GET['title'] ? $_GET['title'] : ''; ?>","<?php echo $_GET['msg']; ?>","<?php echo $_GET['status']; ?>");
            </script>
        <?php } ?>
      <script>
        $("#topic-based-news-response-preview-btn").click(function(){
          $("#topic-based-news-response-preview-form-btn").click();
        });
        $("#icontent-topic-based-news-response-preview-btn").click(function(){
          $("#icontent-topic-based-news-response-preview-form-btn").click();
        });
        $("#snipper-topic-based-news-response-preview-btn").click(function(){
          $("#snipper-topic-based-news-response-preview-form-btn").click();
        });
      </script>
      <script src="https://cdn.jsdelivr.net/npm/js-sha3" async=""></script>
      <script src='https://cdn.jsdelivr.net/npm/fingerprintjs2@2/dist/fingerprint2.min.js'></script>
   </body>
   <!-- t1gy -->
</html>