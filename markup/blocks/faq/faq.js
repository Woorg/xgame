module.exports = function faq () {

  let $faqTerm = $('.faq__item');

  $faqTerm.on('click', function () {

    $(this).siblings().removeClass('faq__item_active');
    $(this).toggleClass('faq__item_active');
  });


}
