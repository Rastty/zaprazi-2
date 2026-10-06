<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function zaprazi_2_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', array('search-form','gallery','caption','style','script'));
  register_nav_menus(array(
    'primary' => __('Hlavní menu', 'zaprazi-2'),
  ));
}
add_action('after_setup_theme', 'zaprazi_2_setup');

function zaprazi_2_assets() {
  $dir = get_template_directory();
  $uri = get_template_directory_uri();

  wp_enqueue_style(
    'zaprazi-2-style',
    get_stylesheet_uri(),
    array(),
    file_exists($dir . '/style.css') ? filemtime($dir . '/style.css') : null
  );

  if ( is_front_page() && function_exists('wp_enqueue_script_module') ) {
    wp_enqueue_script_module(
      'zaprazi-mobility-advisor',
      $uri . '/assets/js/mobility-advisor.js',
      array(),
      file_exists($dir . '/assets/js/mobility-advisor.js') ? filemtime($dir . '/assets/js/mobility-advisor.js') : null
    );
  }
}
add_action('wp_enqueue_scripts', 'zaprazi_2_assets');
