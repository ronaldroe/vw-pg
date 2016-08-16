function PageSetup(){
    var _this = this;
    var qs = window.location.search.substring(1);
    var login_data, db;
    
    // Init page - PRIVATE
    this.init = function(input_data){
        
        // Size page buttons
        window.setTimeout(function(){
            _this.size_blocks(get_viewport());
        }, 1000);
        
        // Get and parse units JSON file
        $.get('../units.json', function(data){
            
            db = typeof data != 'object' ? JSON.parse(data) : data;
            
            login_data = typeof input_data == 'object' ? match_login(input_data, db) : _this.find_login(data, db);
            
            if(login_data){
                _this.log_in(login_data);
            } else {
                if(typeof input_data != 'undefined'){
                    $('h2.message').text('Password incorrect');
                }
            }
            
        });
        
    }
    
    // Parse query string, return as object - PUBLIC
    this.parse_query_string = function(){
        var a;
        a = qs.length > 0 ? qs.split('&') : '';
        if(a.length > 0){
            // We have a query string, parse it
            var b = {};
            for(var i = 0; i < a.length; i++){
                var c = a[i].split('=');
                var d = c[0];
                var e = c[1].replace(/%20/g, ' ');
                b[d] = e;
            }
            
            return b;
            
        } else {
            // If there's no query string, return false
            return false;
        }
    }
    
    // Determine which login type - PUBLIC
    this.find_login = function(data, db){
        
        if(_this.parse_query_string()){
            
            return match_login(_this.parse_query_string(), db);
            
        } else {
            // If no query string, check for existing login and return its details
            if(localStorage.getItem('logged_in') == 'true'){
                
                var ls_data = {
                    unit: localStorage.getItem('unit_name'),
                    pass: localStorage.getItem('unit_pass')
                };
                
                if(match_login(ls_data, db)){
                    return match_login(ls_data, db);
                } else {
                    return false;
                }
                
            } else {
                // There's no query string or existing login, so show the login form.
                _this.show_login(db);
                return false;
            }
        }
    }
    
    // Match credentials to unit - PRIVATE
    function match_login(data, db){
        for(var i = 0; i < db.units.length; i++){
            if(data.unit == db.units[i].unit_name && data.pass == db.units[i].unit_pass){
                return db.units[i];
            }
        }
        $('h2.message').text('Password incorrect');
        return false;
    }
    
    // Display login form - PUBLIC
    this.show_login = function(db){
        
        var form_select = document.querySelector('section.login form select');
        
        for(var i = 0; i < db.units.length; i++){
            var option_item = document.createElement('option');
            option_item.setAttribute('value', db.units[i].unit_name);
            option_item.innerText = db.units[i].unit_name;
            form_select.appendChild(option_item);
        }
        
        var form_section = document.querySelector('section.login');
        form_section.style.display = "block";
        
        document.body.classList.add('show_login');
    }
    
    // Size page blocks - PUBLIC
    this.size_blocks = function(viewport){
        
        var block_full = {
            w: (viewport.w - 40),
            h: Math.floor(((viewport.h - 130) / 2) - 30)
        };
        var block_half = {
            w: Math.floor((block_full.w / 2) - 10),
            h: Math.floor((block_full.h / 2))
        };
        var block_small = {
            w: Math.floor((block_full.w / 3) - 13.33),
            h: Math.floor((block_full.w / 3) - 13.33)
        };
        
        $('.button:not(.half, .small)').css({
            'height': block_full.h + 'px',
            'width': block_full.w + 'px',
            'line-height': block_full.h + 'px',
            'left': '20px',
            'margin-top': '20px'
        });
        
        $('.half').css({
            'height': block_full.h + 'px',
            'width': block_half.w + 'px',
            'line-height': block_full.h + 'px',
            'margin-left': '20px',
            'margin-top': '20px'
        });
        
        $('.small').css({
            'height': block_small.h + 'px',
            'width': block_small.w + 'px',
            'line-height': block_small.h + 'px',
            'margin-left': '16.33%',
            'margin-bottom': '20px'
        });
        
        $('nav').css({'min-height': (viewport.h - 170) + 'px'})
        
        $('.button:not(.custom)').fitText(0.5);
        $('.button.custom').fitText();
        
    }
    
    // Log in to unit - PUBLIC
    this.log_in = function(data){
        
        // TODO: Log in
        localStorage.setItem('unit_name', data.unit_name);
        localStorage.setItem('unit_shirt_num', data.unit_shirt_num);
        localStorage.setItem('unit_chaplain_num', data.unit_chaplain_num);
        localStorage.setItem('unit_pass', data.unit_pass);
        localStorage.setItem('logo', data.logo);

        
        localStorage.setItem('base_name', data.unit_base.base_name);
        localStorage.setItem('base_aadd_num', data.unit_base.base_aadd_num);
        localStorage.setItem('base_afrc_num', data.unit_base.base_afrc_num);
        localStorage.setItem('base_sapr_num', data.unit_base.base_sapr_num);
        localStorage.setItem('base_cab_num', data.unit_base.base_cab_num);
        
        localStorage.setItem('logged_in', 'true');
        
        set_up_base_blocks(data);
        set_up_unit_blocks(data);
        
        // return true;
    }
    
    // Add numbers to unit-specific blocks - PRIVATE
    function set_up_unit_blocks(data){
        var shirt = data ? data.unit_shirt_num : localStorage.getItem('unit_shirt_num');
        var logo = data ? data.logo : localStorage.getItem('logo');
        var chaplain = data ? data.unit_chaplain_num : localStorage.getItem('unit_chaplain_num');
        $('.shirt a').prop('href', 'tel:' + shirt);
        $('.chaplain a').prop('href', 'tel:' + chaplain);
        $('img.logo').attr('src', 'images/' + logo);
        $('h1').html(data ? data.unit_name : localStorage.setItem('unit_name'));
        
        init_custom();
    }
    
    // Add numbers to base-specific blocks - PRIVATE
    function set_up_base_blocks(data){
        
        var aadd = !data ? localStorage.getItem('base_aadd_num') : data.unit_base.base_aadd_num;
        var sapr = !data ? localStorage.getItem('base_sapr_num') : data.unit_base.base_sapr_num;
        var afrc = !data ? localStorage.getItem('base_afrc_num') : data.unit_base.base_afrc_num;
        var cab = !data ? localStorage.getItem('base_cab_num') : data.unit_base.base_cab_num;
        
        $('.aadd a').prop('href', 'tel:' + aadd);
        $('.sapr a').prop('href', 'tel:' + sapr);
        $('.afrc a').prop('href', 'tel:' + afrc);
        $('.cab a').prop('href', 'tel:' + cab);
    }
    
    // Check for and add custom numbers - PRIVATE - Make public?
    function init_custom(){
        
        if(localStorage.getItem('custom_1_name') && localStorage.getItem('custom_1_num')){
            $('.custom.one').addClass('show').children('a').prop('href', 'tel:' + localStorage.getItem('custom_1_num')).html(localStorage.getItem('custom_1_name'));
            $('.aadd').addClass('half');
            $('input.custom_1_name').val(localStorage.getItem('custom_1_name'));
            $('input.custom_1_num').val(localStorage.getItem('custom_1_num'));
        }
        if(localStorage.getItem('custom_2_name') && localStorage.getItem('custom_2_num')){
            $('.custom.two').addClass('show').children('a').prop('href', 'tel:' + localStorage.getItem('custom_2_num')).html(localStorage.getItem('custom_2_name'));
            $('.cab').addClass('half');
            $('input.custom_2_name').val(localStorage.getItem('custom_2_name'));
            $('input.custom_2_num').val(localStorage.getItem('custom_2_num'));
        }
        
    }
    
    
    this.init();
    
}

var page; // Define as global to aid debugging.

window.onload = function(){
    
    // Instantiate new PageSetup object
    page = new PageSetup();
    
    // DOM manipulators
    $('.opener').click(function(){
        open_drawer();
    });
    $('.logout').click(function() {
        log_out();
    });
    $('.menu_button').click(function(){
        open_menu();
    });
    $('header h1').fitText();
    
   /* $('.submit').click(function(evt){
        evt.preventDefault();
        page.init({unit: document.forms[2][0].value, pass: document.forms[2][1].value});
        localStorage.getItem('logged_in') == 'true' ? location.reload() : null;
    });*/
    $('section.login form').submit(function(evt){
        evt.preventDefault();
        page.init({unit: document.forms[2][0].value, pass: document.forms[2][1].value});
        localStorage.getItem('logged_in') == 'true' ? location.reload() : null;
        
        var form_section = document.querySelector('section.login');
        form_section.style.display = "none";
        
        document.body.classList.remove('show_login')
    });
    
}





function open_drawer(){
    
    var is_open = $('.drawer').hasClass('open');
    
    if(is_open){
        $('.drawer').removeClass('open');
        $('.opener').html("&#9650;")
    } else {
        $('.drawer').addClass('open');
        $('.opener').html("&#9660;")
    }
    
}

function get_viewport(){
    var viewport = {
        w: $(window).outerWidth(true),
        h: $(window).outerHeight(true)
    }
    
    return viewport;
}

function open_menu(){
    $('nav').toggleClass('open');
}

function log_out(){
    localStorage.removeItem('base_aadd_num');
    localStorage.removeItem('base_afrc_num');
    localStorage.removeItem('base_cab_num');
    localStorage.removeItem('base_sapr_num');
    localStorage.removeItem('logged_in');
    localStorage.removeItem('logo');
    localStorage.removeItem('base_name');
    localStorage.removeItem('unit_chaplain_num');
    localStorage.removeItem('unit_name');
    localStorage.removeItem('unit_pass');
    localStorage.removeItem('unit_shirt_num');
    
    location.reload();
}

// Save custom wingman
function save_custom(n){
    event.preventDefault();
    localStorage.setItem('custom_' + n + '_name', $('input.custom_' + n + '_name').val());
    localStorage.setItem('custom_' + n + '_num', $('input.custom_' + n + '_num').val());
    location.reload();
}

// Delete custom wingman
function del_custom(n){
    event.preventDefault();
    localStorage.removeItem('custom_' + n + '_name');
    localStorage.removeItem('custom_' + n + '_num');
    location.reload();
}

