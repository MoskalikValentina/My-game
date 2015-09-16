var game;
$(function(){
    game = new Game();
    game.init(2);
    var counterLevel = 1,
    $buttons = $("#buttons"),
    $start = $buttons.children("#start"),
    $end = $buttons.children("#end"),
    $next = $buttons.children("#next"),
    $previous = $buttons.children("#previous");
    function unavailableButton(){
        var i;
        for (i = 0; i < arguments.length; i++){
            arguments[i].addClass('unavailable');
        };
    };
    function availableButton(){
        for (var i = 0; i < arguments.length; i++){
            arguments[i].removeClass('unavailable');
        };
    };
    function counter_level(counterLevel){
       $('#currentLevel').text('Current level: '+ counterLevel); 
    };
    unavailableButton($end, $next, $previous);
    
    $start.click(function(){
        if ($(this).hasClass('unavailable')) {
            return false;
        }
        $('#currentLevel').text('Current level: '+ counterLevel);
        game.start();
        game.createLifes();
        unavailableButton($start);
        availableButton($end, $next);
       
    });
    
    $end.click(function(){
        game._end();
        game._clearLife();
        availableButton($start);
        unavailableButton($end, $next);
    });

    $('.wrapper').on('game.over', function() {
        availableButton($start);
        unavailableButton($end, $next);
    });

    $next.click(function(){
        if ($(this).hasClass('unavailable')) {
            return false;
        }
        game.addRound();
        availableButton($previous);
        counter_level(++counterLevel);
    });

    $previous.click(function(){
        if ($(this).hasClass('unavailable')) {
            return false;
        }
        var lenghtArr = game.removeRound(2);
        if (lenghtArr <= 2){
            unavailableButton($previous);
        };
        counter_level(--counterLevel);
    });
});

