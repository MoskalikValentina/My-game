function Game () {
	this.rounds = [];
	this.current = 0;
	this.countClikElement = 0;
	this.missedElement = 0;
	this.maxAmountShown = 10;
	this.$wrapper = $(".wrapper");
	this._events();
}

Game.prototype.init = function(amountElement) {
	var $wrapper = this.$wrapper,
		i,
		amount = amountElement,
		rounds = this.rounds;
	for (var i = amount - 1; i >= 0; i--) {
		rounds.push(new Round($wrapper));
	};
	return this;
};

Game.prototype.start = function() {
	var rounds = this.rounds;
	for (var i = rounds.length - 1; i >= 0; i--) {
		rounds[i].start();
	};
	this.current = 0;
	this.countClikElement = 0;
	this.missedElement = 0;
};

Game.prototype._end = function() {
	var rounds = this.rounds;
    for (var i = rounds.length - 1; i >= 0; i--) {
			rounds[i]._clearTimers();
			rounds[i].hide();
	};
};
Game.prototype.addRound = function() {
	var rounds = this.rounds,
		$wrapper = this.$wrapper;
	rounds.push(new Round($wrapper));
	rounds[rounds.length - 1].start();
};

Game.prototype.removeRound = function(amountElement) {
	var rounds = this.rounds;
	if (rounds.length > amountElement){
		var delRound = rounds.pop();
		delRound.data.round.$elem.remove();
		delRound._clearTimers();
		delete delRound;
		return rounds.length;
	};
		return rounds.length;
};

Game.prototype.createLifes = function() {
	var $life = $('<div class="oneLife"></div>'),
   	 	img = $('<img>',{src: 'image/heart_PNG700.png'});
   	 	
   	$("#life").fadeIn(1000);
   	$("#life").prepend($life);
   	$life.append(img);
   	for (var i=1; i<5; i++){
   	$life.clone(true).insertAfter($life);
   	};
};

Game.prototype._clearLife = function() {
	$('#life').empty();
};
Game.prototype._decreaseLife = function() {
	$(".oneLife:last").remove();
};
Game.prototype._alignPopap = function() {
	var $popap = $('#popap');
	$popap.css({
		marginTop: '-' + $popap.height()/2 + 'px',
		marginLeft: '-' + $popap.width()/2 + 'px'
	});
};

Game.prototype._showPopap = function() {
	this._alignPopap();
	$('#popap, #overlay').fadeIn(500);
};
Game.prototype._hidePopap = function() {
	$('#popap, #overlay').fadeOut(500);
};

Game.prototype._events = function() {
	var self = this;
	this.$wrapper.on('round.missed', function() {
		self._roundMissed.call(self);
	});
	this.$wrapper.on('round.showNew', function() {
		self._roundShowNew.call(self);
	});
	this.$wrapper.on('round.click', function() {
		self._roundclicked.call(self);
	});
	$('#popap_close').click(function() {
		self._hidePopap();
	});

};


Game.prototype._roundMissed = function() {
	var missed = this.missedElement++,
		$text =$('#popap_text');
	this._decreaseLife(); 

	if (missed >= 5){
		this._showPopap();
		$text.text('Вы проиграли!!!');
		$ ('#result').text('Ваш результат '+ this.countClikElement + ' очка(-ов)');
		this._end();
		this.$wrapper.trigger('game.over');
	}
};

Game.prototype._roundShowNew = function() {
	this.current++;
};

Game.prototype._roundclicked = function() {
	this.countClikElement++;
};
