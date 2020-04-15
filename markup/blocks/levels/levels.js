module.exports = function levelsSlider () {

  let $levelsSlider = $('.levels__slider');

    if( $levelsSlider.length > 0 ) {

      $levelsSlider.slick({
        slidesToScroll: 1,
        dots: false,
        mobileFirst: true,
        // infinite: false,
        loop: true,
        // centerMode: true,
        lazyLoad: 'ondemand',
        speed: 300,
        focusOnSelect: true,
        waitForAnimate: false,
        prevArrow: '.levels__prev',
        nextArrow: '.levels__next',

        responsive: [
          {
            breakpoint: 1,
            settings: {
              slidesToShow: 1,
              arrows: false,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              adaptiveHeight: true,
              // variableWidth: true,
              focusOnSelect: true,
              arrows: true,
            }
          }
        ]
      });

    }

}
