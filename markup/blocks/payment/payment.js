module.exports  = function paymentSlider () {

    let $paymentSlider = $('.payment__slider');

    if( $paymentSlider.length > 0 ) {

      $paymentSlider.slick({
        slidesToScroll: 1,
        dots: false,
        mobileFirst: true,
        infinite: true,
        // centerMode: true,
        lazyLoad: 'ondemand',
        adaptiveHeight: true,
        speed: 600,
        prevArrow: '.payment__prev',
        nextArrow: '.payment__next',

        responsive: [
          {
            breakpoint: 1,
            settings: {
              slidesToShow: 1,
              arrows: false,
            }
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 1,
              // variableWidth: true,
              focusOnSelect: true,
              arrows: true,
            }
          }
        ]
      });

    }


}







