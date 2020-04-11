import svg4everybody from 'svg4everybody';
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

  console.log('%c developed by igor gorlov gorlov https://igrlv.ru , telegram:igor_gorlov' , styles);


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

    document.addEventListener('DOMContentLoaded', function () {

    var thisLink = decodeURI(document.location.href),
        getColor = thisLink.split('&clr=').pop();


    if (getColor) {
        $('.js-pvc:contains("' + getColor + '")').addClass('product-page__property-value-color');
    }

    updateCart();

    function updateCart() {
        var products = JSON.parse(localStorage.getItem('cart')),
            sum = 0,
            hasItems = false,
            params = {
                action: 'getCart',
                products: products
            },
            basket = document.getElementById('basket-icon');
        jQuery.post(ajaxurl, params, function (data) {
            document.getElementById('basket-hover-list').innerHTML = data;
        });

        for (var key in products) {
            sum += ~~products[key].length;
            hasItems = true;
        }
        basket.innerHTML = sum;
        basket.classList.remove('head__basket-icon_pulse');
        basket.offsetWidth = basket.offsetWidth; // Р“Р»СѓРїС‹Р№ С…Р°Рє
        basket.classList.add('head__basket-icon_pulse');

        document.getElementById('order-cart-button').classList.toggle('hidden', !hasItems);
    }


    // РљРЅРѕРїРєР° РєСѓРїРёС‚СЊ, РєР»РёРє
    $('.js-buy-button').one('click', function (e) {
        e.preventDefault();
        var colors = {};
        $('.js-variation-selector-form input:checked').each(function (i, o) {
            colors[o.getAttribute('name')] = o.value;
        });
        this.innerHTML = 'Р’ РєРѕСЂР·РёРЅСѓ';
        saveCartItem(this.dataset.id, colors);
        updateCart();
    });

    // РљРЅРѕРїРєР° РєСѓРїРёС‚СЊ РєРѕРјРїР»РµРєС‚
    $('.js-buy-set').on('click', function () {
        var ids = this.dataset.ids.split(','),
            discount = this.dataset.discount || 0,
            kits = JSON.parse(localStorage.getItem('kits')) || [],
            kit = {};

        kit.items = ids;
        kit.discount = discount;

        kits.push(kit);

        localStorage.setItem('kits', JSON.stringify(kits));


        var params = {
            action: 'setDiscount',
            kits: kits
        };

        jQuery.post(ajaxurl, params, function (data) {
        });
        ids.forEach(function (item, i, arr) {
            saveCartItem(item, {});
        });
        updateCart();
    });

    function saveCartItem(id, colors) {
        var prodArray = [],
            products = JSON.parse(localStorage.getItem('cart')) || {};

        if (products[id]) {
            if (Object.keys(colors).length === 0 && colors.constructor === Object) {
                colors = products[id][Object.keys(products[id]).length - 1];
            }
            products[id].push(colors)
        } else {
            if (Object.keys(colors).length === 0 && colors.constructor === Object) {
                colors = {color: 'false'};
            }
            prodArray.push(colors);
            products[id] = prodArray;
        }
        localStorage.setItem('cart', JSON.stringify(products));
    }

    function minusCountProduct(id) {
        var products = JSON.parse(localStorage.getItem('cart'));
        if (products[id].length > 1) {
            products[id].pop()
        }

        //products[id] = products[id] == 1 ? 1 : products[id] - 1;
        localStorage.setItem('cart', JSON.stringify(products));
    }

    function checkKits(id) {
        var kits = JSON.parse(localStorage.getItem('kits')), // РџРѕР»СѓС‡Р°РµРј РєРѕРјРїР»РµС‚С‹ РІ РєРѕСЂР·РёРЅРµ
            params = {},
            removeDiscount = 0; //  РЎРєРѕР»СЊРєРѕ СѓР±СЂР°С‚СЊ РѕС‚ СЃРєРёРґРєРё

        if (kits) { //  Р•СЃР»Рё РµСЃС‚СЊ РєРѕРјРїР»РµРєС‚С‹

            for (var i = 0; i < kits.length; i++) {
                if (kits[i].items.includes(id)) { //    Р РµСЃР»Рё РЅР°С…РѕРґРёРј СЌР»РµРјРµРЅС‚
                    removeDiscount = kits[i].discount; //   Р—Р°РїРёСЃС‹РІР°РµРј СЂР°Р·РјРµСЂ СЃРєРёРґРєРё РµРіРѕ РєРѕРјРїР»РµРєС‚Р°
                    delete kits[i]; // Р СѓРґР°Р»СЏРµРј РєРѕРјРїР»РµРєС‚
                    break;
                }
            }

            kits = kits.filter(function (x) {
                return (x !== (undefined || null || ''));
            });

            if ($.isEmptyObject(kits)) { // Р•СЃР»Рё РєРѕРјРїР»РµРєС‚РѕРІ Р±РѕР»СЊС€Рµ РЅРµС‚
                $('.js-cart-discount-row').addClass('hidden'); //   РЎРєСЂС‹РІР°РµРј СЃС‚СЂРѕРєСѓ СЃРѕ СЃРєРёРґРєРѕР№
                $('.js-cart-summary-row').removeClass('cart-page__summary-value_red'); //   РЈР±РёСЂР°РµРј С†РІРµС‚
                localStorage.removeItem('kits'); // РЈРґР°Р»СЏРµРј СЌР»РµРјРµРЅС‚ РєРѕРјРїР»РµРєС‚РѕРІ

            } else { // Р•СЃР»Рё РµСЃС‚СЊ
                document.getElementById('summary-discount').value = removeDiscount
                    .toString()
                    .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '); //  РЈРјРµРЅСЊС€Р°РµРј СЂР°Р·РјРµСЂ СЃРєРёРґРєРё РІ СЃС‚СЂРѕРєРµ
                localStorage.setItem('kits', JSON.stringify(kits)); //  Р—Р°РїРёСЃС‹РІР°РµРј РЅРѕРІС‹Рµ Р·РЅР°С‡РµРЅРёСЏ РєРѕРјРїР»РµРєС‚РѕРІ
            }

            params.action = 'setDiscount';
            params.kits = kits;
            jQuery.post(ajaxurl, params, function (data) {
            }); //  РџР°СЂР°РјРµС‚СЂС‹ РѕС‚РїСЂР°РІР»СЏРµРј РІ СЃРµСЃСЃРёСЋ
        }
    }

    function removeProductFromCart(id) {
        var products = JSON.parse(localStorage.getItem('cart')); // РџРѕР»СѓС‡Р°РµРј РїСЂРѕРґСѓРєС‚С‹ РІ РєРѕСЂР·РёРЅРµ
        delete products[id]; // РЈРґР°Р»СЏРµРј РёР· РјР°СЃРёРІР° РєРѕСЂР·РёРЅС‹ РїСЂРѕРґСѓРєС‚

        checkKits(id);

        localStorage.setItem('cart', JSON.stringify(products)); //  Р’ Р»РѕРєР°Р»СЊРЅРѕРµ С…СЂР°РЅРёР»РёС‰Рµ РѕС‚РїСЂР°РІР»СЏРµРј РїСЂРѕРґСѓРєС‚С‹

    }

    function updateCartSummary() {
        var sum = 0,
            count = 0;
        $('.js-count-summary').each(function (i, o) {
            sum += o.value * o.dataset.price;
            count += ~~o.value;
        });

        if (count === 0) {
            document.location.href = '?p=547';
        }

        document.getElementById('summary-price').value = sum.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        document.getElementById('summary-count').innerHTML = count;
    }

    $('.js-count-summary').on('change', function (e) {
        var products = JSON.parse(localStorage.getItem('cart')) || {};
        products[id] = products[id] ? products[id] + 1 : 1;
        localStorage.setItem('cart', JSON.stringify(products));
    });

    // РЈРґР°Р»РёС‚СЊ РёР· РєРѕСЂР·РёРЅС‹
    $(document).on('click', '.js-basket-remove', function (e) {
        e.preventDefault();
        var id = this.dataset.id;
        $(this).closest('.js-cart-item').addClass('hidden'),
            obj = $(this).closest('.js-ec-for-remove')[0],
            count = $(obj).find('.js-count-summary').val() ? $(obj).find('.js-count-summary').val() : $(obj).find('.js-count-in-basket').text();


        sendDataECRemoveItem(obj, count)

        removeProductFromCart(id);
        updateCart();
    });

    $(document).on('click', '.js-cart-remove', function (e) {
        e.preventDefault();
        var id = this.dataset.id;
        document.getElementById('cart-item-' + id).remove(),
            obj = $(this).closest('.js-ec-for-remove')[0],
            count = $(obj).find('.js-count-summary').val() ? $(obj).find('.js-count-summary').val() : $(obj).find('.js-count-in-basket').text();

        sendDataECRemoveItem(obj, count)

        removeProductFromCart(id);
        updateCart();
        updateCartSummary(id);
    });

    $('.js-counter-minus').on('click', function () {
        var input = this.nextElementSibling,
            id = input.dataset.id,
            price = input.dataset.price,
            obj = $(this).closest('.js-ec-for-remove')[0];
        if (input.value == 1) return;
        input.value = ~~input.value - 1;

        sendDataECRemoveItem(obj, 1)

        minusCountProduct(id);
        checkKits(id);
        updateCart();
        updateCartSummary(id);
    });

    $('.js-counter-plus').on('click', function () {
        var input = this.previousElementSibling,
            id = input.dataset.id,
            price = input.dataset.price,
            obj = $(this).closest('.js-ec-for-remove')[0];
        input.value = ~~input.value + 1;

        sendDataECAddproduct(obj);

        saveCartItem(id, {});
        updateCart();
        updateCartSummary(id);
    });

    $('.js-hover-pi-thumb').on('mouseover', function (e) {
        var id = this.dataset.hoverid,
            $area = $(this).closest('.js-product-item-box');
        $area.find('.js-hover-pi').addClass('hidden');
        $area.find('.js-hover-pi-' + id).removeClass('hidden');
    })


    /* CART SEND FORM */

    function sens_to_amo(data_load, orderid) {
        $.ajax({
            type: 'POST',
            url: '/amocrm/amo.php',
            data: data_load + '&orderid=' + orderid,
            success: function (data) {

            }
        });
    }

    if (document.getElementById(('cart-send-form'))) {
        document.getElementById('cart-send-form').onclick = function (e) {
            e.preventDefault();
            var
                link = this.getAttribute('href'),
                form = document.getElementById('cart-form'),
                products = scanCartProducts();

            var prods = JSON.parse(localStorage.getItem('cart'));

            sendDataECOrderSteps(3, products, 'Р—Р°РєР°Р· С‡РµСЂРµР· РєРѕСЂР·РёРЅСѓ');

            if (checkCartInputs()) {
                $('html, body').animate({
                    scrollTop: $('.input_error').first().offset().top - 30
                }, 500);
                return false;
            }

            this.classList.add('button_clicked');
            this.innerHTML = 'РћС‚РїСЂР°РІР»СЏРµРј';
            loadDots(this);

            var orderInfo = $(form).find(':visible, [type="hidden"], .js-delivery-type:checked').serialize();


            $.ajax({
                type: 'POST',
                url: '/wp-admin/admin-ajax.php?action=sendOrder',
                data: {
                    colors: prods,
                    cart: orderInfo
                },
                dataType: 'JSON',
                action: 'sendOrder',
                success: function (data) {
                    dataLayer.push({
                        'event': 'order'
                    });
                    // console.log(data);
                    document.location.href = link + '&orderid=' + data;
                    //   sens_to_amo(orderInfo, data);
                }
            });
        }
    }

    $('#summary-checkbox').on('change', function () {
        $('#cart-send-form').toggleClass('button_disabled', !this.checked);
    });

    function loadDots(el) {
        i = 0;
        setInterval(function () {
            i++;
            if (i == 1) el.dataset.dots = '.';
            else if (i == 2) el.dataset.dots = '..';
            else if (i == 3) el.dataset.dots = '...';
            else {
                el.dataset.dots = ''
                i = 0;
            }
        }, 500);
    }

    function checkCartInputs() {
        var error = false;
        if (checkCartName()) error = true;

        //   if (checkCartMail()) error = true;

        if (checkCartPhone()) error = true;

        return error;
    }

    function checkCartName() {
        var $username = $('[name=username]'),
            error = false;

        $username[0].classList.remove('input_error');

        if ($username.val().length == 0) {
            error = true;
            $username[0].classList.add('input_error');
        }
        return error;
    }

    function checkCartPhone() {
        var $userphone = $('[name=userphone]'),
            phonePattern = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/,
            error = false;

        $userphone[0].classList.remove('input_error');
        if (!phonePattern.test($userphone.val())) {
            error = true;
            $userphone[0].classList.add('input_error');
        }
        return error;
    }

    function checkCartMail() {
        var $useremail = $('[name=usermail]'),
            emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            error = false;

        $useremail[0].classList.remove('input_error');
        if (!emailPattern.test($useremail.val())) {
            error = true;
            $useremail[0].classList.add('input_error');
        }
        return error;
    }


    $('#cart-form [name=username]').on('blur', function () {
        checkCartName();
    });

    $('#cart-form  [name=userphone]').on('blur', function () {
        checkCartPhone();
    });

    $('#cart-form [name=usermail]').on('blur', function () {
        //  checkCartMail();
    });

    $('.js-ec-step2-check').on('blur', function () {
        if ($('.input_error').length == 0) {
            var noCorrect = false;
            $('.js-ec-step2-check').each(function (i, o) {
                noCorrect = !o.value.length;
            });
            if (noCorrect) return;
            $('.js-ec-step2-check').off('blur');
            sendDataECOrderSteps(2, scanCartProducts());
        }
    })

    $('.js-ec-step2fast-check').on('blur', function () {
        var noCorrect = false;
        $('.js-ec-step2fast-check').each(function (i, o) {
            noCorrect = !o.value.length;
        });
        if (noCorrect) return;
        $('.js-ec-step2fast-check').off('blur');
        sendDataECOrderSteps(2, productArray);
    });

    /* FILTER CHANGES */

    $(document).on('input', '.js-filter-range', function () {
        var value = this.value;

        if (value.indexOf(',') > -1) {
            var min = value.split(',').shift();
            var max = value.split(',').pop();
        } else {
            max = value;
        }

        if (min) $('input[name="' + this.dataset.min + '"]').val(min);
        $('input[name="' + this.dataset.max + '"]').val(max);
    })

    function generateFilterRequest(order) {
        var request = '',
            connector = '',
            lastName = '',
            link = document.location.href;
        order = order ? order : $('.js-filter-order').data('sorting');

        link = link.split('#')[0];
        link = link.split('?filter=on')[0];
        link = link.split('?page=')[0];
        link = link.split('/page/')[0];

        $('.js-filter-form input:text, .js-filter-form input:checked').each(function (i, o) {
            if (!o.value) return true;
            if (lastName == o.getAttribute('name')) {
                request += ',' + o.value.split('#').pop();
            } else {
                lastName = o.getAttribute('name');
                request += '&' + lastName + '=' + o.value.split('#').pop();
            }
        });

        connector = ((link.indexOf('?') > -1) && (link.indexOf('?page') === -1)) ? '&' : '?';

        request = request.length < 2 ? connector + 'filter=on&order=' + order : link + connector + 'filter=on&order=' + order + request;
        return request;
    }

    $('.js-filter-order').on('click', function (e) {
        var order = $(this).attr('data-sorting') === 'ASC' ? 'DESC' : 'ASC';
        document.location.href = generateFilterRequest(order);
    });


    $(document).on('input', '.js-filter-input, .js-filter-range', function () {
        var value = this.value;
        item = $(this).closest('.js-filter-item');

        item.removeClass('catalog-filter__item_active');
        if (value.length) {
            item.addClass('catalog-filter__item_active');
        } else {
            item.find('input').each(function (i, o) {
                if (o.value) {
                    item.addClass('catalog-filter__item_active');
                    return true;
                }
            });
        }
    });

/*  $(document).on('change', '.js-filter-input', function () {
        var name = this.getAttribute('name'),
            $el = $('[data-min=' + name + '], [data-max=' + name + ']'),
            min = $el[0].dataset.min,
            max = $el[0].dataset.max,
            index = name.includes('min') ? 0 : 1


        $el[0].value = $('[name='+min+']').val() ? $('[name='+min+']').val() : $('[name='+min+']').attr('min');
        $el[1].value = $('[name='+max+']').val() ? $('[name='+max+']').val() : $('[name='+max+']').attr('max');
    });
    */

    var timer = null, countClick = 0, countResponse = 0;

    function changeFilterInput(obj) {

        var order = obj.attr('data-sorting') === 'ASC' ? 'DESC' : 'ASC',
            link = generateFilterRequest(order),
            href = document.location.href,
            term = href.split('categories/').pop().split('/')[0];

        link = '?' + link.split('/?').pop();
        countClick++;
        var params = {
            action: 'catalogFilterCount',
            term: term,
            click: countClick
        };

        if (timer !== null) clearTimeout(timer);
        $('.js-filter-apply').addClass('button_disabled');
        $('.js-filter-order').addClass('link_disabled');
        $('.js-this-founded').html('<img class="loadingSVG" src="/wp-content/themes/skladno/img/svg/loading.svg">');
        timer = setTimeout(function () {

            jQuery.get(ajaxurl.url + link, params, function (data) {
                countResponse++;
                data = JSON.parse(data);
                $('.catalog-filter__find-item').addClass('catalog-filter__find-item_visible');
                //    if (document.getElementById('collectionsArray').length > 0) {
                $('#collectionsArray').val(JSON.parse(data[1]).toString());

                if (countClick == data[2]) {
                    $('.js-this-founded').text(data[0]);
                    if (data[0] !== 0) {
                        $('.js-filter-apply').removeClass('button_disabled');
                        $('.js-filter-order').removeClass('link_disabled');
                    }
                }
            });

        }, 1000);
    }

    $(document).on('change', '.js-filter-form', function (e) {
        if (e.target.getAttribute('type') === 'text') return;
        changeFilterInput($(this));
    });

    $(document).on('input', '.js-filter-form', function (e) {
        changeFilterInput($(this));
    });


    $(document).on('click', '.js-filter-apply', function (e) {
        var link = generateFilterRequest();
        document.location.href = link;
    });


    $(document).on('change', '.js-tag-select', function (e) {
        var link = generateFilterRequest();
        document.location.href = link;
    });

    $(document).on('click', '.js-clear-filter', function (e) {
        var link = document.location.href;
        link = link.split('?filter')[0];
        link = link.split('?page')[0];
        document.location.href = link;
    });


    $('.js-fast-order').on('click', function (e) {
        e.preventDefault();
        $('.js-modal, .js-fast-order-modal').removeClass('hidden');
        $('body, html').addClass('oh');
    });

    $('.js-fast-recall').on('click', function (e) {
        e.preventDefault();
        $('.js-modal, .js-fast-recall-modal').removeClass('hidden');
        $('body, html').addClass('oh');
    });

    $('.js-modal').on('click', function (e) {
        if (e.target != this) return;
        e.preventDefault();
        if ($('.js-fast-order-modal:visible').length) {
            sendDataECRemoveItem(0, 0, productArray);
        }
        $('.js-modal, .js-modal > *').addClass('hidden');
        $('body, html').removeClass('oh');
    });

    $('.js-close-modal').on('click', function () {
        if ($(this).closest('.modal__window')[0].classList.contains('js-fast-order-modal')) {
            sendDataECRemoveItem(0, 0, productArray);
        }

        $('.js-modal, .js-modal > *').addClass('hidden');
        $('body, html').removeClass('oh');
    });

    document.addEventListener('wpcf7mailsent', function (event) {
        $(event.target)
            .closest('.modal__form')
            .addClass('hidden')
            .next('.modal__success')
            .removeClass('hidden');
        switch (event.detail.contactFormId) {
            case "1232":
                sendDataECOrderSteps(3, productArray, 'Р‘С‹СЃС‚СЂС‹Р№ Р·Р°РєР°Р·');
                dataLayer.push({
                    'event': 'fastorder'
                });


                var link = event.detail.inputs[4].value;

                link = link.split('http');

                var callbackData = {
                    'action': 'amoInit',
                    'type': 'fastorder',
                    'name': event.detail.inputs[0].value,
                    'phone': event.detail.inputs[1].value,
                    'email': event.detail.inputs[2].value,
                    'comment': event.detail.inputs[3].value,
                    'link': 'http' + link[1]
                }

                $.post(ajaxurl, callbackData, function (data) {

                });

                break;
            case "1218":
                dataLayer.push({
                    'event': 'callback'
                });

                var callbackData = {
                    'action': 'amoInit',
                    'type': 'callback',
                    'name': event.detail.inputs[0].value,
                    'phone': event.detail.inputs[1].value
                }

                $.post(ajaxurl, callbackData, function (data) {

                });

                break;
            case "995":
                dataLayer.push({
                    'event': 'contact'
                });
                break;
            case "2034":
                dataLayer.push({
                    'event': 'reklamazia'
                });
                document.location.href = '/?p=2035';
                break;
            default:
        }
    }, false);


    document.addEventListener('wpcf7invalid', function (event) {
        $('html, body').animate({
            scrollTop: $('.wpcf7-not-valid').first().offset().top - 30
        }, 500);
    });

    $(document).on('change', '.js-filter-checkbox', function () {
        var dropdown = $(this).closest('div.js-filter-dropdown'),
            item = dropdown.parent().parent('span'),
            count = dropdown.find('.js-filter-checkbox:checked').length,
            counter = item.find('.js-filter-selected-count');

        if (count) {
            item.addClass('catalog-filter__item_active');
            counter.html('(' + count + ')');
        } else {
            item.removeClass('catalog-filter__item_active');
            counter.html('');
        }
        generateFilterRequest();
    });

    $('.js-filter-remove').on('click', function () {
        var form = $(this).closest('form');
        form.find('input:text').val('').end().find(':checkbox').prop('checked', false);
        // form.find('input').range();
        form.find('input:not([type="range"])').change();
        form.find('input:not([type="range"])').trigger('input');
        generateFilterRequest();
        form.parent().removeClass('catalog-filter__item_active')
    });

    /* FILTER AJAX */

    if (document.getElementById('filterStatus')) {
        document.getElementById('filterStatus').onerror = filterStatus();
    }


    /* FILTER DELIVERY REGIONS */


    $('#find-delivery-region').on('input', function () {
        //$('#delivery-regions').removeClass('table-first-five');
        if (this.value) {
            $('#delivery-regions tbody tr').css('display', 'none')
            $('#delivery-regions tbody td:Contains("' + this.value + '")').closest('tr').css('display', 'table-row')
        } else {
            $('#delivery-regions tbody tr').removeAttr('style')
        }
    });

    /* MAP */

    if (document.getElementById('map')) {
        ymaps.ready(init);
        var myMap,
            baloon,
            baloon2;

        function init() {
            myMap = new ymaps.Map("map", {
                center: [59.939, 30.357],
                zoom: 11,
                controls: []
            });

            myMap.behaviors.disable('scrollZoom');

            if (!isMobile()) {
                myMap.controls.add(
                    new ymaps.control.ZoomControl()
                );
            } else {
                myMap.behaviors.disable('drag');
            }

            baloon = new ymaps.Placemark([59.979115, 30.357649], {}, {
                iconLayout: 'default#image',
                iconImageHref: '/wp-content/themes/skladno/img/svg/map_pin_red.svg',
                iconImageSize: [55, 72],
                iconImageOffset: [-25, -70]
            });
            baloon2 = new ymaps.Placemark([59.903611, 30.392788], {}, {
                iconLayout: 'default#image',
                iconImageHref: '/wp-content/themes/skladno/img/svg/map_pin_black.svg',
                iconImageSize: [55, 72],
                iconImageOffset: [-25, -70]
            });

            myMap.geoObjects.add(baloon);
            myMap.geoObjects.add(baloon2);
        }
    }


    /* MAP 3D */

    $('.js-close-map-sidebar').on('click', function () {
        $('.js-map-sidebar').removeClass('map-sidebar_active');
        $('.js-svg-map').css("margin-left", 0);
        this.classList.add('hidden');

        $('.js-select-map-region')[0].selectedIndex = 0;
        $('.js-select-map-region').trigger('change');
    });

    $('.js-map-city-select').on('click', function (e) {
        e.preventDefault();
        var id = $(this).data("table-id");
        $('.js-map-city-select').removeClass('map-sidebar__city-item_active');
        this.classList.add('map-sidebar__city-item_active');
        $('.js-map-table').addClass('hidden');
        $('.js-table-id-' + id).removeClass('hidden');

    });

    var cords = {};

    $('.js-map').on('click', 'polygon, path, polyline', function (e) {
        var id = this.getAttribute('id').split('-')[1],
            index = $('.js-select-map-region option[value=' + id + ']').index();

        selectedPolygon(id);

        $('.js-select-map-region')[0].selectedIndex = index;
        $('.js-select-map-region').trigger('change');
        $('.js-map-sidebar').addClass('map-sidebar_active');
        $('.js-close-map-sidebar').removeClass('hidden');


        //
        // var w = $('.js-map')[0].getBoundingClientRect().width,
        //     h = $('.js-map')[0].getBoundingClientRect().height,
        //     top = $('.js-map').offset().top >= document.documentElement.scrollTop ? $('.js-map').offset().top : document.documentElement.scrollTop;
        //
        //
        // this.remove();
        // cords[id] = [(((e.clientX) / w) * 100).toFixed(2)  + '%', (((e.clientY - top) / h) * 100).toFixed(2) + '%'];
        // console.log(JSON.stringify(cords));

    });

    $('.js-map').on('mouseover', 'polygon, path, polyline', function (e) {
        $('.js-map-hover').fadeOut(200).remove();
        var id = this.getAttribute('id').split('-')[1],
            text = '<img src="/wp-content/themes/skladno/favicon.png" /><span>' + $('.js-select-map-region option[value = ' + id + ']').text() + '</span>';

        $('<div>').html(text).addClass('js-map-hover map-hover hidden').css({
            'left': mapCords[id][0],
            'top': mapCords[id][1]
        }).appendTo($('.js-for-map-hover')).fadeIn(200);
    });

    $('.js-select-map-region').on('change', function () {
        var id = $(this).find('option:selected').val(),
            $regionBox = $('.js-map-region-id-' + id);

        if (id == 0) {
            $('.js-map-region').addClass("hidden");
            $('.js-map-table').addClass('hidden');
            $('.map-container').find('path, polygon, polyline').removeClass('active');
            $('.js-svg-map').css("margin-left", 0);
            return;
        }

        selectedPolygon(id);
        $('.js-map-region').addClass("hidden");
        $('.js-map-table').addClass('hidden');

        if ($regionBox.find('.js-map-city-select').length) {
            $regionBox.find('.js-map-city-select')[0].click();
        }
        $regionBox.removeClass("hidden");
        $('.map-container').find('path, polygon, polyline').removeClass('active');
        document.getElementById('region-' + id).classList.add('active');
        $('.js-map-sidebar').addClass('map-sidebar_active');
        $('.js-close-map-sidebar').removeClass('hidden');

    });

    function selectedPolygon(id) {
        var $region = $('#region-' + id),
            sidebarWidth = $('.js-map-sidebar').outerWidth(),
            left = 0,
            leftMap = $('.js-svg-map').offset().left;

        left = $region[0].getBoundingClientRect().left - leftMap;


        left = left < sidebarWidth ? sidebarWidth * 0.9 : 0;


        $('.js-svg-map').css("margin-left", left);
    }

    /*
    if ($('.svg-map').length) {
            var parentPos = $('.map-container').offset(),
                    parentWidth = $('.map-container').outerWidth();
            $( ".svg-map" ).draggable({
                    drag: function(event, ui) {
                            console.log( ui.position.left);
                            if (ui.position.left > parentPos.left) {
                                    ui.position.left= parentPos.left;
                            } else if (ui.position.left < (parentWidth / -2)) {
                                    ui.position.left = parentWidth / -2;
                            }
                    },
                    axis: "x",
                    scroll: false
            });
    }
    */

    /* UI */


    $('.js-show-full-table').on('click', function (e) {
        e.preventDefault();
        var table = this.dataset.table;
        document.getElementById(table).classList.remove('table-first-five');
        this.classList.add('hidden');
    });

    $('#warranty-form-link').on('click', function (e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);

        document.getElementById('warranty-input').focus();
    });

    /* SEARCH */

    $('#search-button').on('click', function (e) {
        e.preventDefault();
        $('#search-form').removeClass('off').find('input')[0].focus();
    });

    $('.js-search-overlay').on('click', function (e) {
        if (this != e.target) return;
        $('#search-form').addClass('off');
    });

    /* DELIVERY TAB */

    $('.js-delivery-tab-item').on('click', function () {
        var tab = this.dataset.tab;
        document.getElementById('js-delivery-russia').classList.add('hidden');
        document.getElementById('js-delivery-spb').classList.add('hidden');
        document.querySelector('.delivery-tab__item_active').classList.remove('delivery-tab__item_active');
        this.classList.add('delivery-tab__item_active');
        document.getElementById(tab).classList.remove('hidden');
    });

    /* MOBILE MAIN MENU */

    $('.js-menu-icon').on('click', function () {
        this.classList.toggle('open');
        $('.js-menu-categories').toggleClass('mobile-hidden tablet-hidden');
    });

    if (isMobile()) {
        $('.js-hover-drop').on('click', function () {

            var $el = $(this);
            if ($el.hasClass('hover')) {
                this.classList.remove('hover');
                $el = $el.parent().parent();
            } else {
                $('.js-hover-drop').removeClass('hover');
                $el.addClass('hover').closest('.js-dropdown').children('.js-hover-drop').addClass('hover');
            }

            $('html, body').animate({
                scrollTop: $el.offset().top
            }, 500);
        });
    }

    /* DROP DOWN CATALOG */
    var $menuTriggers = $('.menu__category-trigger'),
        menuId, menuElement;

    $menuTriggers.on('mouseenter', function (e) {
        menuId = $(e.target).index() + 1;
        menuElement = document.querySelector('.menu-categories__dropdown:nth-child(' + menuId + ')');
        if (!menuElement) return;
        menuElement.classList.remove('menu-categories__dropdown_hidden');
    }).on('mouseout', function (e) {
        if (!menuElement) return;
        menuElement.classList.add('menu-categories__dropdown_hidden');
    });

    /* SHOW ALL PROPERTIES IN PRODUCT CARD */
    var showMoreProperties = document.querySelector('.js-show-all-properties');
    if (showMoreProperties) {
        showMoreProperties.onclick = function (e) {
            e.preventDefault();
            this.parentNode.parentNode.classList.remove('product-page__properties_short');
            this.remove();
        }
    }


    /* TOGGLE MOBILE FOOTER MENU */

    $('.js-footer-menu-toggle').on('click', function (e) {
        $(this).toggleClass('footer__dropdown-icon_rotate').parent().next().slideToggle();
    });

    /* CartDelivery Form */

    var deliveryRegion = document.querySelector('.js-delivery-region') || false;

    if (deliveryRegion) {
        deliveryRegion.onchange = function () {
            var val = deliveryRegion.options[deliveryRegion.selectedIndex].dataset.value,
                typeVal = document.querySelector('.js-delivery-type:checked').dataset.value;
            deliverySelectors = document.querySelectorAll('.js-delivery-selector');


            $('.js-russia-delivery').toggleClass('hidden', val == 3);
            document.querySelector('.js-city').classList.toggle('hidden', val == 1);
            document.querySelector('.js-form-space').classList.toggle('hidden', val != 1);
            for (var i = 0; i < deliverySelectors.length; i++) {
                deliverySelectors[i].classList.toggle('hidden', val == 3);
            }
            document.querySelector('.js-addres-form').classList.toggle('hidden', ((val != 3) && (typeVal == 2)));
        }
    }

    $('.js-delivery-type').on('change', function () {
        document.querySelector('.js-addres-form').classList.toggle('hidden', this.dataset.value == 2);
    });

    // LINK IN FAST ORDER

    if ($('.js-item-title').length > 0) {
        $('#itemlink').val(document.querySelector(".js-item-title").innerHTML + ' (' + document.location.href + ')');
    }


    /*
    ------------ECOMMERCE -------------
    */

    productsItems = document.querySelectorAll('.js-ec-item');
    bannerItems = document.querySelectorAll('.js-ec-banner');
    if (productsItems.length > 0) {

        for (var i = 0; i < productsItems.length; i++) {
            var obj = productsItems[i],
                id = obj.dataset.id,
                list = $(obj).closest('.container').find('h1, h2, h3, h4').first().text(),
                item = {
                    'name': obj.dataset.name,
                    'price': obj.dataset.price,
                    'brand': obj.dataset.brand,
                    'section': obj.dataset.section,
                    'category': obj.dataset.category,
                    'list': list,
                    'counter': i
                }
            productsObject[id] = item;
        }
        $(document).on('scroll', function () {
            for (var i = 0; i < productsItems.length; i++) {
                var id = productsItems[i].dataset.id;
                if (checkPosition($(productsItems[i]))) {
                    productsItems[i].classList.add('js-ec-showed');
                    sendDataECShow(id);
                }
            }
        });
    }


    if (bannerItems.length > 0) {

        for (var i = 0; i < bannerItems.length; i++) {
            var obj = bannerItems[i],
                id = obj.dataset.id,
                list = $(obj).closest('.container').find('h1, h2, h3, h4').first().text(),
                item = {
                    'name': obj.dataset.name,
                    'slot': obj.dataset.slot,
                }
            bannerObject[id] = item;
        }
        $(document).on('scroll', function () {
            for (var i = 0; i < bannerItems.length; i++) {
                var id = bannerItems[i].dataset.id;
                if (checkPosition($(bannerItems[i]))) {
                    bannerItems[i].classList.add('js-ec-showed');
                    sendDataECShowBanners(id);
                }
            }
        });
    }


    $('.js-ec-click-item').on('click', function (e) {
        //      e.preventDefault();
        var obj = $(this).closest('.js-ec-item, .js-ec-thumb')[0],
            id = obj.dataset.id,
            list = $(obj).closest('.container').find('h1, h2, h3, h4').first().text(),
            item = {
                'name': obj.dataset.name,
                'price': obj.dataset.price,
                'brand': obj.dataset.brand,
                'section': obj.dataset.section,
                'category': obj.dataset.category,
                'list': list,

            }
        sendDataECClick(item, list, id);
    });

    $('.js-ec-banner').on('click', function () {
        var banner = $(this)[0];
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            'ecommerce': {
                'promoClick': {
                    'promotions': [{
                        'id': banner.dataset.id,
                        'name': banner.dataset.name,
                        'position': banner.dataset.slot,
                    }]
                }
            },
            'event': 'gtm-ee-event',
            'gtm-ee-event-category': 'Enhanced Ecommerce',
            'gtm-ee-event-action': 'Promotion Clicks',
            'gtm-ee-event-non-interaction': 'False',
        });

    });

    $('#product-thumbs').on('click', '.slick-slide', function () {
        if ($(this).offset().left !== $('#product-thumbs').offset().left) return;

        //    $(this).prev('.slick-slide').trigger('click');
    });


    /* Plugins INIT */

    // Mask

    $(".js-phone-mask").mask("+7 (999) 999-99-99");

    // Fancybox

    $('[data-fancybox]').fancybox({
        toolbar: false,
        infobar: false,
        idleTime: false,
        smallBtn: true,
        thumbs: {
            autoStart: false, // Display thumbnails on opening
            hideOnClose: true, // Hide thumbnail grid when closing animation starts
            parentEl: '.fancybox-container', // Container is injected into this element
            axis: 'y' // Vertical (y) or horizontal (x) scrolling
        }

    });

    // Sticky

    if (((!isMobile()) || (document.body.clientWidth > 1023)) && ($('.js-sticky-box').length)) {
        $('.js-sticky-box').each(function (i, o) {
            var top = o.dataset.top || 50,
                bottom = o.dataset.bottom || 50;
            $(o).stickySidebar({
                topSpacing: top,
                bottomSpacing: bottom
            });
        })
    }

    // Select 2

    $('.js-select').select2({
        width: '100%',
        minimumResultsForSearch: -1
    });

    $('.js-select-links').on('change', function (e) {
        e.preventDefault();
        window.location.href = this.options[this.selectedIndex].value;
    })


    $('.js-slider-standart').each(function (i, o) {
        var countSlides = o.dataset.slides * 1 || 1,
            mobileCountSlides = o.dataset.slidesmobile * 1 || 1,
            tabletCountSlides = o.dataset.slidestablet * 1 || countSlides,
            dots = o.dataset.dots == 'false' ? false : true,
            navFor = o.dataset.navfor || false,
            focus = o.dataset.focus == 'true' ? true : false,
            slidesToScroll = o.dataset.scroll * 1 || countSlides,
            arrows = o.dataset.arrows ? true : false;

        $(o).slick({
            infinite: false,
            slidesToShow: countSlides,
            slidesToScroll: slidesToScroll,
            dots: dots,
            arrows: arrows,
            asNavFor: navFor,
            focusOnSelect: focus,
            adaptiveHeight: true,
            responsive: [
                {
                    breakpoint: 1023,
                    settings: {
                        slidesToShow: tabletCountSlides,
                        slidesToScroll: tabletCountSlides
                    }
                },
                {
                    breakpoint: 667,
                    settings: {
                        slidesToShow: mobileCountSlides,
                        slidesToScroll: mobileCountSlides
                    }
                }
            ]
        });
    });

    $('.js-slider-tablet').each(function (i, o) {
        var countSlides = o.dataset.slides * 1 || 1,
            mobileCountSlides = o.dataset.slidesmobile * 1 || 1,
            tabletCountSlides = o.dataset.slidestablet * 1 || countSlides,
            dots = o.dataset.dots == 'false' ? false : true;
        $(o).slick({
            infinite: false,
            slidesToShow: countSlides,
            slidesToScroll: countSlides,
            dots: dots,
            arrows: false,
            responsive: [
                {
                    breakpoint: 3400,
                    settings: "unslick"
                },
                {
                    breakpoint: 1023,
                    settings: {
                        slidesToShow: tabletCountSlides,
                        slidesToScroll: tabletCountSlides
                    }
                },
                {
                    breakpoint: 667,
                    settings: {
                        slidesToShow: mobileCountSlides,
                        slidesToScroll: mobileCountSlides
                    }
                }
            ]
        });
    });

    $('.js-slider-mobile').each(function (i, o) {
        var countSlides = o.dataset.slidesmobile * 1 || 1,
            dots = o.dataset.dots == 'false' ? false : true;
        $(o).slick({
            infinite: false,
            slidesToShow: countSlides,
            slidesToScroll: countSlides,

            dots: dots,
            arrows: false,
            responsive: [
                {
                    breakpoint: 3400,
                    settings: "unslick"
                },
                {
                    breakpoint: 667,
                    settings: {
                        slidesToShow: countSlides,
                        slidesToScroll: countSlides
                    }
                }
            ]
        });
    });


    // Variation Choose

    $('.js-variation-selector-form').on('change', function () {
        // $('.js-variation-selector-form input:checked').each(function (i, o) {
        //   var name = o.getAttribute('name');
        //   modCode += name + this.dataset.color;
        // });

        var modCode = decodeURIComponent($(this).find('input, select').filter(function (index, element) {
            return $(element).val() != '';
        }).serialize()).replace(/=/g, '').replace(/&/g, '');

        console.log(modCode);

        var modAviable = productVariations.hasOwnProperty(modCode);

        if (modAviable) {
            var priceSale = formatNumber(productVariations[modCode].price_sale),
                price = formatNumber(productVariations[modCode].price);

            $('.js-sku-variative').text(productVariations[modCode].sku);
            $('.js-price-variative').text(price ? price + ' в‚Ѕ' : 'РќРµС‚ РєРѕРјР±РёРЅР°С†РёРё').toggleClass('sale-price__price', !!priceSale);
            $('.js-old-price-variative').text(priceSale ? priceSale + ' в‚Ѕ' : '');
            $('.js-buy-button').get(0).dataset.id = productVariations[modCode].sku;

            if (productVariations[modCode].gallery) {
                var photoId = productVariations[modCode]['gallery'][0]['ID'],
                    number = $('.js-item-slide').index($('#img-' + photoId));
                $('#product-images').slick('slickGoTo', number);
            }


        } else {
            $('.js-price-variative').text('РќРµС‚ РєРѕРјР±РёРЅР°С†РёРё').removeClass('sale-price__price');
            $('.js-old-price-variative').text('');
            $('.js-sku-variative').text('вЂ“');
        }

        $('.js-fast-order, .js-buy-button').toggleClass('disabled', !modAviable);
    });

    $('.js-color-selector').on('click', function () {
        var cat = this.dataset.cat;
        $('.js-color-selector').removeClass('active');
        this.classList.add('active');
        $('.js-color-pick-can-hide').hide()
        $('.js-color-type-' + cat).css({display: 'inline-block'}).first().click();
        $('.js-see-all-colors').remove()
    });

    $('.js-see-all-colors').on('click', function () {
        this.classList.add('hidden');
        $(this).closest('.js-color-list-variative').get(0).classList.remove('color-list-variative');
    })

});

function isMobile() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

function filterStatus() {
    var $dropdown = $('.js-filter-dropdown');
    $dropdown.each(function (i, o) {
        //    $(o).find('input').change().trigger('input');
        var value = o.value;
        item = $(o).closest('.js-filter-item');

        item.removeClass('catalog-filter__item_active');
        if (value) {
            item.addClass('catalog-filter__item_active');
        } else {
            item.find('input:not([type=checkbox]):not([type=range])').each(function (i, o) {
                if (o.value) {
                    item.addClass('catalog-filter__item_active');
                    return true;
                }
            });
        }


        var dropdown = $(o),
            item = dropdown.parent().parent('span'),
            count = dropdown.find('.js-filter-checkbox:checked').length,
            counter = item.find('.js-filter-selected-count');

        if (count) {
            item.addClass('catalog-filter__item_active');
            counter.html('(' + count + ')');
        }

    });
}

var productsObject = [],
    bannerObject = [];

function checkPosition(control) {

    var div_position = control.offset();
    var div_top = div_position.top;
    var div_left = div_position.left;
    var div_width = control.width();
    var div_height = control.height();

    // РїСЂРѕСЃРєСЂРѕР»Р»РµРЅРѕ СЃРІРµСЂС…Сѓ
    var top_scroll = $(document).scrollTop();
    // РїСЂРѕСЃРєСЂРѕР»Р»РµРЅРѕ СЃР»РµРІР°
    var left_scroll = $(document).scrollLeft();
    // С€РёСЂРёРЅР° РІРёРґРёРјРѕР№ СЃС‚СЂР°РЅРёС†С‹
    var screen_width = $(window).width();
    // РІС‹СЃРѕС‚Р° РІРёРґРёРјРѕР№ СЃС‚СЂР°РЅРёС†С‹
    var screen_height = $(window).height();

    // РєРѕРѕСЂРґРёРЅР°С‚С‹ СѓРіР»РѕРІ РІРёРґРёРјРѕР№ РѕР±Р»Р°СЃС‚Рё
    var see_x1 = left_scroll;
    var see_x2 = screen_width + left_scroll;
    var see_y1 = top_scroll;
    var see_y2 = screen_height + top_scroll;

    // РєРѕРѕСЂРґРёРЅР°С‚С‹ СѓРіР»РѕРІ РёСЃРєРѕРјРѕРіРѕ СЌР»РµРјРµРЅС‚Р°
    var div_x1 = div_left;
    var div_x2 = div_left + div_height;
    var div_y1 = div_top;
    var div_y2 = div_top + div_width;

    // РїСЂРѕРІРµСЂРєР° - РІРёРґРµРЅ РґРёРІ РїРѕР»РЅРѕСЃС‚СЊСЋ РёР»Рё РЅРµС‚
    if ((div_x1 >= see_x1 && div_x2 <= see_x2 && div_y1 >= see_y1 && div_y2 <= see_y2) && (!control[0].classList.contains('js-ec-showed'))) {
        // РµСЃР»Рё РІРёРґРµРЅ

        return true;
    } else {
        // РµСЃР»Рё РЅРµ РІРёРґРµРЅ
        return false;
    }
}

// ECOMMERCE

//  РџСЂРѕСЃРјРѕС‚СЂРµРЅРЅС‹Рµ С‚РѕРІР°СЂС‹ РЅР° СЃС‚СЂР°РЅРёС†Рµ РєРѕС‚РѕР»РѕРіР°
function sendDataECShow(goodID) {
    var item = productsObject[goodID];

    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        'ecommerce': {
            'currencyCode': 'RUB',
            'impressions': [{
                'name': item.name,
                'id': goodID,
                'price': item.price,
                'brand': item.brand,
                'category': item.category,
                'list': item.list,
                'position': item.counter + 1
            }]
        },
        'event': 'gtm-ee-event',
        'gtm-ee-event-category': 'Enhanced Ecommerce',
        'gtm-ee-event-action': 'Product Impressions',
        'gtm-ee-event-non-interaction': 'True'
    });


    delete productsObject[goodID];
    delete productsItems[item.counter];
}


function sendDataECShowBanners(bannerID) {
    var item = bannerObject[bannerID];

    dataLayer.push({
        'ecommerce': {
            'promoView': {
                'promotions': [{
                    'id': bannerID,
                    'name': item.name,
                    'position': item.slot
                }]
            }
        },
        'event': 'gtm-ee-event',
        'gtm-ee-event-category': 'Enhanced Ecommerce',
        'gtm-ee-event-action': 'Promotion Impressions',
        'gtm-ee-event-non-interaction': 'True',
    });

    delete bannerObject[bannerID];
    delete bannerItems[item.counter];
}

//  РљР»РёРєРё РїРѕ С‚РѕРІР°СЂР°Рј, РїРµСЂРµС…РѕРґС‹ РІ РєР°СЂС‚РѕС‡РєСѓ
function sendDataECClick(item, list, id) {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        'ecommerce': {
            'currencyCode': 'RUB',
            'click': {
                'actionField': {
                    'list': list
                },
                'products': [{
                    'name': item.name,
                    'id': id,
                    'price': item.price,
                    'brand': item.brand,
                    'category': item.category,
                }]
            }
        },
        'event': 'gtm-ee-event',
        'gtm-ee-event-category': 'Enhanced Ecommerce',
        'gtm-ee-event-action': 'Product Clicks',
        'gtm-ee-event-non-interaction': 'False'
    });

}


// РЈРґР°Р»РµРЅРёРµ РёР· РєРѕСЂР·РёРЅС‹

function sendDataECRemoveItem(obj, count, products) {
    window.dataLayer = window.dataLayer || [];

    if (!products) {
        products = [{
            'name': obj.dataset.name,
            'id': obj.dataset.id,
            'price': obj.dataset.price,
            'brand': obj.dataset.brand,
            'category': obj.dataset.category,
            'quantity': count
        }];
    }

    dataLayer.push({
        'ecommerce': {
            'currencyCode': 'RUB',
            'remove': {
                'products': products
            }
        },
        'event': 'gtm-ee-event',
        'gtm-ee-event-category': 'Enhanced Ecommerce',
        'gtm-ee-event-action': 'Removing a Product from a Shopping Cart',
        'gtm-ee-event-non-interaction': 'False',
    });

}

// РўРѕРІР°СЂ РєСѓРїР»РµРЅ РєРЅРѕРїРєРѕР№ РїР»СЋСЃ РІ РєРѕСЂР·РёРЅРµ

function sendDataECAddproduct(obj) {

    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        'ecommerce': {
            'currencyCode': 'RUB',
            'add': {
                'products': [{
                    'name': obj.dataset.name,
                    'id': obj.dataset.id,
                    'price': obj.dataset.price,
                    'brand': obj.dataset.brand,
                    'category': obj.dataset.category,
                    'quantity': 1
                }]
            }
        },
        'event': 'gtm-ee-event',
        'gtm-ee-event-category': 'Enhanced Ecommerce',
        'gtm-ee-event-action': 'Adding a Product to a Shopping Cart',
        'gtm-ee-event-non-interaction': 'False',
    });

}

function sendDataECOrderSteps(step, products, action) {

    if (step != 3) {

        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            'ecommerce': {
                'currencyCode': 'RUB',
                'checkout': {
                    'actionField': {
                        'step': step,
                        'option': action ? action : ''
                    },
                    'products': products
                }
            },
            'event': 'gtm-ee-event',
            'gtm-ee-event-category': 'Enhanced Ecommerce',
            'gtm-ee-event-action': 'Checkout Step ' + step,
            'gtm-ee-event-non-interaction': 'False'
        });


    } else {

        var time = Date.now();
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            'ecommerce': {
                'currencyCode': 'RUB',
                'purchase': {
                    'actionField': {
                        'id': time,
                        'affiliation': 'Online Store'
                    },
                    'products': products
                }
            },
            'event': 'gtm-ee-event',
            'gtm-ee-event-category': 'Enhanced Ecommerce',
            'gtm-ee-event-action': 'Purchase',
            'gtm-ee-event-non-interaction': 'False'
        });
    }
}

$.expr[":"].Contains = jQuery.expr.createPseudo(function (arg) {
    return function (elem) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}


    // Slider

    // var $variationsSlider = $('.variations__slider');

    // if( $variationsSlider.length > 0 ) {

    //   $variationsSlider.slick({
    //     slidesToScroll: 1,
    //     dots: false,
    //     mobileFirst: true,
    //     infinite: true,
    //     adaptiveHeight: true,
    //     speed: 300,
    //     prevArrow: '.variations__slider-prev',
    //     nextArrow: '.variations__slider-next',

    //     responsive: [
    //       {
    //         breakpoint: 1,
    //         settings: {
    //           slidesToShow: 1,
    //           arrows: false,
    //         }
    //       },
    //       {
    //         breakpoint: 376,
    //         settings: {
    //           slidesToShow: 1,
    //           arrows: false,
    //         }
    //       },

    //       {
    //         breakpoint: 640,
    //         settings: {
    //           slidesToShow: 3,
    //         }
    //       }
    //     ]
    //   });

    // }

    // Phone Mask

    // $('.form__field_phone input').mask("+ 7(999)999-99-99", {

    // });




  });




})(jQuery);
