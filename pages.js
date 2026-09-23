/* =========================================================================
   OMNI COFFEE — page render functions
   Each function returns an HTML string for the <main id="app"> outlet.
   Depends on: window.OMNI_DATA (D), window.OMNI_UI (UI), window.OMNI_STATE (S)
   ========================================================================= */
window.OMNI_PAGES = (function(){
  var D = window.OMNI_DATA;
  var UI = window.OMNI_UI;
  function S(){ return window.OMNI_STATE; }
  var esc = UI.esc, fmtPrice = UI.fmtPrice, ICONS = UI.ICONS;

  var PAGE_SIZE = 8;

  /* ---------- small shared blocks ---------- */

  function pageHero(eyebrow, title, lead, crumbs){
    return (
      '<section class="page-hero">'+
        '<div class="wrap">'+
          (crumbs ? UI.breadcrumbs(crumbs) : '')+
          '<span class="eyebrow">'+esc(eyebrow)+'</span>'+
          '<h1>'+title+'</h1>'+
          (lead ? '<p class="lead">'+lead+'</p>' : '')+
        '</div>'+
      '</section>'
    );
  }

  function productGrid(list, favIds){
    if(!list.length) return UI.emptyState(ICONS.box, 'Ничего не найдено', 'Попробуйте изменить фильтры или посмотреть другую категорию.', '');
    return '<div class="grid-cards">'+list.map(function(p){ return UI.productCard(p, favIds); }).join('')+'</div>';
  }

  function relatedCarousel(category, excludeId){
    var list = D.PRODUCTS.filter(function(p){ return p.category===category && p.id!==excludeId; }).slice(0,6);
    if(!list.length) return '';
    return (
      '<section class="section">'+
        '<div class="wrap">'+
          '<div class="section-head"><div><span class="eyebrow">Похожие товары</span><h2>Из той же линейки</h2></div></div>'+
          '<div class="grid-cards">'+list.slice(0,4).map(function(p){ return UI.productCard(p, S().favorites); }).join('')+'</div>'+
        '</div>'+
      '</section>'
    );
  }

  /* ---------- HOME ---------- */

  function renderHome(){
    var specialty = D.PRODUCTS.filter(function(p){ return p.category==='specialty'; });
    var espresso = D.PRODUCTS.filter(function(p){ return p.category==='espresso'; });
    var home = D.PRODUCTS.filter(function(p){ return p.category==='home'; });
    var horeca = D.PRODUCTS.filter(function(p){ return p.category==='horeca'; });
    var news = D.NEWS.slice(0,4);
    var fav = S().favorites;

    function tabPanel(key, list, active){
      return '<div class="carousel'+(active?' is-active':'')+'" data-panel="'+key+'">'+
        list.map(function(p){ return UI.productCard(p, fav); }).join('')+
      '</div>';
    }

    return (
      '<section class="hero" id="hero">'+
        '<div class="hero-slide is-active" data-i="0"><div class="field"></div>'+
          '<div class="hero-inner">'+
            '<span class="eyebrow">Краснодар · с 1994 года</span>'+
            '<h1>Крупнейший обжарщик кофе на Юге России</h1>'+
            '<p class="sub">Собственное производство полного цикла: до 9 тонн свежей обжарки в сутки и путь зерна от плантации до вашей чашки — под одной крышей.</p>'+
            '<div class="hero-cta">'+
              '<a class="btn btn-flame" href="#/catalog">Смотреть каталог '+ICONS.arrow+'</a>'+
              '<a class="btn btn-line" href="#/about">О компании</a>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="hero-slide" data-i="1"><div class="field"></div>'+
          '<div class="hero-inner">'+
            '<span class="eyebrow">Specialty · Q80+</span>'+
            '<h1>#ЯБариста — кофе ручной работы</h1>'+
            '<p class="sub">Премиальные лоты с оценкой не ниже 80 баллов по шкале Q. Профиль обжарки на ростере Giesen подбирается вручную под метод заваривания.</p>'+
            '<div class="hero-cta">'+
              '<a class="btn btn-flame" href="#/catalog/specialty">Каталог спешиалти '+ICONS.arrow+'</a>'+
              '<a class="btn btn-line" href="#/production">Как мы обжариваем</a>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="hero-slide" data-i="2"><div class="field"></div>'+
          '<div class="hero-inner">'+
            '<span class="eyebrow">Omni Barista School</span>'+
            '<h1>Первая на Юге России школа бариста</h1>'+
            '<p class="sub">Учим не моде, а сути: от зерна до чашки. Наши выпускники и преподаватели судят и выигрывают чемпионаты бариста всероссийского уровня.</p>'+
            '<div class="hero-cta">'+
              '<a class="btn btn-flame" href="#/about">Программы школы '+ICONS.arrow+'</a>'+
              '<a class="btn btn-line" href="#/contacts">Записаться</a>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="hero-controls">'+
          '<div class="hero-dots" id="heroDots">'+
            '<button class="hero-dot is-active" data-i="0"><span class="fill"></span></button>'+
            '<button class="hero-dot" data-i="1"><span class="fill"></span></button>'+
            '<button class="hero-dot" data-i="2"><span class="fill"></span></button>'+
          '</div>'+
          '<div class="hero-arrows">'+
            '<button class="hero-arrow" id="heroPrev" aria-label="Предыдущий слайд">'+ICONS.arrowLeft+'</button>'+
            '<button class="hero-arrow" id="heroNext" aria-label="Следующий слайд">'+ICONS.arrow+'</button>'+
          '</div>'+
        '</div>'+
      '</section>'+

      '<div class="ticker"><div class="ticker-track">'+
        '<span>Гватемала</span><span>Кения</span><span>Эфиопия</span><span>Колумбия</span><span>Индонезия</span><span>Бразилия</span>'+
        '<span>Гватемала</span><span>Кения</span><span>Эфиопия</span><span>Колумбия</span><span>Индонезия</span><span>Бразилия</span>'+
      '</div></div>'+

      '<section class="section" id="about-teaser">'+
        '<div class="wrap">'+
          '<div class="about-grid">'+
            '<div class="reveal">'+
              '<span class="eyebrow">О компании</span>'+
              '<h2 style="margin-top:14px;">История, профессионализм и качество</h2>'+
              '<div class="about-copy" style="margin-top:24px;">'+
                '<p>Кофе ОМНИ — это производство, обжарка и доставка свежего кофе, установка и обслуживание кофейного оборудования, а также первая в регионе школа бариста Omni Barista School.</p>'+
                '<p>Уже больше 20 лет наша команда организует главные чемпионаты бариста страны и обучает бариста, которые готовят кофе на работе и на сцене.</p>'+
              '</div>'+
              '<a class="btn btn-line" style="margin-top:22px;" href="#/about">Подробнее о компании '+ICONS.arrow+'</a>'+
            '</div>'+
            '<div class="quote-card reveal">'+
              '<div class="stamp">'+ICONS.stamp+'</div>'+
              '<blockquote>Make Coffee.<br>Make Happy.</blockquote>'+
              '<cite>ООО «Кофе ОМНИ» · Краснодар · с 1994</cite>'+
            '</div>'+
          '</div>'+
          '<div class="facts-row">'+
            '<div class="fact reveal"><span class="ico">'+ICONS.doc+'</span><strong>Своя школа бариста</strong><span>Omni Barista School — обучающий центр и лаборатория обжарки</span></div>'+
            '<div class="fact reveal"><span class="ico">'+ICONS.box+'</span><strong>Оборудование и сервис</strong><span>Поставка, установка и обслуживание кофемашин для кофеен</span></div>'+
            '<div class="fact reveal"><span class="ico">'+ICONS.star+'</span><strong>Судьи чемпионатов</strong><span>Организуем и судим отборочные первенства бариста Юга России</span></div>'+
            '<div class="fact reveal"><span class="ico">'+ICONS.truck+'</span><strong>Доставка по стране</strong><span>От Краснодара до любого региона России</span></div>'+
          '</div>'+
        '</div>'+
      '</section>'+

      '<section class="on-dark">'+
        '<div class="wrap" style="padding-top:clamp(56px,8vw,100px);"><span class="eyebrow">ОМНИ в цифрах</span>'+
        '<div class="stats-grid" style="margin-top:32px;">'+
          statTile('1994','', 'Год основания компании в Краснодаре')+
          statTile('9','т / сутки', 'Мощность собственного обжарочного производства')+
          statTile('20','лет+', 'Опыт команды в обжарке и подготовке бариста')+
          statTile('12','стран', 'География происхождения зелёного зерна в каталоге')+
          statTile('80','Q+', 'Минимальный балл лотов линейки #ЯБариста')+
          '<div class="stat-tile reveal"><div class="stat-num tnum" style="font-size:clamp(1.6rem,3vw,2.2rem)">250 г / 1 кг</div><div class="stat-label">Форматы фасовки — от дома до кофейни</div></div>'+
        '</div></div>'+
        '<div style="height:clamp(56px,8vw,100px)"></div>'+
      '</section>'+

      '<section class="section" id="catalog-teaser">'+
        '<div class="wrap">'+
          '<div class="section-head reveal"><div><span class="eyebrow">Каталог</span><h2>Кофе на любой профиль и метод</h2></div>'+
          '<p class="lead">От сортовых спешиалти-лотов до купажей для эспрессо-бара — обжариваем под задачу.</p></div>'+
          '<div class="tabs" role="tablist">'+
            '<button class="tab-btn is-active" data-action="home-tab" data-tab="specialty">Спешиалти #ЯБариста</button>'+
            '<button class="tab-btn" data-action="home-tab" data-tab="espresso">Эспрессо и купажи</button>'+
            '<button class="tab-btn" data-action="home-tab" data-tab="home">Кофе для дома</button>'+
            '<button class="tab-btn" data-action="home-tab" data-tab="horeca">Для кофеен</button>'+
          '</div>'+
          '<div class="carousel-wrap">'+
            tabPanel('specialty', specialty, true)+
            tabPanel('espresso', espresso, false)+
            tabPanel('home', home, false)+
            tabPanel('horeca', horeca, false)+
            '<div class="carousel-nav">'+
              '<button data-action="home-car-prev" aria-label="Назад">'+ICONS.arrowLeft+'</button>'+
              '<button data-action="home-car-next" aria-label="Вперёд">'+ICONS.arrow+'</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</section>'+

      '<section class="section on-dark" id="roasting-teaser">'+
        '<div class="wrap">'+
          '<div class="section-head reveal"><div><span class="eyebrow">Производство</span><h2>От зелёного зерна до чашки</h2></div>'+
          '<p class="lead">Собственный ростер Giesen и каппинг каждой партии — на мощностях до 9 тонн обжаренного кофе в сутки.</p></div>'+
          '<div class="process-row reveal">'+
            step('01','Отбор зерна','Прямые поставки зелёного кофе, входной контроль, лоты Q80+.')+
            step('02','Обжарка','Ростер Giesen, профиль под метод заваривания.')+
            step('03','Каппинг','Дегустация каждой партии сертифицированными бариста.')+
            step('04','Упаковка','Фасовка 250 г и 1 кг с клапаном для свежести.')+
            step('05','Доставка','По Краснодару, Югу России и всей стране.')+
          '</div>'+
          '<div style="margin-top:36px;"><a class="btn btn-line" href="#/production">Подробнее о производстве '+ICONS.arrow+'</a></div>'+
        '</div>'+
      '</section>'+

      '<section class="section on-stone-deep" id="school">'+
        '<div class="wrap"><div class="school-grid">'+
          '<div class="school-badge reveal"><div class="txt">'+
            '<svg class="cup" viewBox="0 0 24 24" fill="none"><path d="M4 8h13v6a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" stroke="currentColor" stroke-width="1.4"/><path d="M17 9h1.5a2.5 2.5 0 010 5H17" stroke="currentColor" stroke-width="1.4"/></svg>'+
            '<span class="line1">Omni Barista School</span><span class="line2">С 2010-х<br>годов</span>'+
          '</div></div>'+
          '<div class="school-copy reveal">'+
            '<span class="eyebrow">Школа бариста</span>'+
            '<h2 style="margin-top:14px;">Школа бариста ОМНИ</h2>'+
            '<div style="margin-top:22px;"><p>Компания «Кофе ОМНИ» — это не только крупнейшее обжарочное производство на Юге России, но и обучающий центр Omni Barista School: лаборатория, где мы искали профиль обжарки для сотен сортов зелёного кофе со всего мира.</p></div>'+
            '<ul class="prog-list">'+
              '<li>'+ICONS.check+'Базовый курс бариста</li>'+
              '<li>'+ICONS.check+'Каппинг и сенсорика</li>'+
              '<li>'+ICONS.check+'Подготовка к чемпионатам — Кубок Юга, Russian Barista Championship</li>'+
              '<li>'+ICONS.check+'Мастер-классы для кофеен и обжарщиков</li>'+
            '</ul>'+
            '<a class="btn btn-flame" style="margin-top:28px;" href="#/contacts">Программы и запись '+ICONS.arrow+'</a>'+
          '</div>'+
        '</div></div>'+
      '</section>'+

      '<section class="section" id="news-teaser">'+
        '<div class="wrap">'+
          '<div class="section-head reveal"><div><span class="eyebrow">Блог и новости</span><h2>Что происходит в мире ОМНИ</h2></div>'+
          '<a class="btn btn-line" href="#/news">Все материалы блога '+ICONS.arrow+'</a></div>'+
          '<div class="news-grid">'+news.map(function(n){ return UI.newsCard(n); }).join('')+'</div>'+
        '</div>'+
      '</section>'+

      '<section class="section on-dark" id="contact">'+
        '<div class="wrap"><div class="two-col" style="align-items:end;">'+
          '<div class="reveal"><span class="eyebrow">Сотрудничество</span><h2 style="margin-top:14px;">Готовы к сотрудничеству</h2>'+
          '<p class="lead">Оптовые поставки для кофеен, обслуживание оборудования и обучение персонала — больше 20 лет на кофейном рынке Юга России.</p>'+
          '<div style="display:flex;gap:14px;margin-top:26px;flex-wrap:wrap;">'+
            '<a class="btn btn-flame" href="tel:+78612229435">Позвонить нам '+ICONS.arrow+'</a>'+
            '<a class="btn btn-line" href="#/wholesale">Оптовым клиентам</a>'+
          '</div></div>'+
          '<div class="reveal" style="display:grid;gap:16px;">'+
            contactRow('Телефон','+7 861 222-94-35')+
            contactRow('Email','brand@omnicoffee.ru')+
            contactRow('Адрес','Краснодар, ул. Красных Партизан, 2/1')+
          '</div>'+
        '</div></div>'+
      '</section>'
    );
  }

  function statTile(num, unit, label){
    return '<div class="stat-tile reveal"><div class="stat-num"><span class="js-count" data-target="'+num+'">0</span>'+(unit?'<span class="unit">'+unit+'</span>':'')+'</div><div class="stat-label">'+label+'</div></div>';
  }
  function step(n,t,d){
    return '<div class="p-step"><span class="n">'+n+'</span><h3>'+t+'</h3><p>'+d+'</p></div>';
  }
  function contactRow(k,v){
    return '<div class="summary-row" style="border-color:rgba(239,231,213,.16);color:var(--cream-soft);"><span class="mono" style="text-transform:uppercase;font-size:.72rem;letter-spacing:.08em;">'+k+'</span><span style="color:var(--cream);font-weight:600;">'+v+'</span></div>';
  }

  /* ---------- CATALOG ---------- */

  var catalogFilterState = { sort:'popular', origins:[], instockOnly:false, pmin:null, pmax:null, page:1 };

  function resetCatalogFilters(){ catalogFilterState = { sort:'popular', origins:[], instockOnly:false, pmin:null, pmax:null, page:1 }; }

  function applyCatalogFilters(list, f){
    var out = list.slice();
    if(f.origins.length) out = out.filter(function(p){ return f.origins.indexOf(p.country)>-1; });
    if(f.instockOnly) out = out.filter(function(p){ return p.inStock!==false; });
    if(f.pmin!=null) out = out.filter(function(p){ return p.price250 >= f.pmin; });
    if(f.pmax!=null) out = out.filter(function(p){ return p.price250 <= f.pmax; });
    if(f.sort==='cheap') out.sort(function(a,b){ return a.price250-b.price250; });
    else if(f.sort==='exp') out.sort(function(a,b){ return b.price250-a.price250; });
    else if(f.sort==='new') out.sort(function(a,b){ return (b.badges.indexOf('new')>-1?1:0)-(a.badges.indexOf('new')>-1?1:0); });
    else out.sort(function(a,b){ return b.rating*b.reviews - a.rating*a.reviews; });
    return out;
  }

  function renderCatalog(categorySlug){
    resetCatalogFilters();
    var cat = D.CATEGORIES.filter(function(c){ return c.slug===categorySlug; })[0];
    var baseList = cat ? D.PRODUCTS.filter(function(p){ return p.category===cat.slug; }) : D.PRODUCTS.slice();
    var origins = uniq(baseList.map(function(p){ return p.country; }));

    var crumbs = cat ? [{label:'Каталог',href:'#/catalog'},{label:cat.short}] : [{label:'Каталог'}];

    return (
      pageHero('Каталог', cat ? cat.title : 'Весь каталог', cat ? cat.desc : 'Все линейки кофе «Омни» в одном месте — от спешиалти до купажей для кофеен.', crumbs)+
      '<section class="section-sm">'+
        '<div class="wrap">'+
          '<div class="tabs">'+
            catTab('', 'Все категории', !cat)+
            D.CATEGORIES.map(function(c){ return catTab(c.slug, c.short, cat&&cat.slug===c.slug); }).join('')+
          '</div>'+
          '<div class="catalog-layout" id="catalogApp" data-category="'+(cat?cat.slug:'')+'">'+
            '<aside class="filters">'+
              '<div class="filter-group"><h4>Сортировка</h4>'+
                '<select class="sort-select" id="catSort" data-action="cat-filter" style="width:100%;">'+
                  '<option value="popular">По популярности</option>'+
                  '<option value="cheap">Сначала дешевле</option>'+
                  '<option value="exp">Сначала дороже</option>'+
                  '<option value="new">Сначала новинки</option>'+
                '</select>'+
              '</div>'+
              '<div class="filter-group"><h4>Происхождение</h4>'+
                origins.map(function(o){
                  var c = baseList.filter(function(p){ return p.country===o; }).length;
                  return '<label class="filter-check"><span><input type="checkbox" data-action="cat-filter" data-origin="'+o+'"> '+o+'</span><span class="fc-count">'+c+'</span></label>';
                }).join('')+
              '</div>'+
              '<div class="filter-group"><h4>Цена, ₽ за 250 г</h4>'+
                '<div class="price-range">'+
                  '<input type="number" placeholder="от" id="catPmin" data-action="cat-filter">'+
                  '<input type="number" placeholder="до" id="catPmax" data-action="cat-filter">'+
                '</div>'+
              '</div>'+
              '<div class="filter-group" style="border-bottom:none;">'+
                '<label class="filter-check"><span><input type="checkbox" id="catInstock" data-action="cat-filter"> Только в наличии</span></label>'+
              '</div>'+
            '</aside>'+
            '<div>'+
              '<div class="toolbar"><span class="count" id="catCount"></span></div>'+
              '<div id="catalogResults"></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</section>'
    );
  }

  function catTab(slug, label, active){
    return '<a class="tab-btn'+(active?' is-active':'')+'" href="#/catalog'+(slug?'/'+slug:'')+'">'+label+'</a>';
  }

  function refreshCatalogResults(){
    var root = document.getElementById('catalogApp');
    if(!root) return;
    var cat = root.getAttribute('data-category');
    var baseList = cat ? D.PRODUCTS.filter(function(p){ return p.category===cat; }) : D.PRODUCTS.slice();

    var f = catalogFilterState;
    var sortEl = document.getElementById('catSort');
    if(sortEl) f.sort = sortEl.value;
    f.origins = Array.prototype.slice.call(document.querySelectorAll('[data-origin]:checked')).map(function(el){ return el.getAttribute('data-origin'); });
    var instockEl = document.getElementById('catInstock');
    f.instockOnly = instockEl ? instockEl.checked : false;
    var pminEl = document.getElementById('catPmin'), pmaxEl = document.getElementById('catPmax');
    f.pmin = (pminEl && pminEl.value!=='') ? Number(pminEl.value) : null;
    f.pmax = (pmaxEl && pmaxEl.value!=='') ? Number(pmaxEl.value) : null;

    var filtered = applyCatalogFilters(baseList, f);
    var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if(f.page>totalPages) f.page = totalPages;
    var pageItems = filtered.slice((f.page-1)*PAGE_SIZE, f.page*PAGE_SIZE);

    document.getElementById('catCount').textContent = filtered.length + ' ' + wordTovar(filtered.length);
    document.getElementById('catalogResults').innerHTML = productGrid(pageItems, S().favorites) + paginationHtml(f.page, totalPages);
  }

  function wordTovar(n){
    var n10=n%10, n100=n%100;
    if(n10===1 && n100!==11) return 'товар';
    if(n10>=2 && n10<=4 && (n100<10||n100>=20)) return 'товара';
    return 'товаров';
  }

  function uniq(arr){ var o=[]; arr.forEach(function(v){ if(o.indexOf(v)===-1) o.push(v); }); return o; }

  function paginationHtml(current, total){
    if(total<=1) return '';
    var out = ['<div class="pagination">'];
    for(var i=1;i<=total;i++){
      out.push('<button data-action="cat-page" data-page="'+i+'" class="'+(i===current?'is-active':'')+'">'+i+'</button>');
    }
    out.push('</div>');
    return out.join('');
  }

  /* ---------- PRODUCT DETAIL ---------- */

  var activeTintOverride = null;

  function renderProduct(slug){
    var p = UI.productBySlug(slug);
    if(!p) return render404();
    var cat = D.CATEGORIES.filter(function(c){ return c.slug===p.category; })[0];
    var reviews = D.PRODUCT_REVIEWS[p.id] || [];
    var query = encodeURIComponent('Кофе ОМНИ '+p.region+' '+p.lot);

    return (
      '<section class="section-sm"><div class="wrap">'+
        UI.breadcrumbs([{label:'Каталог',href:'#/catalog'},{label:cat.short,href:'#/catalog/'+cat.slug},{label:p.region+' '+p.lot}])+
        '<div class="pd-grid">'+
          '<div>'+
            '<div class="pd-gallery-main" id="pdGalleryMain">'+UI.bagVisual(p)+'</div>'+
            '<div class="pd-thumbs">'+
              '<div class="bag tint-light is-active" data-action="pd-thumb" data-tint="light"></div>'+
              '<div class="bag tint-dark" data-action="pd-thumb" data-tint="dark"></div>'+
            '</div>'+
          '</div>'+
          '<div>'+
            '<div class="pd-sku eyebrow">SKU '+p.sku+' · '+cat.title+'</div>'+
            '<h1 class="pd-title">'+p.region+' <br>'+p.lot+'</h1>'+
            '<div class="pd-meta">'+UI.starRow(p.rating,p.reviews)+UI.badgesHtml(p.badges,p.inStock)+'</div>'+
            '<div class="pd-price"><span class="amount" id="pdPrice">'+fmtPrice(p.price250)+'</span><span class="weight mono">за 250&nbsp;г</span></div>'+
            '<div class="pd-weight">'+
              '<span class="pd-weight-label">Фасовка</span>'+
              '<div class="radio-pills">'+
                '<label class="radio-pill"><input type="radio" name="pdWeight" value="250" checked data-action="pd-weight" data-price="'+p.price250+'"><span>250 г — '+fmtPrice(p.price250)+'</span></label>'+
                '<label class="radio-pill"><input type="radio" name="pdWeight" value="1000" data-action="pd-weight" data-price="'+p.price1000+'"><span>1 кг — '+fmtPrice(p.price1000)+'</span></label>'+
              '</div>'+
            '</div>'+
            '<div class="pd-actions">'+
              '<div class="qty-stepper" id="pdQty" data-qty="1">'+
                '<button data-action="pd-qty" data-op="dec" type="button">–</button><span>1</span><button data-action="pd-qty" data-op="inc" type="button">+</button>'+
              '</div>'+
              '<button class="btn btn-flame" data-action="pd-add-cart" data-id="'+p.id+'" '+(p.inStock===false?'disabled':'')+'>'+(p.inStock===false?'Нет в наличии':'В корзину '+ICONS.cart)+'</button>'+
              '<button class="btn-icon '+(S().isFav(p.id)?'is-active':'')+'" data-action="toggle-fav" data-id="'+p.id+'" aria-label="В избранное">'+ICONS.heart+'</button>'+
            '</div>'+
            '<div class="pd-market">'+
              '<a class="btn btn-wb" target="_blank" rel="noopener" href="https://www.wildberries.ru/catalog/0/search.aspx?search='+query+'">Купить на Wildberries '+ICONS.arrow+'</a>'+
              '<a class="btn btn-ozon" target="_blank" rel="noopener" href="https://www.ozon.ru/search/?text='+query+'">Купить на OZON '+ICONS.arrow+'</a>'+
            '</div>'+
            '<p class="pd-availability">'+(p.inStock===false ? '<span class="badge badge-out">Нет в наличии</span> Ожидаем новую партию с производства' : '<span class="badge badge-ok">В наличии</span> Отправим в течение 1–2 дней')+'</p>'+
          '</div>'+
        '</div>'+
      '</div></section>'+

      '<section class="section-sm"><div class="wrap">'+
        '<div class="tabs">'+
          '<button class="tab-btn is-active" data-action="pd-tab" data-tab="desc">Описание</button>'+
          '<button class="tab-btn" data-action="pd-tab" data-tab="specs">Характеристики</button>'+
          '<button class="tab-btn" data-action="pd-tab" data-tab="reviews">Отзывы ('+reviews.length+')</button>'+
        '</div>'+
        '<div data-pd-panel="desc" class="prose"><p>'+p.notesLong+'</p></div>'+
        '<div data-pd-panel="specs" style="display:none;" class="pd-specs"><table>'+
          row('Регион', p.country)+row('Высота', p.altitude)+row('Обработка', p.process)+row('Сорт', p.variety)+
          row('Дегустационные ноты', p.notes)+row('Параметры приготовления', p.brew.ratio+', '+p.brew.temp)+row('Параметры воды', 'TDS '+p.water.tds+', pH '+p.water.ph)+
        '</table></div>'+
        '<div data-pd-panel="reviews" style="display:none;">'+
          (reviews.length ? reviews.map(reviewItem).join('') : '<p style="color:var(--ink-soft);">Пока нет отзывов об этом товаре — станьте первым.</p>')+
          '<div class="review-form"><h3 style="font-size:1rem;text-transform:none;font-family:\'IBM Plex Sans\',sans-serif;font-weight:700;margin-bottom:14px;">Оставить отзыв</h3>'+
          '<div class="rate-picker" id="pdRatePicker" data-value="0">'+[1,2,3,4,5].map(function(i){ return '<button type="button" data-action="pd-rate" data-v="'+i+'">'+ICONS.star+'</button>'; }).join('')+'</div>'+
          '<div class="field" style="margin-top:14px;"><textarea placeholder="Расскажите о вкусе, обжарке, впечатлениях…" id="pdReviewText"></textarea></div>'+
          '<button class="btn btn-line" style="margin-top:12px;" data-action="pd-submit-review" data-name="'+p.region+' '+p.lot+'">Отправить отзыв</button>'+
          '</div>'+
        '</div>'+
      '</div></section>'+

      relatedCarousel(p.category, p.id)
    );
  }

  function row(k,v){ return '<tr><td>'+k+'</td><td>'+v+'</td></tr>'; }
  function reviewItem(r){
    return '<div class="review-item"><div class="review-head"><span class="review-author">'+r.author+'</span>'+UI.starRow(r.rating,null,{noCount:true})+'<span class="review-date">'+r.date+'</span></div><p class="review-text">'+r.text+'</p></div>';
  }

  /* ---------- ABOUT ---------- */

  function renderAbout(){
    return (
      pageHero('О компании','История,<br>профессионализм, качество','Кофе ОМНИ — крупнейший обжарщик кофе на Юге России. Производство, обучение и оборудование под одной крышей с 1994 года.',[{label:'О компании'}])+
      '<section class="section"><div class="wrap"><div class="two-col">'+
        '<div class="prose">'+
          '<p>Кофе ОМНИ — это производство, обжарка и доставка свежего кофе, установка и обслуживание кофейного оборудования, а также первая в регионе школа бариста Omni Barista School.</p>'+
          '<p>Наша цель — бережно донести до ценителей кофе всё, что заложено в зерне природой. Учим не тому, что модно, а тому, что вечно — и всегда ставим вкус на первое место.</p>'+
          '<p>Уже больше 20 лет наша команда организует главные чемпионаты бариста страны. Мы знаем, какой вкус нужен каждому гостю кофейни — и как помочь бариста стабильно его повторять.</p>'+
          '<h2>Как всё начиналось</h2>'+
          '<p>В 1994 году небольшая команда энтузиастов начала обжаривать кофе в Краснодаре. За тридцать лет компания выросла в производство полного цикла с собственной школой бариста и мощностью обжарки до 9 тонн в сутки — оставаясь семейным по духу делом.</p>'+
        '</div>'+
        '<div class="quote-card"><div class="stamp">'+ICONS.stamp+'</div><blockquote>Make Coffee.<br>Make Happy.</blockquote><cite>ООО «Кофе ОМНИ» · Краснодар · с 1994</cite></div>'+
      '</div></div></section>'+

      '<section class="section on-stone-deep"><div class="wrap">'+
        '<div class="section-head"><div><span class="eyebrow">Ценности</span><h2>На чём мы стоим</h2></div></div>'+
        '<div class="grid-cards" style="grid-template-columns:repeat(4,1fr);">'+
          valueCard(ICONS.star,'Вкус на первом месте','Никогда не жертвуем вкусом ради моды или дешевизны сырья.')+
          valueCard(ICONS.shield,'Прозрачность','Показываем происхождение, параметры обжарки и дегустационные заметки честно.')+
          valueCard(ICONS.doc,'Обучение','Делимся знаниями через школу бариста и открытые мастер-классы.')+
          valueCard(ICONS.truck,'Ответственность','Работаем на репутацию — от прямых закупок зерна до доставки клиенту.')+
        '</div>'+
      '</div></section>'+

      '<section class="section" id="school-full"><div class="wrap"><div class="school-grid">'+
        '<div class="school-badge"><div class="txt"><svg class="cup" viewBox="0 0 24 24" fill="none"><path d="M4 8h13v6a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" stroke="currentColor" stroke-width="1.4"/><path d="M17 9h1.5a2.5 2.5 0 010 5H17" stroke="currentColor" stroke-width="1.4"/></svg><span class="line1">Omni Barista School</span><span class="line2">Учебный<br>центр</span></div></div>'+
        '<div class="school-copy">'+
          '<span class="eyebrow">Школа бариста</span><h2 style="margin-top:14px;">Omni Barista School</h2>'+
          '<div style="margin-top:22px;"><p>Изначально школа создавалась как лаборатория, где мы искали профиль обжарки для сотен сортов зелёного кофе со всего мира. Сегодня здесь учатся и профессионалы, и те, кто просто влюблён в кофе.</p></div>'+
          '<ul class="prog-list">'+
            '<li>'+ICONS.check+'Базовый курс бариста</li>'+
            '<li>'+ICONS.check+'Каппинг и сенсорика</li>'+
            '<li>'+ICONS.check+'Подготовка к чемпионатам — Кубок Юга, Russian Barista Championship</li>'+
            '<li>'+ICONS.check+'Мастер-классы для кофеен и обжарщиков</li>'+
          '</ul>'+
          '<a class="btn btn-flame" style="margin-top:26px;" href="#/contacts">Записаться на курс '+ICONS.arrow+'</a>'+
        '</div>'+
      '</div></div></section>'+

      '<section class="section on-dark"><div class="wrap">'+
        '<div class="section-head"><div><span class="eyebrow">Вакансии</span><h2>Присоединяйтесь к команде</h2></div><a class="btn btn-line" href="#/careers">Все вакансии '+ICONS.arrow+'</a></div>'+
      '</div></section>'
    );
  }
  function valueCard(ic,t,d){
    return '<div class="info-card"><div>'+ic+'</div><h3>'+t+'</h3><span>'+d+'</span></div>';
  }

  /* ---------- PRODUCTION ---------- */

  function renderProduction(){
    return (
      pageHero('Производство','От зелёного<br>зерна до чашки','Собственный ростер Giesen, лаборатория контроля качества и мощность до 9 тонн обжаренного кофе в сутки.',[{label:'Производство'}])+
      '<section class="section"><div class="wrap">'+
        '<div class="process-row" style="border-color:var(--paper-line);">'+
          stepLight('01','Отбор зерна','Прямые поставки зелёного кофе от партнёров-импортёров, входной контроль влажности и плотности, отбор лотов Q80+ для линейки #ЯБариста.')+
          stepLight('02','Обжарка','Промышленный ростер Giesen позволяет обжаривать до 9 тонн в сутки, при этом каждый профиль подбирается вручную под метод заваривания.')+
          stepLight('03','Каппинг','Каждая партия проходит дегустацию сертифицированными бариста перед отгрузкой — так мы держим вкус стабильным от партии к партии.')+
          stepLight('04','Упаковка','Купажирование и фасовка 250 г и 1 кг в пакеты с клапаном, который сохраняет аромат и выпускает углекислый газ после обжарки.')+
          stepLight('05','Доставка','Собственная логистика по Краснодару и Югу России, отправка транспортными компаниями по всей стране.')+
        '</div>'+
      '</div></section>'+

      '<section class="section on-dark"><div class="wrap">'+
        '<div class="roast-callout">'+
          '<div><div class="big">9<span> тонн</span></div><p>Столько кофе наше производство в Краснодаре способно обжарить за одни сутки</p></div>'+
          '<div><svg class="roast-curve" viewBox="0 0 420 150" fill="none" style="width:100%;">'+
            '<line x1="0" y1="120" x2="420" y2="120" stroke="rgba(239,231,213,.18)" stroke-width="1"/>'+
            '<line x1="0" y1="70" x2="420" y2="70" stroke="rgba(239,231,213,.1)" stroke-width="1" stroke-dasharray="3 5"/>'+
            '<path d="M0 118C60 112 90 92 130 66C170 40 190 22 230 16C270 10 320 20 360 30C385 37 400 40 420 42" stroke="#C4451D" stroke-width="2.5" stroke-linecap="round"/>'+
            '<line x1="230" y1="0" x2="230" y2="132" stroke="#8F6F39" stroke-width="1" stroke-dasharray="2 4"/>'+
            '<circle cx="230" cy="16" r="4" fill="#8F6F39"/>'+
            '<text x="236" y="12" fill="#C7BBA1" font-family="IBM Plex Mono, monospace" font-size="9" letter-spacing="1">FIRST CRACK · 196–205°C</text>'+
            '<text x="4" y="140" fill="#5f574a" font-family="IBM Plex Mono, monospace" font-size="8" letter-spacing="1">ВРЕМЯ ОБЖАРКИ →</text>'+
          '</svg>'+
          '<p style="margin-top:14px;font-size:.8rem;">«Первый крек» — момент, когда зерно начинает трескаться от пара внутри. По нему обжарщик определяет степень обжарки и решает, когда снимать партию с ростера.</p></div>'+
        '</div>'+
      '</div></section>'+

      '<section class="section"><div class="wrap">'+
        '<div class="section-head"><div><span class="eyebrow">Контроль качества</span><h2>Что мы проверяем в каждой партии</h2></div></div>'+
        '<div class="grid-cards" style="grid-template-columns:repeat(4,1fr);">'+
          valueCard(ICONS.doc,'Входной контроль','Влажность, плотность и дефекты зелёного зерна перед закупкой партии.')+
          valueCard(ICONS.clock,'Профиль обжарки','Кривая нагрева и время до первого и второго крека фиксируются для каждой партии.')+
          valueCard(ICONS.star,'Каппинг','Дегустация по протоколу SCA сертифицированными бариста-каперами.')+
          valueCard(ICONS.shield,'Дата обжарки','Указывается на каждой упаковке — никакого залежавшегося зерна.')+
        '</div>'+
      '</div></section>'
    );
  }
  function stepLight(n,t,d){
    return '<div class="p-step"><span class="n" style="background:var(--stone);color:var(--flame);">'+n+'</span><h3>'+t+'</h3><p style="color:var(--ink-soft);">'+d+'</p></div>';
  }

  /* ---------- CONTACTS ---------- */

  function renderContacts(){
    return (
      pageHero('Контакты','Свяжитесь<br>с нами','Ответим на вопросы о розничной покупке, оптовых поставках и школе бариста.',[{label:'Контакты'}])+
      '<section class="section"><div class="wrap">'+
        '<div class="contact-info-grid">'+
          contactTile(ICONS.phone,'Телефон','+7 861 222-94-35')+
          contactTile(ICONS.mail,'Email','brand@omnicoffee.ru')+
          contactTile(ICONS.pin,'Адрес','Краснодар, ул. Красных Партизан, 2/1')+
          contactTile(ICONS.clock,'Часы работы','Пн–Сб: 9:00–19:00, Вс: 10:00–17:00')+
          contactTile(ICONS.box,'Розничный магазин','На той же площадке, что и производство')+
          contactTile(ICONS.doc,'Реквизиты','ООО «Кофе ОМНИ» · <a href="#/page/requisites">подробнее</a>')+
        '</div>'+
        '<div class="map-panel">'+
          '<div class="map-frame"><iframe src="https://yandex.ru/map-widget/v1/?ll=38.902332%2C45.067128&z=16&pt=38.902332,45.067128,pm2rdl" loading="lazy" title="Карта — ул. Красных Партизан, 2/1"></iframe></div>'+
          '<div class="map-cap"><span>ул. Красных Партизан, 2/1 · Краснодар</span><a href="https://yandex.ru/maps/?text=Краснодар%2C%20улица%20Красных%20Партизан%2C%202%2F1" target="_blank" rel="noopener">Открыть в Яндекс Картах '+ICONS.arrow+'</a></div>'+
        '</div>'+
        '<div class="two-col" style="margin-top:56px;">'+
          '<div><h2 style="font-size:1.4rem;margin-bottom:18px;">Напишите нам</h2>'+
            '<form data-form="contact" class="form-grid">'+
              field('Имя','text','name','Как к вам обращаться')+
              field('Телефон','tel','phone','+7 (___) ___-__-__')+
              '<div style="grid-column:1/-1;">'+field('Сообщение','textarea','message','Ваш вопрос')+'</div>'+
              '<div style="grid-column:1/-1;"><button class="btn btn-flame" type="submit">Отправить '+ICONS.arrow+'</button></div>'+
            '</form>'+
          '</div>'+
          '<div><h2 style="font-size:1.4rem;margin-bottom:18px;">Мы в соцсетях</h2>'+
            '<div style="display:flex;gap:10px;">'+
              '<a class="btn-icon" href="#" aria-label="Instagram">'+ICONS.instagram+'</a>'+
              '<a class="btn-icon" href="#" aria-label="Telegram">'+ICONS.telegram+'</a>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></section>'
    );
  }
  function contactTile(ic,t,v){ return '<div class="contact-tile"><div class="ico">'+ic+'</div><h4>'+t+'</h4><p>'+v+'</p></div>'; }
  function field(label,type,name,ph){
    if(type==='textarea') return '<div class="field"><label>'+label+'</label><textarea name="'+name+'" placeholder="'+ph+'"></textarea></div>';
    return '<div class="field"><label>'+label+'</label><input type="'+type+'" name="'+name+'" placeholder="'+ph+'"></div>';
  }

  /* ---------- NEWS ---------- */

  function renderNews(){
    return (
      pageHero('Блог и новости','Что происходит<br>в мире ОМНИ','Чемпионаты, интервью с командой и гиды для бариста и любителей кофе.',[{label:'Блог'}])+
      '<section class="section"><div class="wrap"><div class="news-grid">'+D.NEWS.map(function(n){ return UI.newsCard(n); }).join('')+'</div></div></section>'
    );
  }

  function renderNewsDetail(slug){
    var n = D.NEWS.filter(function(x){ return x.slug===slug; })[0];
    if(!n) return render404();
    return (
      '<section class="section-sm"><div class="wrap">'+
        UI.breadcrumbs([{label:'Блог',href:'#/news'},{label:n.title}])+
        '<div class="article-body">'+
          '<span class="eyebrow">'+n.tag+'</span>'+
          '<h1 style="margin-top:14px;font-size:clamp(1.8rem,3.6vw,2.6rem);">'+n.title+'</h1>'+
          '<div class="article-meta"><span class="mono" style="color:var(--ink-faint);font-size:.8rem;">'+n.date+'</span></div>'+
          '<div class="prose">'+n.body.map(function(p){ return '<p>'+p+'</p>'; }).join('')+'</div>'+
          '<div class="share-row"><span class="mono" style="font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-faint);">Поделиться</span>'+
            '<a class="btn-icon" href="#" aria-label="Telegram">'+ICONS.telegram+'</a>'+
          '</div>'+
        '</div>'+
      '</div></section>'+
      '<section class="section on-stone-deep"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Ещё материалы</span><h2>Читайте также</h2></div></div>'+
        '<div class="news-grid">'+D.NEWS.filter(function(x){ return x.id!==n.id; }).slice(0,4).map(function(x){ return UI.newsCard(x); }).join('')+'</div>'+
      '</div></section>'
    );
  }

  /* ---------- CAREERS ---------- */

  function renderCareers(){
    return (
      pageHero('Вакансии','Присоединяйтесь<br>к команде ОМНИ','Производство, розница, продажи и школа бариста — открыты позиции в Краснодаре.',[{label:'Вакансии'}])+
      '<section class="section"><div class="wrap">'+D.VACANCIES.map(function(v){ return UI.vacancyCard(v); }).join('')+'</div></section>'
    );
  }

  function renderCareerDetail(slug){
    var v = D.VACANCIES.filter(function(x){ return x.slug===slug; })[0];
    if(!v) return render404();
    return (
      '<section class="section-sm"><div class="wrap">'+
        UI.breadcrumbs([{label:'Вакансии',href:'#/careers'},{label:v.title}])+
        '<div class="two-col">'+
          '<div class="article-body">'+
            '<span class="eyebrow">'+v.department+'</span>'+
            '<h1 style="margin-top:14px;font-size:clamp(1.8rem,3.6vw,2.6rem);">'+v.title+'</h1>'+
            '<div class="vac-meta" style="margin-top:14px;font-size:.82rem;">'+
              '<span>'+v.city+'</span><span>·</span><span>'+v.employment+'</span>'+
            '</div>'+
            '<div class="prose" style="margin-top:26px;">'+
              '<p>'+v.short+'</p>'+
              '<h3>Обязанности</h3><ul>'+v.responsibilities.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>'+
              '<h3>Требования</h3><ul>'+v.requirements.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>'+
              '<h3>Условия</h3><ul>'+v.conditions.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>'+
            '</div>'+
          '</div>'+
          '<div class="summary-card" style="position:static;">'+
            '<h3>Отклик на вакансию</h3>'+
            '<div class="summary-row" style="border:none;"><span>Зарплата</span><span style="color:var(--ink);font-weight:700;">'+v.salary+'</span></div>'+
            '<form data-form="vacancy-apply" style="margin-top:14px;display:grid;gap:14px;">'+
              field('Имя','text','name','Ваше имя')+
              field('Телефон','tel','phone','+7 (___) ___-__-__')+
              '<button class="btn btn-flame btn-block" type="submit">Откликнуться '+ICONS.arrow+'</button>'+
            '</form>'+
          '</div>'+
        '</div>'+
      '</div></section>'
    );
  }

  /* ---------- WHOLESALE ---------- */

  function renderWholesale(){
    return (
      pageHero('Оптовым клиентам','Кофе и оборудование<br>для вашей кофейни','Поставки обжаренного кофе, оборудование, сервис и обучение персонала — от одной точки до сети.',[{label:'Оптовым клиентам'}])+
      '<section class="section"><div class="wrap">'+
        '<div class="grid-cards" style="grid-template-columns:repeat(3,1fr);margin-bottom:56px;">'+
          valueCard(ICONS.box,'Кофе под ваше меню','Espresso Bistro и индивидуальные купажи под концепцию заведения.')+
          valueCard(ICONS.shield,'Оборудование и сервис','Подбор, установка, гарантийное и постгарантийное обслуживание кофемашин.')+
          valueCard(ICONS.doc,'Обучение персонала','Курсы и аттестация бариста в Omni Barista School со скидкой для партнёров.')+
        '</div>'+
        '<div class="two-col">'+
          '<div class="prose">'+
            '<h2>Как начать сотрудничество</h2>'+
            '<ul>'+
              '<li>Оставляете заявку — мы перезвоним в течение рабочего дня</li>'+
              '<li>Подбираем купаж и формат поставки под ваш объём и меню</li>'+
              '<li>Присылаем образцы для тестовой дегустации</li>'+
              '<li>Заключаем договор и согласуем график регулярных поставок</li>'+
            '</ul>'+
            '<h2>Условия для партнёров</h2>'+
            '<table><tr><th>Объём в месяц</th><th>Условие</th></tr>'+
              '<tr><td>от 10 кг</td><td>Оптовая цена, доставка по Краснодару бесплатно</td></tr>'+
              '<tr><td>от 30 кг</td><td>Индивидуальный купаж, приоритетная поддержка</td></tr>'+
              '<tr><td>от 100 кг</td><td>Персональный менеджер, обучение бариста в подарок</td></tr>'+
            '</table>'+
          '</div>'+
          '<div class="summary-card" style="position:static;">'+
            '<h3>Заявка для кофеен</h3>'+
            '<form data-form="wholesale" style="display:grid;gap:14px;">'+
              field('Название заведения','text','company','ООО «Кофейня»')+
              field('Контактное лицо','text','name','Имя')+
              field('Телефон','tel','phone','+7 (___) ___-__-__')+
              field('Email','email','email','you@example.com')+
              '<button class="btn btn-flame btn-block" type="submit">Отправить заявку '+ICONS.arrow+'</button>'+
            '</form>'+
          '</div>'+
        '</div>'+
      '</div></section>'
    );
  }

  /* ---------- BUYERS INFO HUB + GENERIC PAGE ---------- */

  function renderBuyersInfo(){
    var cards = [
      {slug:'payment-delivery', ic:ICONS.truck, t:'Оплата и доставка', d:'Способы оплаты и варианты доставки по Краснодару, Югу России и стране.'},
      {slug:'returns', ic:ICONS.box, t:'Возврат и обмен', d:'Условия возврата кофе и оборудования.'},
      {slug:'offer', ic:ICONS.doc, t:'Публичная оферта', d:'Условия продажи товаров через сайт omnicoffee.ru.'},
      {slug:'privacy', ic:ICONS.shield, t:'Политика конфиденциальности', d:'Как мы обрабатываем и храним персональные данные.'},
      {slug:'requisites', ic:ICONS.doc, t:'Реквизиты компании', d:'Юридическая информация об ООО «Кофе ОМНИ».'}
    ];
    return (
      pageHero('Покупателям','Информация<br>для покупателей','Всё, что нужно знать перед заказом: оплата, доставка, возврат и юридическая информация.',[{label:'Покупателям'}])+
      '<section class="section"><div class="wrap"><div class="info-hub-grid">'+
        cards.map(function(c){ return '<a class="info-card" href="#/page/'+c.slug+'">'+c.ic+'<h3>'+c.t+'</h3><span>'+c.d+'</span></a>'; }).join('')+
      '</div></div></section>'+
      '<section class="section on-stone-deep"><div class="wrap">'+
        '<div class="section-head"><div><span class="eyebrow">Частые вопросы</span><h2>FAQ</h2></div></div>'+
        faqItem('Как узнать дату обжарки на пачке?','Дата обжарки указана на клапане упаковки в формате ДД.ММ.ГГ — рядом с наименованием лота и весом.')+
        faqItem('Можно ли забрать заказ самому?','Да, самовывоз доступен по адресу ул. Красных Партизан, 2/1 в день оформления заказа.')+
        faqItem('Работаете ли вы с юридическими лицами?','Да, для кофеен и организаций доступны оптовые условия — подробнее в разделе «Оптовым клиентам».')+
      '</div></section>'
    );
  }
  function faqItem(q,a){
    return '<details class="accordion-item"><summary>'+q+'</summary><div class="a-body">'+a+'</div></details>';
  }

  function renderGenericPage(slug){
    var page = D.PAGES[slug];
    if(!page) return render404();
    return (
      pageHero('Информация', page.title, '', [{label:'Покупателям',href:'#/buyers-info'},{label:page.title}])+
      '<section class="section"><div class="wrap"><div class="prose">'+page.html+'</div></div></section>'
    );
  }

  /* ---------- SEARCH ---------- */

  function renderSearch(q){
    q = (q||'').trim();
    var qLower = q.toLowerCase();
    var products = q ? D.PRODUCTS.filter(function(p){ return (p.region+' '+p.lot+' '+p.country+' '+p.notes).toLowerCase().indexOf(qLower)>-1; }) : [];
    var news = q ? D.NEWS.filter(function(n){ return (n.title+' '+n.excerpt).toLowerCase().indexOf(qLower)>-1; }) : [];
    var hasResults = products.length || news.length;

    return (
      '<section class="result-page-hero"><div class="wrap">'+
        UI.breadcrumbs([{label:'Результаты поиска'}])+
        '<span class="eyebrow">Поиск</span>'+
        '<h1 style="margin-top:12px;font-size:clamp(1.8rem,3.6vw,2.6rem);">По запросу «'+esc(q)+'»</h1>'+
      '</div></section>'+
      '<section class="section">'+'<div class="wrap">'+
        (!q ? UI.emptyState(ICONS.search,'Введите запрос','Воспользуйтесь поиском в шапке сайта, чтобы найти товары и статьи блога.','') :
         !hasResults ? UI.emptyState(ICONS.search,'Ничего не найдено','Проверьте написание или посмотрите весь каталог.', '<a class="btn btn-flame" href="#/catalog">Перейти в каталог</a>') :
        (
          (products.length ? '<div class="section-head"><div><span class="eyebrow">Товары</span><h2>Найдено: '+products.length+'</h2></div></div><div class="grid-cards">'+products.map(function(p){ return UI.productCard(p, S().favorites); }).join('')+'</div>' : '')+
          (news.length ? '<div class="section-head" style="margin-top:56px;"><div><span class="eyebrow">Блог</span><h2>Найдено: '+news.length+'</h2></div></div><div class="news-grid">'+news.map(function(n){ return UI.newsCard(n); }).join('')+'</div>' : '')
        ))+
      '</div></section>'
    );
  }

  /* ---------- 404 ---------- */

  function render404(){
    return (
      '<section class="section"><div class="wrap"><div class="notfound">'+
        '<div class="code">404</div>'+
        '<h2>Страница не найдена</h2>'+
        '<p>Возможно, ссылка устарела или страница была перемещена. Попробуйте начать с главной или заглянуть в каталог.</p>'+
        '<div class="actions">'+
          '<a class="btn btn-flame" href="#/">На главную '+ICONS.arrow+'</a>'+
          '<a class="btn btn-line" href="#/catalog">В каталог</a>'+
        '</div>'+
      '</div></div></section>'
    );
  }

  /* ---------- CART ---------- */

  function renderCart(){
    var lines = S().cartLines();
    if(!lines.length){
      return (
        pageHero('Корзина','Корзина','', [{label:'Корзина'}])+
        '<section class="section"><div class="wrap">'+
          UI.emptyState(ICONS.cart,'В корзине пока пусто','Загляните в каталог — уверены, там найдётся кофе по вкусу.', '<a class="btn btn-flame" href="#/catalog">Перейти в каталог '+ICONS.arrow+'</a>')+
        '</div></section>'
      );
    }
    var subtotal = S().cartTotal();
    var delivery = subtotal >= 2000 ? 0 : 250;
    return (
      pageHero('Корзина','Корзина', lines.length+' '+wordTovar(lines.length)+' в корзине', [{label:'Корзина'}])+
      '<section class="section"><div class="wrap"><div class="cart-layout">'+
        '<div>'+lines.map(cartItemHtml).join('')+
          '<div style="margin-top:20px;"><a class="btn btn-line" href="#/catalog">'+ICONS.arrowLeft+' Продолжить покупки</a></div>'+
        '</div>'+
        '<div class="summary-card">'+
          '<h3>Ваш заказ</h3>'+
          '<div class="summary-row"><span>Товары ('+lines.length+')</span><span>'+fmtPrice(subtotal)+'</span></div>'+
          '<div class="summary-row"><span>Доставка</span><span>'+(delivery? fmtPrice(delivery) : 'Бесплатно')+'</span></div>'+
          '<div class="promo-row"><input type="text" placeholder="Промокод" id="promoInput"><button class="btn btn-line btn-sm" data-action="apply-promo">Применить</button></div>'+
          '<div class="summary-row total"><span>Итого</span><span>'+fmtPrice(subtotal+delivery)+'</span></div>'+
          '<a class="btn btn-flame btn-block" style="margin-top:18px;" href="#/checkout">Оформить заказ '+ICONS.arrow+'</a>'+
        '</div>'+
      '</div></div></section>'
    );
  }

  function cartItemHtml(line){
    var p = line.product;
    return (
      '<div class="cart-item">'+
        UI.bagVisual(p, { size:'bag-mini' })+
        '<div><div class="ci-name">'+p.region+' '+p.lot+'</div><div class="ci-meta">'+line.weight+' г · '+p.notes.slice(0,40)+(p.notes.length>40?'…':'')+'</div></div>'+
        '<div class="qty-stepper" data-cart-qty="'+p.id+'-'+line.weight+'"><button data-action="cart-qty" data-op="dec" data-id="'+p.id+'" data-weight="'+line.weight+'">–</button><span>'+line.qty+'</span><button data-action="cart-qty" data-op="inc" data-id="'+p.id+'" data-weight="'+line.weight+'">+</button></div>'+
        '<div class="ci-price">'+fmtPrice(line.lineTotal)+'</div>'+
        '<button class="ci-remove" data-action="cart-remove" data-id="'+p.id+'" data-weight="'+line.weight+'" aria-label="Удалить">'+ICONS.trash+'</button>'+
      '</div>'
    );
  }

  /* ---------- CHECKOUT ---------- */

  function renderCheckout(){
    var lines = S().cartLines();
    if(!lines.length){
      return (
        pageHero('Оформление заказа','Оформление заказа','', [{label:'Оформление заказа'}])+
        '<section class="section"><div class="wrap">'+
          UI.emptyState(ICONS.cart,'Корзина пуста','Добавьте товары в корзину, чтобы оформить заказ.', '<a class="btn btn-flame" href="#/catalog">В каталог</a>')+
        '</div></section>'
      );
    }
    var subtotal = S().cartTotal();
    var delivery = subtotal >= 2000 ? 0 : 250;
    return (
      pageHero('Оформление заказа','Оформление заказа','', [{label:'Корзина',href:'#/cart'},{label:'Оформление заказа'}])+
      '<section class="section"><div class="wrap">'+
        '<div class="stepper" id="checkoutStepper">'+
          stepper(1,'Контакты',true,false)+stepper(2,'Доставка',false,false)+stepper(3,'Оплата',false,false)+stepper(4,'Подтверждение',false,false)+
        '</div>'+
        '<div class="checkout-layout">'+
          '<div>'+
            '<div class="checkout-panel is-active" data-step="1">'+
              '<div class="form-grid">'+field('Имя','text','name','Как к вам обращаться')+field('Телефон','tel','phone','+7 (___) ___-__-__')+
              '<div style="grid-column:1/-1;">'+field('Email','email','email','you@example.com')+'</div></div>'+
              '<div class="checkout-nav"><span></span><button class="btn btn-flame" data-action="checkout-next">Далее '+ICONS.arrow+'</button></div>'+
            '</div>'+
            '<div class="checkout-panel" data-step="2">'+
              '<div class="radio-pills" style="margin-bottom:20px;">'+
                '<label class="radio-pill"><input type="radio" name="delivery" value="courier" checked><span>Курьером</span></label>'+
                '<label class="radio-pill"><input type="radio" name="delivery" value="pickup"><span>Самовывоз</span></label>'+
                '<label class="radio-pill"><input type="radio" name="delivery" value="post"><span>Транспортной компанией</span></label>'+
              '</div>'+
              '<div class="form-grid"><div style="grid-column:1/-1;">'+field('Адрес доставки','text','address','Город, улица, дом, квартира')+'</div>'+field('Комментарий к заказу','text','comment','Необязательно')+'</div>'+
              '<div class="checkout-nav"><button class="btn btn-line" data-action="checkout-prev">'+ICONS.arrowLeft+' Назад</button><button class="btn btn-flame" data-action="checkout-next">Далее '+ICONS.arrow+'</button></div>'+
            '</div>'+
            '<div class="checkout-panel" data-step="3">'+
              '<div class="radio-pills">'+
                '<label class="radio-pill"><input type="radio" name="payment" value="card" checked><span>Картой онлайн</span></label>'+
                '<label class="radio-pill"><input type="radio" name="payment" value="cash"><span>При получении</span></label>'+
              '</div>'+
              '<div class="checkout-nav"><button class="btn btn-line" data-action="checkout-prev">'+ICONS.arrowLeft+' Назад</button><button class="btn btn-flame" data-action="checkout-next">Далее '+ICONS.arrow+'</button></div>'+
            '</div>'+
            '<div class="checkout-panel" data-step="4">'+
              '<div class="prose"><h2>Проверьте заказ</h2></div>'+
              lines.map(function(l){ return '<div class="mini-line"><span>'+l.product.region+' '+l.product.lot+' · '+l.weight+' г × '+l.qty+'</span><span>'+fmtPrice(l.lineTotal)+'</span></div>'; }).join('')+
              '<div class="checkout-nav"><button class="btn btn-line" data-action="checkout-prev">'+ICONS.arrowLeft+' Назад</button><button class="btn btn-flame" data-action="place-order">Подтвердить заказ '+ICONS.check+'</button></div>'+
            '</div>'+
          '</div>'+
          '<div class="summary-card">'+
            '<h3>Ваш заказ</h3>'+
            lines.map(function(l){ return '<div class="mini-line"><span>'+l.product.region+' '+l.product.lot+' · '+l.weight+' г × '+l.qty+'</span><span>'+fmtPrice(l.lineTotal)+'</span></div>'; }).join('')+
            '<div class="summary-row" style="margin-top:14px;"><span>Доставка</span><span>'+(delivery?fmtPrice(delivery):'Бесплатно')+'</span></div>'+
            '<div class="summary-row total"><span>Итого</span><span>'+fmtPrice(subtotal+delivery)+'</span></div>'+
          '</div>'+
        '</div>'+
      '</div></section>'
    );
  }
  function stepper(n,label,active,done){
    return '<div class="step '+(active?'is-active':'')+' '+(done?'is-done':'')+'" data-step-i="'+n+'"><span class="num">'+n+'</span><span class="lbl">'+label+'</span></div>';
  }

  /* ---------- LOGIN ---------- */

  function renderLogin(){
    return (
      '<section class="section" style="padding-top:60px;"><div class="wrap" style="max-width:460px;">'+
        '<div style="text-align:center;margin-bottom:8px;"><span class="eyebrow">Вход</span></div>'+
        '<h1 style="text-align:center;margin-top:12px;font-size:2rem;">Личный кабинет</h1>'+
        '<div id="loginStepPhone" style="margin-top:34px;">'+
          '<p style="text-align:center;color:var(--ink-soft);margin-bottom:22px;">Введите номер телефона — пришлём код для входа</p>'+
          '<div class="field"><label>Телефон</label><input type="tel" id="loginPhone" placeholder="+7 (___) ___-__-__"></div>'+
          '<div class="radio-pills" style="margin-top:16px;justify-content:center;">'+
            '<label class="radio-pill"><input type="radio" name="otpChannel" value="sms" checked><span>Код в SMS</span></label>'+
            '<label class="radio-pill"><input type="radio" name="otpChannel" value="telegram"><span>Код в Telegram</span></label>'+
          '</div>'+
          '<button class="btn btn-flame btn-block" style="margin-top:22px;" data-action="login-send-code">Получить код '+ICONS.arrow+'</button>'+
        '</div>'+
        '<div id="loginStepCode" style="display:none;margin-top:34px;">'+
          '<p style="text-align:center;color:var(--ink-soft);margin-bottom:22px;" id="loginCodeHint">Код отправлен на номер</p>'+
          '<div class="otp-row" style="justify-content:center;">'+
            [0,1,2,3].map(function(i){ return '<input type="text" inputmode="numeric" maxlength="1" data-otp-i="'+i+'">'; }).join('')+
          '</div>'+
          '<p class="hint" style="text-align:center;margin-top:14px;">Демо: подойдёт любой 4-значный код</p>'+
          '<button class="btn btn-flame btn-block" style="margin-top:18px;" data-action="login-confirm-code">Войти '+ICONS.arrow+'</button>'+
          '<button class="btn btn-ghost btn-block" style="margin-top:8px;" data-action="login-resend">Отправить код ещё раз</button>'+
        '</div>'+
      '</div></section>'
    );
  }

  /* ---------- ACCOUNT ---------- */

  function accountLayout(active, inner){
    var auth = S().auth;
    var initials = (auth.name||'Гость').split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();
    var nav = [
      {key:'profile', href:'#/account', label:'Личные данные', ic:ICONS.user},
      {key:'orders', href:'#/account/orders', label:'Мои заказы', ic:ICONS.box},
      {key:'favorites', href:'#/account/favorites', label:'Избранное', ic:ICONS.heart},
      {key:'reviews', href:'#/account/reviews', label:'Отзывы', ic:ICONS.star}
    ];
    return (
      pageHero('Личный кабинет', 'Личный кабинет','',[{label:'Личный кабинет'}])+
      '<section class="section"><div class="wrap"><div class="account-layout">'+
        '<aside>'+
          '<div class="account-nav">'+
            '<div class="account-user"><span class="av">'+initials+'</span><div><strong>'+(auth.name||'Гость')+'</strong><span>'+(auth.phone||'')+'</span></div></div>'+
            nav.map(function(it){ return '<a class="'+(it.key===active?'is-active':'')+'" href="'+it.href+'">'+it.ic+' '+it.label+'</a>'; }).join('')+
            '<a href="#/" data-action="logout">'+ICONS.close+' Выйти</a>'+
          '</div>'+
        '</aside>'+
        '<div>'+inner+'</div>'+
      '</div></div></section>'
    );
  }

  function renderAccountProfile(){
    var auth = S().auth;
    return accountLayout('profile',
      '<h2 style="font-size:1.3rem;margin-bottom:22px;">Личные данные</h2>'+
      '<form data-form="profile" class="form-grid">'+
        field('Имя и фамилия','text','name', auth.name||'')+
        '<div class="field"><label>Телефон</label><input type="tel" value="'+(auth.phone||'')+'" disabled></div>'+
        field('Email','email','email','you@example.com')+
        field('Дата рождения','date','birthday','')+
        '<div style="grid-column:1/-1;"><button class="btn btn-flame" type="submit">Сохранить изменения '+ICONS.check+'</button></div>'+
      '</form>'
    );
  }

  function renderAccountOrders(){
    var orders = D.ORDERS;
    if(!orders.length){
      return accountLayout('orders', UI.emptyState(ICONS.box,'Заказов пока нет','Оформите первый заказ в каталоге.', '<a class="btn btn-flame" href="#/catalog">В каталог</a>'));
    }
    return accountLayout('orders',
      '<h2 style="font-size:1.3rem;margin-bottom:22px;">Мои заказы</h2>'+
      orders.map(orderCard).join('')
    );
  }

  function orderCard(o){
    var meta = UI.statusMeta(o.status);
    return (
      '<a class="order-card" href="#/account/orders/'+o.id+'" style="display:block;">'+
        '<div class="oc-top"><span class="oc-num">Заказ '+o.number+' · '+o.date+'</span><span class="badge '+meta.cls+'">'+meta.label+'</span></div>'+
        '<div class="oc-items">'+o.items.map(function(it){ var p=UI.productById(it.productId); return p?UI.bagVisual(p, { size:'bag-mini' }):''; }).join('')+'</div>'+
        '<div class="oc-bottom"><span class="mono" style="font-size:.8rem;color:var(--ink-faint);">'+o.items.length+' '+wordTovar(o.items.length)+'</span><span class="oc-total">'+fmtPrice(o.total)+'</span></div>'+
      '</a>'
    );
  }

  function renderAccountOrderDetail(id){
    var o = D.ORDERS.filter(function(x){ return x.id===Number(id); })[0];
    if(!o) return render404();
    return accountLayout('orders',
      UI.breadcrumbs([{label:'Личный кабинет',href:'#/account'},{label:'Заказы',href:'#/account/orders'},{label:o.number}])+
      '<h2 style="font-size:1.3rem;margin:14px 0 4px;">Заказ '+o.number+'</h2>'+
      '<p class="mono" style="font-size:.82rem;color:var(--ink-faint);margin-bottom:10px;">от '+o.date+'</p>'+
      UI.statusTrack(o.status)+
      o.items.map(function(it){
        var p = UI.productById(it.productId);
        if(!p) return '';
        return '<div class="cart-item" style="grid-template-columns:64px 1fr auto;">'+UI.bagVisual(p, { size:'bag-mini' })+'<div><div class="ci-name">'+p.region+' '+p.lot+'</div><div class="ci-meta">'+it.weight+' г × '+it.qty+'</div></div><div class="ci-price">'+fmtPrice((it.weight==='1000'?p.price1000:p.price250)*it.qty)+'</div></div>';
      }).join('')+
      '<div class="summary-row" style="margin-top:18px;"><span>Адрес доставки</span><span>'+o.address+'</span></div>'+
      '<div class="summary-row"><span>Оплата</span><span>'+o.payment+'</span></div>'+
      '<div class="summary-row total"><span>Итого</span><span>'+fmtPrice(o.total)+'</span></div>'
    );
  }

  function renderAccountFavorites(){
    var ids = S().favorites;
    var list = D.PRODUCTS.filter(function(p){ return ids.indexOf(p.id)>-1; });
    if(!list.length){
      return accountLayout('favorites', UI.emptyState(ICONS.heart,'В избранном пусто','Отмечайте понравившиеся лоты сердечком в каталоге.', '<a class="btn btn-flame" href="#/catalog">В каталог</a>'));
    }
    return accountLayout('favorites', '<h2 style="font-size:1.3rem;margin-bottom:22px;">Избранное</h2>'+productGrid(list, ids));
  }

  function renderAccountReviews(){
    var list = D.MY_REVIEWS;
    if(!list.length){
      return accountLayout('reviews', UI.emptyState(ICONS.star,'Отзывов пока нет','Оставьте отзыв о товаре или о компании после покупки.', ''));
    }
    return accountLayout('reviews',
      '<h2 style="font-size:1.3rem;margin-bottom:22px;">Мои отзывы</h2>'+
      list.map(function(r){
        return '<div class="review-item"><div class="review-head"><span class="review-author">'+(r.type==='product'?r.targetName:'О компании «'+r.targetName+'»')+'</span>'+UI.starRow(r.rating,null,{noCount:true})+'<span class="review-date">'+r.date+'</span></div><p class="review-text">'+r.text+'</p></div>';
      }).join('')
    );
  }

  return {
    renderHome:renderHome, renderCatalog:renderCatalog, refreshCatalogResults:refreshCatalogResults,
    catalogFilterState:function(){ return catalogFilterState; },
    renderProduct:renderProduct, renderAbout:renderAbout, renderProduction:renderProduction, renderContacts:renderContacts,
    renderNews:renderNews, renderNewsDetail:renderNewsDetail, renderCareers:renderCareers, renderCareerDetail:renderCareerDetail,
    renderWholesale:renderWholesale, renderBuyersInfo:renderBuyersInfo, renderGenericPage:renderGenericPage,
    renderSearch:renderSearch, render404:render404, renderCart:renderCart, renderCheckout:renderCheckout, renderLogin:renderLogin,
    renderAccountProfile:renderAccountProfile, renderAccountOrders:renderAccountOrders, renderAccountOrderDetail:renderAccountOrderDetail,
    renderAccountFavorites:renderAccountFavorites, renderAccountReviews:renderAccountReviews
  };
})();
