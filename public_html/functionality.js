/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var test = function(){
   
   console.log("test in functionality.js");
   
};

var main = function(){
    
  
    
    $ds = $('.announcements-slideshow div');
    $ds2 = $('.slider-dots li');
    
    $ds.hide().eq(0).show();
    
    var swipeSlideLeft = false;
    var swipeSlideRight = false;
    

    
    /*$ds.on("swipeleft", function(){
        swipeSlideLeft = true;
    });
    

    $ds.on("swiperight", function(){
        swipeSlideRight = true;
    }); */    
    
    $ds.on("swipeleft", function(){
        swipeLeft();
    });

    $ds.on("swiperight", function(){
        swipeRight();
    }); 
        
    var swipeLeft = function(){
        $ds.filter(':visible').fadeOut(function(){
            var $div = $(this).next('div');
            
            var currentDot = $('.active-dot');
            var nextDot = currentDot.next();
            
            if ( $div.length === 0 ) {
                $ds.eq(0).fadeIn();
                nextDot = $('.dot').first();
                currentDot.removeClass('active-dot');
                nextDot.addClass('active-dot');
            } else {
                $div.fadeIn();
                currentDot.removeClass('active-dot');
                nextDot.addClass('active-dot');
            }
        });
        
        swipeSlideLeft = false;
        //setTimeout(slideShow(), 5000);
    };


    var swipeRight = function(){
        $ds.filter(':visible').fadeOut(function(){
            var $div = $(this).prev('div');
            
            var currentDot = $('.active-dot');
            var prevDot = currentDot.prev();
            
            if ( $div.length === 0 ) {
                $ds.eq(3).fadeIn();
                prevDot = $('.dot').last();
                currentDot.removeClass('active-dot');
                prevDot.addClass('active-dot');
            } else {
                $div.fadeIn();
                currentDot.removeClass('active-dot');
                prevDot.addClass('active-dot');
            }
        });
        
        swipeSlideRight = false;
        //  setTimeout(slideShow(), 5000);
    };
        
        
        
//    $(window).on("orientationchange",function(){
//        function reorient(e) {
//            var portrait = (window.orientation % 180 === 0);
//            $("body > div").css("-webkit-transform", !portrait ? "rotate(-90deg)" : "");
//        }
//        window.onorientationchange = reorient;
//        window.setTimeout(reorient, 0);
//    });
        
    
    /*if(!swipeSlideLeft && !swipeSlideRight)
    {
        var intervalId = window.setInterval(function(){
            $ds.filter(':visible').fadeOut(function(){
                var $div = $(this).next('div');
                
                var currentDot = $('.active-dot');
                var nextDot = currentDot.next();
                
                if ( $div.length === 0 ) {
                    $ds.eq(0).fadeIn();
                    nextDot = $('.dot').first();
                    currentDot.removeClass('active-dot');
                    nextDot.addClass('active-dot');
                } else {
                    $div.fadeIn();
                    currentDot.removeClass('active-dot');
                    nextDot.addClass('active-dot');
                }
            });
            
            $ds.on("swipeleft", function(){
                swipeSlideLeft = true;
                window.clearInterval(intervalId);
                swipeLeft();
            });

            $ds.on("swiperight", function(){
                swipeSlideRight = true;
                window.clearInterval(intervalId);
                swipeRight();
            }); 
            
        }, 10000);
        
    }*/
    
    
    
    
    
    
    
};
