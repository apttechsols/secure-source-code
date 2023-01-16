<?php require_once($_SERVER['DOCUMENT_ROOT']."/system/main/comman_control/_frontend.php"); ?>
<!DOCTYPE html>
<html lang="en">
   <!-- t1gy -->
   <head>
      <!-- Required Meta Tags Always Come First -->
      <meta charset="utf-8">
      <meta http-equiv="Content-Type" content="text/html; charset=gb18030">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <!-- Title -->
      <title><?php echo defined('browser_page_title')? browser_page_title : (defined('site_name')?site_name : null); ?></title>
      <!-- Favicon -->
      <link rel="shortcut icon" href="favicon.ico">
      <!-- Font -->
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&amp;display=swap" rel="stylesheet">
      <!-- Custom fonts for this template-->
      <link href="<?php echo current_protocol_domain; ?>/system/theme/theme2/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
      <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
      <!-- MDB ESSENTIAL -->
      <link rel="stylesheet" href="<?php echo current_protocol_domain; ?>/system/plugin/mdb/mdb-ui-kit-pro-advanced-3.0.0/css/mdb.min.css" />
      <!-- MDB PLUGINS -->
      <link rel="stylesheet" href="<?php echo current_protocol_domain; ?>/system/plugin/mdb/mdb-ui-kit-pro-advanced-3.0.0/plugins/css/all.min.css" />
      <!-- CSS Implementing Plugins -->
      <link rel="stylesheet" href="<?php echo current_protocol_domain; ?>/system/theme/theme1/css/vendor.min.css">
      <link rel="stylesheet" href="<?php echo current_protocol_domain; ?>/system/theme/theme1/vendor/icon-set/style.css">
      <!-- CSS bootstrap-sb-admin Template -->
      <?php require_once($_SERVER['DOCUMENT_ROOT']."/system/theme/theme1/css/bootstrap-sb-admin-css.php"); ?>
      <!-- CSS Front Template -->
      <link rel="stylesheet" href="<?php echo current_protocol_domain; ?>/system/theme/theme1/css/theme.minc619.css?v=1.0">
      <style>
         .navbar .dropdown-menu a:not(.active){
            color: #1e2022;
         }
         .navbar .dropdown-menu a {
            padding: .375rem 1.5rem;
            font-size: .8125rem;
            font-weight: 400;
         }
         a.waves-effect, a.waves-light {
            display: flex;
         }
         .nav-tabs .nav-link {
            text-transform: unset;
            line-height: unset;
            font-weight: unset;
            font-size: unset;
            color: unset;
         }
         .js-nav-tooltip-link.nav-link.waves-effect.waves-light:hover {
            color: #192b58 !important;
         }
         .nav-tabs .nav-item.show .nav-link{
            color: #fff!important;
         }
         .js-nav-tooltip-link.nav-link.active.waves-effect.waves-light:hover{
            color: #192b58 !important;
            background: #fff!important;
         }
      </style>
      <style>
         .navbar-dark .navbar-nav .nav-link{
            color:#fff;
         }
         .nav-link:hover{
            /* background: transparent !important; */
            color: #192b58!important;
         }
         .nav-link.active{
            border-left-color: #377dff !important;
         }
        main{
          max-width:100%;
          width:100%;
          overflow: hidden;
        }
        #content_only{
           min-height: calc(100vh - 205px);
        }

        .navbar-vertical-content{
            /* overflow-y: hidden!important; */
        }
        .navbar-vertical-content {
            height: calc(100%)!important;
        }

        .nav-icon{
          font-size: 14px;
        }

        .select2-container .select2-selection--single{
           min-height:38px!important;
        }

        .select2-container--default .select2-selection--single .select2-selection__rendered{
           line-height:38px!important;
        }
        
         .select2-container--default .select2-selection--single .select2-selection__arrow{
            min-height:36px!important;
         }
      </style>
   </head>
   <body class="footer-offset">
      <!-- ONLY DEV -->
      <!-- Builder -->
      <div id="styleSwitcherDropdown" class="hs-unfold-content sidebar sidebar-bordered sidebar-box-shadow d-none" style="width: 35rem;">
         <div class="card card-lg border-0 h-100">
            <!-- Footer -->
            <div class="card-footer">
               <div class="row gx-2">
                  <div class="col">
                     <button type="button" id="js-builder-reset" class="btn btn-block btn-lg btn-white">
                     <i class="tio-restore"></i> Reset
                     </button>
                  </div>
                  <div class="col">
                     <button type="button" id="js-builder-preview" class="btn btn-block btn-lg btn-primary">
                     <i class="tio-visible"></i> Preview
                     </button>
                  </div>
               </div>
               <!-- End Row -->
            </div>
            <!-- End Footer -->
         </div>
      </div>
      <!-- End Builder -->
      <!-- JS Preview mode only -->
      <div id="headerMain" class="d-none">
         <header id="header" class="navbar navbar-expand-lg navbar-fixed navbar-height navbar-flush navbar-container navbar-bordered mx-0">
            <div class="navbar-nav-wrap">
               <div class="navbar-brand-wrapper" style="display:block!important;">
                  <!-- Logo -->
                  <a class="navbar-brand" href="<?php echo current_protocol_domain; ?>" aria-label="Front">
                     <?php if(domain_name == 'ssp1.mediamandi.com'){ ?>
                        <p class="navbar-brand-logo"><?php echo site_name; ?></p>
                     <?php }else{ ?>
                         <img class="navbar-brand-logo" src="<?php echo current_protocol_domain; ?>/system/asset/image/site_logo.png" alt="<?php echo site_name; ?>">
                         <img class="navbar-brand-logo-mini d-none" src="<?php echo current_protocol_domain; ?>/system/asset/image/site_logo.png" alt="<?php echo site_name; ?>">
                         <!-- <p class="navbar-brand-text d-none"><?php echo site_name; ?></p>
                         <p class="navbar-brand-ltext-mini d-none"><?php echo site_name; ?></p> -->
                     <?php } ?>
                  </a>
                  <!-- End Logo -->
               </div>
               <div class="navbar-nav-wrap-content-left">
                  <!-- Navbar Vertical Toggle -->
                  <button type="button" class="js-navbar-vertical-aside-toggle-invoker close mr-3 d-none">
                     <i class="tio-first-page navbar-vertical-aside-toggle-short-align" data-toggle="tooltip" data-placement="right" title="Collapse"></i>
                     <i class="tio-last-page navbar-vertical-aside-toggle-full-align" data-template='<div class="tooltip d-none d-sm-block" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>' data-toggle="tooltip" data-placement="right" title="Expand"></i>
                  </button>
                  <!-- End Navbar Vertical Toggle -->
                   <!-- Logo -->
                   <!-- <a class="navbar-brand" href="<?php echo current_protocol_domain; ?>" aria-label="Front">
                     <p class="navbar-brand-text font-weight-bolder" style="font-size:30px;"><?php echo site_name; ?></p>
                  </a> -->
                  <!-- End Logo -->
               </div>
               <!-- Secondary Content -->
               <div class="navbar-nav-wrap-content-right">
                  <!-- Navbar -->
                  <ul class="navbar-nav align-items-center flex-row">
                     <?php if($IsLogin->data->user_type != 'user'){ ?>
                        <li class="mr-3"><a class="font-weight-bold" href="<?php echo current_protocol_domain; ?>">Home</a></li>
                     <?php } ?>
                     <li class="nav-item">
                        <!-- Account -->
                        <div class="hs-unfold">
                           <a class="js-hs-unfold-invoker navbar-dropdown-account-wrapper" href="javascript:;"
                              data-hs-unfold-options='{
                              "target": "#accountNavbarDropdown",
                              "type": "css-animation"
                              }'>
                              <div class="avatar avatar-sm avatar-circle">
                                 <img class="avatar-img" src="<?php echo current_protocol_domain; ?>/system/asset/image/site_small_logo.png" alt="Image Description">
                                 <span class="avatar-status avatar-sm-status avatar-status-success"></span>
                              </div>
                           </a>
                           <div id="accountNavbarDropdown" class="hs-unfold-content dropdown-unfold dropdown-menu dropdown-menu-right navbar-dropdown-menu navbar-dropdown-account" style="width: 16rem;">
                              <div class="dropdown-item">
                                 <div class="media align-items-center">
                                    <div class="avatar avatar-sm avatar-circle mr-2" style="min-width:30px;">
                                       <img class="avatar-img" src="<?php echo current_protocol_domain; ?>/system/asset/image/site_small_logo.png" alt="Profile">
                                    </div>
                                    <div class="media-body">
                                    <?php if(is_login_status == true){ ?>
                                       <span class="card-title h5"><?php echo $IsLogin->data->fname.' '.$IsLogin->data->lname; ?></span>
                                       <span class="card-text"><?php echo $IsLogin->data->email; ?></span>
                                       <!-- <span class="card-title h5">TOKEN - <?php echo $IsLogin->data->token; ?></span> -->
                                    <?php }else{ ?>
                                       <span class="card-title h5">You are not logged in</span>
                                    <?php } ?>
                                    </div>
                                 </div>
                              </div>
                              <a class="dropdown-item" href="<?php echo current_protocol_domain; ?>/page/logout/">
                                 <p class="text-truncate pr-2 mb-0">Contact us : </p>
                                 <p class="text-truncate pr-2 mb-0"><?php echo info_email_id; ?></p>
                              </a>
                              
                              <?php if(is_login_status == true){ ?>
                                 <div class="dropdown-divider"></div>
                                 <a class="dropdown-item" href="<?php echo current_protocol_domain; ?>/page/logout/">
                                    <span class="text-truncate pr-2">Sign out</span>
                                 </a>
                              <?php }else{ ?>
                                 <!-- <a class="dropdown-item" href="<?php echo current_protocol_domain; ?>/page/login/">
                                    <span class="text-truncate pr-2">Login</span>
                                 </a>
                                 <a class="dropdown-item" href="<?php echo current_protocol_domain; ?>/page/register/">
                                    <span class="text-truncate pr-2">Register</span>
                                 </a> -->
                              <?php } ?>
                           </div>
                        </div>
                        <!-- End Account -->
                     </li>
                  </ul>
                  <!-- End Navbar -->
               </div>
               <!-- End Secondary Content -->
            </div>
         </header>
      </div>
      <div id="headerFluid" class="d-none">
      </div>
      <div id="headerDouble" class="d-none">
      </div>
      <div id="sidebarMain" class="d-none">
         <aside class="js-navbar-vertical-aside navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered d-none">
            <div class="navbar-vertical-container">
               <div class="navbar-vertical-footer-offset">
                  <div class="navbar-brand-wrapper justify-content-between">
                  <!-- Logo -->
                  <a class="navbar-brand" href="<?php echo current_protocol_domain; ?>" aria-label="Front">
                  <!-- <img class="navbar-brand-logo" src="<?php echo current_protocol_domain; ?>/system/theme/theme1/svg/logos/logo.svg" alt="Logo">
                  <img class="navbar-brand-logo-mini" src="<?php echo current_protocol_domain; ?>/system/theme/theme1/svg/logos/logo-short.svg" alt="Logo"> -->
                  <img class="navbar-brand-logo d-none" src="" alt="">
                  <img class="navbar-brand-logo-mini d-none" src="" alt="">
                  <p class="navbar-brand-logo"><?php echo site_name; ?></p>
                  <p class="navbar-brand-logo-mini">Z5.AI</p>
                  </a>
                  <!-- End Logo -->
                  <!-- Navbar Vertical Toggle -->
                  <button type="button" class="js-navbar-vertical-aside-toggle-invoker navbar-vertical-aside-toggle btn btn-icon btn-xs btn-ghost-dark">
                  <i class="tio-clear tio-lg" style="color:#fff;"></i>
                  </button>
                  <!-- End Navbar Vertical Toggle -->
                  </div>
                  <!-- Content -->
                  <div class="navbar-vertical-content">
                     <ul class="navbar-nav navbar-nav-lg nav-tabs">
                     <?php if(is_login_status == true || 0 == 0){ ?>
                        <li class="nav-item">
                           <small class="nav-subtitle" title="Topics">Topics</small>
                           <small class="tio-more-horizontal nav-subtitle-replacer"></small>
                        </li>
                        <li class="nav-item">
                           <a style="cursor:pointer;" topic="Trending"  class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Trending</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="viral" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Viral</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="art" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Art</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="pets" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Pets</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="Food" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Food</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="travel" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Travel</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="technology" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Technology</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="sports" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Sports</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="lifestyle" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Lifestyle</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="gaming" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Gaming</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="celebrities" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Celebrities</span>
                           </a>
                        </li>
                        <li class="nav-item" style="cursor:pointer;">
                           <a style="cursor:pointer;" topic="motivation" class="js-nav-tooltip-link nav-link header_menu_topic_choose <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/logout/') !== false){ echo 'active'; } ?>" data-placement="left">
                           <i class="fas fa-text-width nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Motivation</span>
                           </a>
                        </li>
                        <?php }else{ ?>
                        <li class="nav-item ">
                           <a class="js-nav-tooltip-link nav-link <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/login/') !== false){ echo 'active'; } ?>" href="<?php echo current_protocol_domain; ?>/page/login/index.html" title="Login" data-placement="left">
                           <i class="fas fa-sign-in-alt nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Login</span>
                           </a>
                        </li>
                        <li class="nav-item ">
                           <a class="js-nav-tooltip-link nav-link <?php if (strpos(strtolower($_SERVER['SCRIPT_NAME']), '/page/register/') !== false){ echo 'active'; } ?>" href="<?php echo current_protocol_domain; ?>/page/register/index.html" title="Signup" data-placement="left">
                           <i class="fas fa-user-plus nav-icon"></i>
                           <span class="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">Signup</span>
                           </a>
                        </li>
                        <?php } ?>
                        <li class="nav-item">
                           <small class="tio-more-horizontal nav-subtitle-replacer"></small>
                        </li>
                     </ul>
                  </div>
                  <!-- End Content -->
               </div>
            </div>
         </aside>
      </div>
      <div id="sidebarCompact" class="d-none">
      </div>
      <!-- END ONLY DEV -->
      <!-- Search Form -->
      <div id="searchDropdown" class="hs-unfold-content dropdown-unfold search-fullwidth d-none">
      </div>
      <!-- End Search Form -->
      <!-- ========== HEADER ========== -->
      <!-- ========== END HEADER ========== -->
      <!-- ========== MAIN CONTENT ========== -->
      <!-- Navbar Vertical -->
      <!-- End Navbar Vertical -->
      <main id="content" role="main" class="main pointer-event px-2">
      <div id="content_only">