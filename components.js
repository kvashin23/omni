/* =========================================================================
   OMNI COFFEE — shared UI components (pure functions returning HTML strings)
   ========================================================================= */
window.OMNI_UI = (function(){
  var D = window.OMNI_DATA;

  var ICONS = {
    cart:'<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="18" cy="20" r="1.4" fill="currentColor"/><path d="M2.5 3h2.4l2 12.2a2 2 0 002 1.7h8.4a2 2 0 002-1.65L20.5 8H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-7.6-4.6-10-9.3C.4 7.8 2.3 4.5 5.8 4c2.1-.3 4.1.8 6.2 3 2.1-2.2 4.1-3.3 6.2-3 3.5.5 5.4 3.8 3.8 7.2-2.4 4.7-10 9.3-10 9.3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.6" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 20c1.4-3.8 4.4-5.8 7.5-5.8s6.1 2 7.5 5.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-4.3-4.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    chevron:'<svg class="caret" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowLeft:'<svg viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5L12 16.9l-5.9 3.3 1.3-6.5L2.5 9.2l6.6-.7z"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trash:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-9 0l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.3 7-11.5A7 7 0 105 9.5C5 14.7 12 21 12 21z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="9.5" r="2.4" stroke="currentColor" stroke-width="1.5"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 5c0 8.3 6.7 15 15 15l2-3.6-5-2.2-1.6 2A12 12 0 018.8 9.6l2-1.6-2.2-5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M4 6.5l8 6 8-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3.2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    truck:'<svg viewBox="0 0 24 24" fill="none"><path d="M2 6h11v10H2zM13 10h4l4 3v3h-8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="1.6" stroke="currentColor" stroke-width="1.4"/><circle cx="17.5" cy="18" r="1.6" stroke="currentColor" stroke-width="1.4"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 5-3 8.5-7 9-4-.5-7-4-7-9V6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h9l4 4v14H6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 12h6M9 16h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    box:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 8l9-5 9 5-9 5-9-5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 8v9l9 5 9-5V8M12 13v9" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    circleX:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M9.5 9.5l5 5m0-5l-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    instagram:'<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/></svg>',
    telegram:'<svg viewBox="0 0 24 24" fill="none"><path d="M21 4L3 11.5l6 2 2 6 3-4 4.5 3.3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    stamp:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><path d="M12 7v5l3.2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    brewEspresso:'<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="9" width="16" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 9V6a1 1 0 011-1h6a1 1 0 011 1v3" stroke="currentColor" stroke-width="1.5"/><path d="M9 19v2h6v-2" stroke="currentColor" stroke-width="1.5"/><path d="M12 12v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    brewTurka:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 10h9l3.2 2v1.6L15 15.6H6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6.5 10a3 3 0 013-3H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 15.6V19h5v-3.4" stroke="currentColor" stroke-width="1.5"/></svg>',
    brewGeyser:'<svg viewBox="0 0 24 24" fill="none"><path d="M8 21l1-6h6l1 6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 15l1.4-8h3.2L15 15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 3h4l-.6 4h-2.8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'
  };

  function esc(s){ return String(s==null?'':s); }

  function fmtPrice(n){
    if(n==null) return '—';
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ') + ' ₽';
  }

  function starRow(rating, count, opts){
    opts = opts || {};
    var full = Math.round(rating);
    var stars = '';
    for(var i=1;i<=5;i++){ stars += '<span class="'+(i<=full?'':'is-off')+'">'+ICONS.star+'</span>'; }
    var countHtml = (count!=null) ? '<span class="count">'+rating.toFixed(1)+' · '+count+' '+wordReview(count)+'</span>' : '<span class="count">'+rating.toFixed(1)+'</span>';
    return '<span class="star-row"><span class="stars">'+stars+'</span>'+(opts.noCount?'':countHtml)+'</span>';
  }
  function wordReview(n){
    var n10=n%10, n100=n%100;
    if(n10===1 && n100!==11) return 'отзыв';
    if(n10>=2 && n10<=4 && (n100<10||n100>=20)) return 'отзыва';
    return 'отзывов';
  }

  function badgesHtml(list, inStock){
    var out = [];
    (list||[]).forEach(function(b){
      if(b==='new') out.push('<span class="badge badge-new">Новинка</span>');
      if(b==='hit') out.push('<span class="badge badge-hit">Хит</span>');
    });
    if(inStock===false) out.push('<span class="badge badge-out">Нет в наличии</span>');
    return out.join(' ');
  }

  function bagVisual(p, opts){
    opts = opts || {};
    var size = opts.size || '';
    return '<div class="bag tint-'+p.tint+' '+size+'">'+
      '<span class="spec">'+esc(p.country)+(p.altitude&&p.altitude!=='—' ? ' · '+p.altitude : '')+'</span>'+
      '<span class="region">'+esc(p.region)+'<br>'+esc(p.lot)+'</span>'+
      '<span class="stamp">'+ICONS.stamp+'</span>'+
    '</div>';
  }

  function productCard(p, favIds){
    var isFav = (favIds||[]).indexOf(p.id) > -1;
    var badges = badgesHtml(p.badges, p.inStock);
    return (
      '<div class="p-card" data-product-card="'+p.id+'">'+
        '<button class="fav-btn '+(isFav?'is-active':'')+'" data-action="toggle-fav" data-id="'+p.id+'" aria-label="В избранное">'+ICONS.heart+'</button>'+
        '<a class="bag-link" href="#/product/'+p.slug+'">'+bagVisual(p)+'</a>'+
        (badges ? '<div class="card-badges">'+badges+'</div>' : '')+
        '<p class="notes">'+esc(p.notes)+'</p>'+
        '<div class="rating-row">'+starRow(p.rating, p.reviews)+'</div>'+
        '<div class="price-row">'+
          '<span class="price">'+fmtPrice(p.price250)+' <span class="weight">/ 250 г</span></span>'+
        '</div>'+
        '<div class="cart-row">'+
          '<button class="btn btn-flame" data-action="add-to-cart" data-id="'+p.id+'" data-weight="250" '+(p.inStock===false?'disabled':'')+'>'+
            (p.inStock===false ? 'Нет в наличии' : ('В корзину '+ICONS.cart))+
          '</button>'+
        '</div>'+
      '</div>'
    );
  }

  function newsCard(n){
    return (
      '<a class="news-card" href="#/news/'+n.slug+'">'+
        '<span class="news-tag">'+esc(n.tag)+'</span>'+
        '<h3>'+esc(n.title)+'</h3>'+
        '<span class="n-date mono">'+esc(n.date)+'</span>'+
        '<span class="rd">Читать '+ICONS.arrow+'</span>'+
      '</a>'
    );
  }

  function vacancyCard(v){
    return (
      '<a class="vac-card" href="#/careers/'+v.slug+'">'+
        '<div>'+
          '<h3>'+esc(v.title)+'</h3>'+
          '<div class="vac-meta">'+
            '<span>'+esc(v.department)+'</span><span>·</span><span>'+esc(v.city)+'</span><span>·</span><span>'+esc(v.employment)+'</span>'+
          '</div>'+
        '</div>'+
        '<div class="vac-salary">'+esc(v.salary)+'</div>'+
      '</a>'
    );
  }

  function breadcrumbs(items){
    var out = ['<a href="#/">Главная</a>'];
    items.forEach(function(it){
      out.push('<span class="sep">/</span>');
      if(it.href) out.push('<a href="'+it.href+'">'+esc(it.label)+'</a>');
      else out.push('<span>'+esc(it.label)+'</span>');
    });
    return '<div class="crumbs">'+out.join(' ')+'</div>';
  }

  function emptyState(icon, title, text, ctaHtml){
    return (
      '<div class="empty-state">'+
        '<div class="ico">'+icon+'</div>'+
        '<h3>'+esc(title)+'</h3>'+
        '<p>'+esc(text)+'</p>'+
        (ctaHtml||'')+
      '</div>'
    );
  }

  function statusMeta(status){
    var map = {
      processing:{ label:'В обработке', cls:'badge-warn' },
      shipping:{ label:'Доставляется', cls:'badge-ok' },
      delivered:{ label:'Доставлен', cls:'badge-ok' },
      cancelled:{ label:'Отменён', cls:'badge-bad' }
    };
    return map[status] || { label:status, cls:'' };
  }

  function statusTrack(status){
    var steps = ['processing','shipping','delivered'];
    var labels = { processing:'Оформлен', shipping:'В доставке', delivered:'Доставлен' };
    if(status==='cancelled'){
      return '<div class="status-track"><div class="st is-done"><div class="dot">'+ICONS.circleX+'</div><div class="lbl">Заказ отменён</div></div></div>';
    }
    var idx = steps.indexOf(status);
    return '<div class="status-track">'+steps.map(function(s,i){
      var done = i<=idx;
      return '<div class="st '+(done?'is-done':'')+'"><div class="dot">'+(done?ICONS.check:'')+'</div><div class="lbl">'+labels[s]+'</div></div>';
    }).join('')+'</div>';
  }

  function productById(id){ return D.PRODUCTS.filter(function(p){ return p.id===Number(id); })[0]; }
  function productBySlug(slug){ return D.PRODUCTS.filter(function(p){ return p.slug===slug; })[0]; }

  return {
    ICONS:ICONS, esc:esc, fmtPrice:fmtPrice, starRow:starRow, badgesHtml:badgesHtml, bagVisual:bagVisual,
    productCard:productCard, newsCard:newsCard, vacancyCard:vacancyCard, breadcrumbs:breadcrumbs,
    emptyState:emptyState, statusMeta:statusMeta, statusTrack:statusTrack,
    productById:productById, productBySlug:productBySlug
  };
})();
