import svg4everybody from 'svg4everybody';
import levelsSlider from '../../blocks/levels/levels';
import paymentSlider from '../../blocks/payment/payment';
import faq from '../../blocks/faq/faq';


// import $ from 'jquery';
// import slick from 'slick-carousel';


(function ($) {

  svg4everybody();

  let styles = [
    'padding: 2px 9px',
    'background: #2948ff',
    'color: #fff',
    'display: inline-block',
    'box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.2) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
    'line-height: 1.56',
    'text-align: left',
    'font-size: 16px',
    'font-weight: 400'
  ].join(';');

  console.log('%c developed by igor gorlov https://igrlv.ru' , styles);


  /*
    Lazyload images
  */


  let lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy',
    load_delay: 50,
    use_native: false
  });


  if (lazyLoadInstance) {
    lazyLoadInstance.update();
  }


  $(function() {


    $('.popup-open').magnificPopup({
      type: 'inline',
      // closeBtnInside: true,
      // closeOnContentClick: false,
      // showCloseBtn: false
    });


    // Sliders

    levelsSlider();

    paymentSlider();


    // faq

    faq();



  });




})(jQuery);
