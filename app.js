/* =========================================================================
   OMNI COFFEE — state, router, event delegation
   ========================================================================= */
(function(){
  var D = window.OMNI_DATA;
  var UI = window.OMNI_UI;
  var PAGES = window.OMNI_PAGES;
  var ICONS = UI.ICONS;

  /* ---------------------------------------------------------------------
     STATE
     --------------------------------------------------------------------- */
  var STATE = (function(){
    var KEY = 'omni-proto-state-v1';
    var data = load();
    function load(){
      try{
        var raw = localStorage.getItem(KEY);
        if(raw){ var parsed = JSON.parse(raw); if(parsed && parsed.cart) return parsed; }
      }catch(e){}
      return { cart:[], favorites:[], auth:{ loggedIn:false, phone:'', name:'' } };
    }
    function save(){ try{ localStorage.setItem(KEY, JSON.stringify(data)); }catch(e){} }

    function findLine(id,weight){ return data.cart.filter(function(l){ return l.id===id && l.weight===weight; })[0]; }
    function addToCart(id,weight,qty){
      qty = qty||1;
      var line = findLine(id,weight);
      if(line) line.qty += qty; else data.cart.push({ id:id, weight:weight, qty:qty });
      save();
    }
    function setQty(id,weight,qty){
      var line = findLine(id,weight);
      if(!line) return;
      line.qty = qty;
      if(line.qty<=0) data.cart = data.cart.filter(function(l){ return l!==line; });
      save();
    }
    function removeFromCart(id,weight){ data.cart = data.cart.filter(function(l){ return !(l.id===id && l.weight===weight); }); save(); }
    function clearCart(){ data.cart = []; save(); }
    function cartLines(){
      return data.cart.map(function(l){
        var p = UI.productById(l.id);
        if(!p) return null;
        var price = l.weight==='1000' ? p.price1000 : p.price250;
        return { product:p, weight:l.weight, qty:l.qty, lineTotal:price*l.qty };
      }).filter(Boolean);
    }
    function cartCount(){ return data.cart.reduce(function(s,l){ return s+l.qty; },0); }
    function cartTotal(){ return cartLines().reduce(function(s,l){ return s+l.lineTotal; },0); }

    function isFav(id){ return data.favorites.indexOf(id)>-1; }
    function toggleFav(id){
      var i = data.favorites.indexOf(id);
      if(i>-1) data.favorites.splice(i,1); else data.favorites.push(id);
      save();
      return isFav(id);
    }

    function login(phone,name){ data.auth = { loggedIn:true, phone:phone, name:name||'' }; save(); }
    function logout(){ data.auth = { loggedIn:false, phone:'', name:'' }; save(); }
    function updateProfile(fields){ data.auth = Object.assign({}, data.auth, fields); save(); }

    return {
      get cart(){ return data.cart; },
      get favorites(){ return data.favorites; },
      get auth(){ return data.auth; },
      addToCart:addToCart, setQty:setQty, removeFromCart:removeFromCart, clearCart:clearCart,
      cartLines:cartLines, cartCount:cartCount, cartTotal:cartTotal,
      isFav:isFav, toggleFav:toggleFav, login:login, logout:logout, updateProfile:updateProfile
    };
  })();
  window.OMNI_STATE = STATE;

  /* ---------------------------------------------------------------------
     TOASTS / MODALS
     --------------------------------------------------------------------- */
  function showToast(html, timeout){
    var stack = document.getElementById('toastStack');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    stack.appendChild(el);
    var t = setTimeout(remove, timeout||5000);
    function remove(){ clearTimeout(t); if(el.parentNode) el.parentNode.removeChild(el); }
    el.addEventListener('click', function(e){ if(e.target.closest('[data-action="close-toast"]')) remove(); });
  }
  function toastAddCart(p, weight, qty){
    showToast(
      UI.bagVisual(p, { size:'bag-mini' })+
      '<div class="t-body">'+
        '<div class="t-title">Добавлено в корзину</div>'+
        '<div class="t-sub">'+p.region+' '+p.lot+' · '+weight+' г × '+qty+'</div>'+
        '<div class="t-actions"><a class="btn btn-flame btn-sm" href="#/cart">В корзину</a><button class="btn btn-line btn-sm" data-action="close-toast" type="button">Продолжить</button></div>'+
      '</div>'+
      '<button class="t-close" data-action="close-toast" aria-label="Закрыть">'+ICONS.close+'</button>'
    );
  }
  function toastFav(added){
    showToast(
      '<div class="t-ico">'+ICONS.heart+'</div>'+
      '<div class="t-body"><div class="t-title">'+(added?'Добавлено в избранное':'Удалено из избранного')+'</div></div>'+
      '<button class="t-close" data-action="close-toast" aria-label="Закрыть">'+ICONS.close+'</button>',
      2400
    );
  }
  function toastMsg(title, sub){
    showToast(
      '<div class="t-ico">'+ICONS.check+'</div>'+
      '<div class="t-body"><div class="t-title">'+title+'</div>'+(sub?'<div class="t-sub">'+sub+'</div>':'')+'</div>'+
      '<button class="t-close" data-action="close-toast" aria-label="Закрыть">'+ICONS.close+'</button>',
      4500
    );
  }
  function showModal(html){
    document.getElementById('modalCard').innerHTML = html;
    document.getElementById('modalBackdrop').classList.add('is-open');
    document.body.classList.add('no-scroll');
  }
  function closeModal(){
    document.getElementById('modalBackdrop').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }
  function showThankYouModal(orderNumber){
    showModal(
      '<button class="modal-close btn-icon" data-action="close-modal" aria-label="Закрыть">'+ICONS.close+'</button>'+
      '<div class="ico-ok">'+ICONS.check+'</div>'+
      '<h3>Заказ '+orderNumber+' принят!</h3>'+
      '<p>Мы свяжемся с вами для подтверждения в течение часа. Обжарим и соберём со всей заботой — скоро будет у вас.</p>'+
      '<div class="m-actions">'+
        '<a class="btn btn-flame" href="#/account/orders" data-action="close-modal">Личный кабинет</a>'+
        '<a class="btn btn-line" href="#/" data-action="close-modal">На главную</a>'+
      '</div>'
    );
  }

  /* ---------------------------------------------------------------------
     HEADER CHROME (mega menu, drawer, footer catalog) — built once
     --------------------------------------------------------------------- */
  function initHeaderChrome(){
    var megaHtml = D.CATEGORIES.map(function(c){
      var prods = D.PRODUCTS.filter(function(p){ return p.category===c.slug; }).slice(0,5);
      return '<div class="mega-cat">'+
        '<a class="mega-cat-link" href="#/catalog/'+c.slug+'"><span>'+c.title+'</span>'+ICONS.arrow+'</a>'+
        '<div class="mega-sub">'+
          prods.map(function(p){ return '<a href="#/product/'+p.slug+'">'+p.region+' '+p.lot+'</a>'; }).join('')+
          '<a class="mega-sub-all" href="#/catalog/'+c.slug+'">Все товары категории '+ICONS.arrow+'</a>'+
        '</div>'+
      '</div>';
    }).join('') + '<a class="mega-all-link" href="#/catalog">Весь каталог '+ICONS.arrow+'</a>';
    document.getElementById('catalogMega').innerHTML = megaHtml;
    document.getElementById('drawerCatalog').innerHTML = D.CATEGORIES.map(function(c){
      return '<a href="#/catalog/'+c.slug+'">'+c.short+'</a>';
    }).join('') + '<a href="#/catalog">Весь каталог</a>';
    document.getElementById('footCatalog').innerHTML = D.CATEGORIES.map(function(c){
      return '<li><a href="#/catalog/'+c.slug+'">'+c.title+'</a></li>';
    }).join('');

    document.getElementById('searchOpenBtn').innerHTML = ICONS.search;
    document.getElementById('favIcon').innerHTML = ICONS.heart;
    document.getElementById('cartIcon').innerHTML = ICONS.cart;
    document.getElementById('accountIcon').innerHTML = ICONS.user;
    document.getElementById('searchCloseBtn').innerHTML = ICONS.close;
    document.getElementById('drawerCloseBtn').innerHTML = ICONS.close;
    document.getElementById('footInsta').innerHTML = ICONS.instagram;
    document.getElementById('footTg').innerHTML = ICONS.telegram;
    document.getElementById('drawerSearchIcon').innerHTML = ICONS.search;
    document.querySelector('#searchBox .icon-btn') && (document.querySelector('#searchBox .icon-btn').innerHTML = ICONS.search);
    var searchSubmitBtn = document.querySelector('#searchForm button[type=submit]');
    if(searchSubmitBtn) searchSubmitBtn.innerHTML = ICONS.search;

    window.addEventListener('scroll', function(){
      document.getElementById('siteHeader').classList.toggle('is-scrolled', window.scrollY > 30);
    }, { passive:true });
  }

  function updateHeaderState(){
    setBadge('favIcon', STATE.favorites.length);
    setBadge('cartIcon', STATE.cartCount());
    document.getElementById('accountIcon').setAttribute('href', STATE.auth.loggedIn ? '#/account' : '#/login');
    var dCart = document.getElementById('drawerCartCount'); if(dCart) dCart.textContent = STATE.cartCount() ? '('+STATE.cartCount()+')' : '';
    var dFav = document.getElementById('drawerFavCount'); if(dFav) dFav.textContent = STATE.favorites.length ? '('+STATE.favorites.length+')' : '';
  }
  function setBadge(iconId, count){
    var el = document.getElementById(iconId);
    var badge = el.querySelector('.hd-badge');
    if(count>0){
      if(!badge){ badge = document.createElement('span'); badge.className='hd-badge'; el.appendChild(badge); }
      badge.textContent = count;
    } else if(badge){ badge.remove(); }
  }

  function closeMobileNav(){ document.body.classList.remove('nav-open'); document.getElementById('burgerBtn').setAttribute('aria-expanded','false'); }
  function closeSearch(){ document.getElementById('searchOverlay').classList.remove('is-open'); }

  /* ---------------------------------------------------------------------
     ROUTER
     --------------------------------------------------------------------- */
  var checkoutStep = 1;
  var heroTimer = null;

  function currentPath(){
    var hash = location.hash || '#/';
    var raw = hash.slice(1);
    var qIndex = raw.indexOf('?');
    return qIndex>-1 ? raw.slice(0,qIndex) : (raw||'/');
  }

  function route(opts){
    opts = opts || {};
    var hash = location.hash || '#/';
    var raw = hash.slice(1);
    var qIndex = raw.indexOf('?');
    var path = qIndex>-1 ? raw.slice(0,qIndex) : raw;
    var queryStr = qIndex>-1 ? raw.slice(qIndex+1) : '';
    if(path==='') path = '/';
    var params = {};
    queryStr.split('&').forEach(function(pair){
      if(!pair) return;
      var kv = pair.split('=');
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]||'');
    });

    if(path.indexOf('/account')===0 && !STATE.auth.loggedIn){
      if(location.hash !== '#/login') location.hash = '#/login';
      return;
    }

    var html = '', m;
    if(path==='/') html = PAGES.renderHome();
    else if(path==='/catalog') html = PAGES.renderCatalog('');
    else if((m=path.match(/^\/catalog\/([^\/]+)$/))) html = PAGES.renderCatalog(m[1]);
    else if((m=path.match(/^\/product\/([^\/]+)$/))) html = PAGES.renderProduct(m[1]);
    else if(path==='/about') html = PAGES.renderAbout();
    else if(path==='/production') html = PAGES.renderProduction();
    else if(path==='/contacts') html = PAGES.renderContacts();
    else if(path==='/news') html = PAGES.renderNews();
    else if((m=path.match(/^\/news\/([^\/]+)$/))) html = PAGES.renderNewsDetail(m[1]);
    else if(path==='/careers') html = PAGES.renderCareers();
    else if((m=path.match(/^\/careers\/([^\/]+)$/))) html = PAGES.renderCareerDetail(m[1]);
    else if(path==='/wholesale') html = PAGES.renderWholesale();
    else if(path==='/buyers-info') html = PAGES.renderBuyersInfo();
    else if((m=path.match(/^\/page\/([^\/]+)$/))) html = PAGES.renderGenericPage(m[1]);
    else if(path==='/search') html = PAGES.renderSearch(params.q||'');
    else if(path==='/cart') html = PAGES.renderCart();
    else if(path==='/checkout') html = PAGES.renderCheckout();
    else if(path==='/login') html = PAGES.renderLogin();
    else if(path==='/account') html = PAGES.renderAccountProfile();
    else if(path==='/account/orders') html = PAGES.renderAccountOrders();
    else if((m=path.match(/^\/account\/orders\/(\d+)$/))) html = PAGES.renderAccountOrderDetail(m[1]);
    else if(path==='/account/favorites') html = PAGES.renderAccountFavorites();
    else if(path==='/account/reviews') html = PAGES.renderAccountReviews();
    else html = PAGES.render404();

    document.getElementById('app').innerHTML = html;
    document.body.classList.toggle('route-home', path==='/');
    if(!opts.preserveScroll) window.scrollTo({ top:0, behavior:'auto' });
    closeMobileNav(); closeSearch();
    updateHeaderState();
    enhancePage(path);
  }
  window.OMNI_ROUTE = route;

  function enhancePage(path){
    initReveal();
    if(path==='/'){ initHeroSlider(); initCounters(); }
    if(path==='/catalog' || /^\/catalog\//.test(path)) PAGES.refreshCatalogResults();
    if(path==='/checkout') checkoutStep = 1;
  }

  function initReveal(){
    var els = document.querySelectorAll('#app .reveal');
    if(!('IntersectionObserver' in window)){ els.forEach(function(el){ el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold:.12 });
    els.forEach(function(el){ io.observe(el); });
  }

  function initCounters(){
    var grid = document.querySelector('#app .stats-grid');
    if(!grid) return;
    var counted = false;
    function animate(){
      if(counted) return; counted = true;
      grid.querySelectorAll('.js-count').forEach(function(el){
        var target = parseInt(el.getAttribute('data-target'),10);
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if(reduce){ el.textContent = target; return; }
        var start = null, dur = 1200;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min((ts-start)/dur,1);
          el.textContent = Math.round((1-Math.pow(1-p,3))*target);
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ animate(); io.disconnect(); } }); }, { threshold:.3 });
      io.observe(grid);
    } else animate();
  }

  function initHeroSlider(){
    var slides = document.querySelectorAll('#app .hero-slide');
    var dots = document.querySelectorAll('#app .hero-dot');
    if(!slides.length) return;
    var idx = 0;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(i){
      idx = (i+slides.length)%slides.length;
      slides.forEach(function(s,n){ s.classList.toggle('is-active', n===idx); });
      dots.forEach(function(d,n){ d.classList.toggle('is-active', n===idx); });
    }
    function next(){ show(idx+1); }
    function prev(){ show(idx-1); }
    function start(){ if(reduce) return; stop(); heroTimer = setInterval(next, 6000); }
    function stop(){ if(heroTimer){ clearInterval(heroTimer); heroTimer=null; } }
    var nextBtn = document.getElementById('heroNext'), prevBtn = document.getElementById('heroPrev');
    if(nextBtn) nextBtn.addEventListener('click', function(){ next(); start(); });
    if(prevBtn) prevBtn.addEventListener('click', function(){ prev(); start(); });
    dots.forEach(function(d){ d.addEventListener('click', function(){ show(+d.getAttribute('data-i')); start(); }); });
    var heroEl = document.getElementById('hero');
    if(heroEl){ heroEl.addEventListener('mouseenter', stop); heroEl.addEventListener('mouseleave', start); }
    start();
  }

  /* ---------------------------------------------------------------------
     DELEGATED EVENTS
     --------------------------------------------------------------------- */
  document.addEventListener('click', function(e){
    var t = e.target;

    if(t.closest('#searchOpenBtn')){ document.getElementById('searchOverlay').classList.add('is-open'); setTimeout(function(){ document.getElementById('searchInput').focus(); },50); return; }
    if(t.closest('#searchCloseBtn') || (t.id==='searchOverlay')){ closeSearch(); return; }
    var exampleLink = t.closest('[data-search-example]');
    if(exampleLink){ e.preventDefault(); var val = exampleLink.getAttribute('data-search-example'); document.getElementById('searchInput').value = val; location.hash = '#/search?q='+encodeURIComponent(val); closeSearch(); return; }

    if(t.closest('#burgerBtn')){ var open = document.body.classList.toggle('nav-open'); document.getElementById('burgerBtn').setAttribute('aria-expanded', open?'true':'false'); return; }
    if(t.closest('#drawerCloseBtn')){ closeMobileNav(); return; }
    if(t.closest('#drawerSearchBtn')){ closeMobileNav(); document.getElementById('searchOverlay').classList.add('is-open'); setTimeout(function(){ document.getElementById('searchInput').focus(); },50); return; }

    var act = t.closest('[data-action]');
    if(!act) {
      if(t.id==='modalBackdrop') closeModal();
      return;
    }
    var action = act.getAttribute('data-action');

    switch(action){
      case 'toggle-fav': {
        var id = Number(act.getAttribute('data-id'));
        var added = STATE.toggleFav(id);
        act.classList.toggle('is-active', added);
        updateHeaderState();
        toastFav(added);
        if(currentPath()==='/account/favorites') route({ preserveScroll:true });
        break;
      }
      case 'add-to-cart': {
        var pid = Number(act.getAttribute('data-id'));
        var w = act.getAttribute('data-weight')||'250';
        var p = UI.productById(pid);
        if(!p || p.inStock===false) break;
        STATE.addToCart(pid, w, 1);
        updateHeaderState();
        toastAddCart(p, w, 1);
        break;
      }
      case 'pd-thumb': {
        document.querySelectorAll('.pd-thumbs .bag').forEach(function(b){ b.classList.remove('is-active'); });
        act.classList.add('is-active');
        var tint = act.getAttribute('data-tint');
        var main = document.querySelector('#pdGalleryMain .bag');
        if(main){ main.classList.remove('tint-light','tint-dark'); main.classList.add('tint-'+tint); }
        break;
      }
      case 'pd-qty': {
        var box = document.getElementById('pdQty');
        var cur = parseInt(box.getAttribute('data-qty'),10)||1;
        cur = act.getAttribute('data-op')==='inc' ? cur+1 : Math.max(1,cur-1);
        box.setAttribute('data-qty', cur);
        box.querySelector('span').textContent = cur;
        break;
      }
      case 'pd-add-cart': {
        var pid2 = Number(act.getAttribute('data-id'));
        var p2 = UI.productById(pid2);
        if(!p2 || p2.inStock===false) break;
        var weightEl = document.querySelector('input[name=pdWeight]:checked');
        var w2 = weightEl ? weightEl.value : '250';
        var qty2 = parseInt(document.getElementById('pdQty').getAttribute('data-qty'),10)||1;
        STATE.addToCart(pid2, w2, qty2);
        updateHeaderState();
        toastAddCart(p2, w2, qty2);
        break;
      }
      case 'pd-tab': {
        var tab = act.getAttribute('data-tab');
        act.parentElement.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('is-active'); });
        act.classList.add('is-active');
        document.querySelectorAll('[data-pd-panel]').forEach(function(pnl){ pnl.style.display = (pnl.getAttribute('data-pd-panel')===tab) ? '' : 'none'; });
        break;
      }
      case 'pd-rate': {
        var v = Number(act.getAttribute('data-v'));
        var picker = document.getElementById('pdRatePicker');
        picker.setAttribute('data-value', v);
        Array.prototype.forEach.call(picker.querySelectorAll('button'), function(b,i){ b.classList.toggle('is-on', i<v); });
        break;
      }
      case 'pd-submit-review': {
        var rating = Number(document.getElementById('pdRatePicker').getAttribute('data-value'))||0;
        var text = document.getElementById('pdReviewText').value.trim();
        if(rating===0 || !text){ toastMsg('Заполните оценку и текст отзыва',''); break; }
        var mProd = currentPath().match(/^\/product\/([^\/]+)$/);
        var prod = mProd ? UI.productBySlug(mProd[1]) : null;
        if(prod){
          D.PRODUCT_REVIEWS[prod.id] = D.PRODUCT_REVIEWS[prod.id] || [];
          D.PRODUCT_REVIEWS[prod.id].unshift({ author:'Вы', rating:rating, date:'сегодня', text:text });
        }
        toastMsg('Спасибо за отзыв!','Он появится на странице товара');
        route({ preserveScroll:true });
        break;
      }
      case 'open-brew-guide': {
        var methodKey = act.getAttribute('data-method');
        var method = D.BREW_METHODS.filter(function(m){ return m.key===methodKey; })[0];
        if(method){
          showModal(
            '<button class="modal-close btn-icon" data-action="close-modal" aria-label="Закрыть">'+ICONS.close+'</button>'+
            '<div class="ico-ok" style="background:var(--stone);color:var(--flame);">'+UI.ICONS[method.icon]+'</div>'+
            '<h3>'+method.title+'</h3>'+
            '<p>'+method.text+'</p>'+
            '<div class="m-actions"><button class="btn btn-line" data-action="close-modal">Понятно</button></div>'
          );
        }
        break;
      }
      case 'home-tab': {
        var hkey = act.getAttribute('data-tab');
        act.parentElement.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('is-active'); });
        act.classList.add('is-active');
        document.querySelectorAll('#catalog-teaser .carousel').forEach(function(c){ c.classList.toggle('is-active', c.getAttribute('data-panel')===hkey); });
        break;
      }
      case 'home-car-prev': case 'home-car-next': {
        var activeCar = document.querySelector('#catalog-teaser .carousel.is-active');
        if(activeCar) activeCar.scrollBy({ left: action==='home-car-next'?300:-300, behavior:'smooth' });
        break;
      }
      case 'cat-page': {
        PAGES.catalogFilterState().page = Number(act.getAttribute('data-page'));
        PAGES.refreshCatalogResults();
        var resWrap = document.getElementById('catalogApp'); if(resWrap) resWrap.scrollIntoView({ block:'start', behavior:'smooth' });
        break;
      }
      case 'cart-qty': {
        var cid = Number(act.getAttribute('data-id')), cw = act.getAttribute('data-weight');
        var line = STATE.cartLines().filter(function(l){ return l.product.id===cid && l.weight===cw; })[0];
        var newQty = (line?line.qty:0) + (act.getAttribute('data-op')==='inc'?1:-1);
        STATE.setQty(cid, cw, newQty);
        updateHeaderState();
        route({ preserveScroll:true });
        break;
      }
      case 'cart-remove': {
        STATE.removeFromCart(Number(act.getAttribute('data-id')), act.getAttribute('data-weight'));
        updateHeaderState();
        route({ preserveScroll:true });
        break;
      }
      case 'apply-promo': {
        var code = (document.getElementById('promoInput').value||'').trim().toUpperCase();
        if(code==='OMNI10') toastMsg('Промокод применён','Скидка 10% будет учтена менеджером при подтверждении заказа');
        else toastMsg('Промокод не найден','Проверьте правильность ввода');
        break;
      }
      case 'checkout-next': case 'checkout-prev': {
        checkoutStep = action==='checkout-next' ? Math.min(4, checkoutStep+1) : Math.max(1, checkoutStep-1);
        updateCheckoutUI();
        break;
      }
      case 'place-order': {
        var orderNumber = 'OMN-'+(10000+Math.floor(Math.random()*89999));
        STATE.clearCart();
        updateHeaderState();
        showThankYouModal(orderNumber);
        break;
      }
      case 'close-modal': closeModal(); break;
      case 'close-toast': { var toastEl = act.closest('.toast'); if(toastEl) toastEl.remove(); break; }

      case 'login-send-code': {
        var phone = document.getElementById('loginPhone').value.trim();
        if(phone.replace(/\D/g,'').length < 10){ toastMsg('Введите корректный номер телефона',''); break; }
        var channel = document.querySelector('input[name=otpChannel]:checked').value;
        document.getElementById('loginStepPhone').style.display = 'none';
        document.getElementById('loginStepCode').style.display = '';
        document.getElementById('loginCodeHint').textContent = 'Код отправлен '+(channel==='sms'?'по SMS на ':'в Telegram на ')+phone;
        document.getElementById('loginStepCode').setAttribute('data-phone', phone);
        var first = document.querySelector('[data-otp-i="0"]'); if(first) first.focus();
        startResendCooldown();
        break;
      }
      case 'login-resend': {
        toastMsg('Код отправлен повторно','');
        startResendCooldown();
        break;
      }
      case 'login-confirm-code': {
        var inputs = document.querySelectorAll('[data-otp-i]');
        var code = Array.prototype.map.call(inputs, function(i){ return i.value; }).join('');
        if(code.length < 4){ toastMsg('Введите код полностью',''); break; }
        var phoneVal = document.getElementById('loginStepCode').getAttribute('data-phone');
        STATE.login(phoneVal, '');
        updateHeaderState();
        toastMsg('Добро пожаловать!','Вы вошли в личный кабинет');
        location.hash = '#/account';
        break;
      }
      case 'logout': { STATE.logout(); updateHeaderState(); break; }
    }
  });

  function updateCheckoutUI(){
    document.querySelectorAll('#checkoutStepper .step').forEach(function(st){
      var n = Number(st.getAttribute('data-step-i'));
      st.classList.toggle('is-active', n===checkoutStep);
      st.classList.toggle('is-done', n<checkoutStep);
    });
    document.querySelectorAll('.checkout-panel').forEach(function(p){
      p.classList.toggle('is-active', Number(p.getAttribute('data-step'))===checkoutStep);
    });
  }

  function startResendCooldown(){
    var btn = document.querySelector('[data-action="login-resend"]');
    if(!btn) return;
    var seconds = 30;
    btn.disabled = true;
    var original = 'Отправить код ещё раз';
    var timer = setInterval(function(){
      seconds--;
      btn.textContent = 'Повторить через '+seconds+' с';
      if(seconds<=0){ clearInterval(timer); btn.disabled=false; btn.textContent = original; }
    }, 1000);
  }

  /* change/input events: filters, weight radios, otp auto-advance */
  document.addEventListener('change', function(e){
    if(e.target.matches('[data-action="cat-filter"]')){ PAGES.catalogFilterState().page = 1; PAGES.refreshCatalogResults(); }
    if(e.target.matches('input[name=pdWeight]')){
      var price = e.target.getAttribute('data-price');
      var priceEl = document.getElementById('pdPrice');
      if(priceEl) priceEl.textContent = UI.fmtPrice(Number(price));
      var weightLabel = document.querySelector('.pd-price .weight');
      if(weightLabel) weightLabel.textContent = 'за '+(e.target.value==='1000'?'1 кг':'250 г');
    }
  });
  document.addEventListener('input', function(e){
    if(e.target.matches('[data-action="cat-filter"]')) { PAGES.catalogFilterState().page = 1; PAGES.refreshCatalogResults(); }
    if(e.target.matches('[data-otp-i]')){
      var i = Number(e.target.getAttribute('data-otp-i'));
      e.target.value = e.target.value.replace(/\D/g,'').slice(0,1);
      if(e.target.value && i<3){ var nextInput = document.querySelector('[data-otp-i="'+(i+1)+'"]'); if(nextInput) nextInput.focus(); }
    }
  });
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape'){ closeSearch(); closeModal(); }
    if(e.target.matches('[data-otp-i]') && e.key==='Backspace' && !e.target.value){
      var i = Number(e.target.getAttribute('data-otp-i'));
      if(i>0){ var prevInput = document.querySelector('[data-otp-i="'+(i-1)+'"]'); if(prevInput) prevInput.focus(); }
    }
  });

  /* forms */
  document.addEventListener('submit', function(e){
    var form = e.target.closest('form');
    if(!form) return;
    if(form.id==='searchForm'){
      e.preventDefault();
      var q = document.getElementById('searchInput').value.trim();
      location.hash = '#/search?q='+encodeURIComponent(q);
      closeSearch();
      return;
    }
    var kind = form.getAttribute('data-form');
    if(!kind) return;
    e.preventDefault();
    if(kind==='contact') toastMsg('Сообщение отправлено!','Мы свяжемся с вами в ближайшее время');
    else if(kind==='wholesale') toastMsg('Заявка принята!','Менеджер свяжется с вами в течение рабочего дня');
    else if(kind==='vacancy-apply') toastMsg('Отклик отправлен!','Мы рассмотрим его и свяжемся с вами');
    else if(kind==='profile'){
      var nameVal = form.querySelector('[name=name]').value.trim();
      STATE.updateProfile({ name:nameVal });
      toastMsg('Изменения сохранены','');
      route({ preserveScroll:true });
      return;
    }
    form.reset();
  });

  document.getElementById('modalBackdrop').addEventListener('click', function(e){ if(e.target===this) closeModal(); });

  /* ---------------------------------------------------------------------
     BOOT
     --------------------------------------------------------------------- */
  window.addEventListener('hashchange', function(){ route(); });
  document.addEventListener('DOMContentLoaded', function(){
    initHeaderChrome();
    route();
  });
})();
