function Round (wrapper){
	var $wrapper = $(wrapper),
		$round;
	if (!$wrapper.length) {
		return false;
	}
	
	$wrapper = $wrapper.eq(0); 
	$round = $('<div>').addClass('round');
	$wrapper.append($round);
	this.stoped = false;
	this.data = {
		round: {
			$elem: $round,
			maxDiametr: 70,
			minDiametr: 30,
			diametr: 0,
			time: 500
		},
		wrapper: {
			$elem: $wrapper,
			width: $wrapper.width(),
			height: $wrapper.height()
		},
		timers:{
			show: false,
			hide: false
		},
		time:{
			hide: 0,
			maxDelay:5000,
			minDelay:2000
		}

	};
	this._changeSize();
	this.event();

}

Round.prototype.show = function() {
	$round = this.data.round.$elem;
	this._changeSize()
		._changePosition()
		._changeRandomTime();
		$round.fadeIn(this.data.round.time);

	$round.removeClass('active');
	this._counterIncrice();
	return this;
};

Round.prototype.hide = function() {
	var round = this.data.round;
	round.$elem.hide(round.time, function(){
		round.$elem.removeClass('missed');
	});
	return this;
};

Round.prototype.startShowTimer = function() {
	var self = this;
	this.data.timers.show = setTimeout(function(){
		if (self.stoped) {
			return;
		};
		self.show()
		.startHideTimer();
	}, 1000 );

	return this;
};

Round.prototype.startHideTimer = function() {
	var self = this;
	this.data.timers.hide = setTimeout(function(){
		self.data.round.$elem.addClass('missed');
		self.data.round.$elem.trigger('round.missed');
		self.hide();
		self._showFall();
		if (self.stoped) {
			return;
		};
		self.startShowTimer();
	}, self.data.time.hide );
	return this;
};


Round.prototype._showFall = function() {
	var $round = this.data.round.$elem,
		PosY = parseInt($round.css('top')),
		AllHeight = this.data.wrapper.height - this.data.round.diametr;
	while(PosY < AllHeight){
		PosY +=1;
		setTimeout(function(){
			$round.css('top', PosY);
		}, 100);
	};
};

Round.prototype._getRandomDiamert = function() {
	var max = this.data.round.maxDiametr,
	min = this.data.round.minDiametr;
	return Math.round( Math.random() * ( max -  min ) + min );
};
Round.prototype._changeSize = function() {
	var round = this.data.round;
	var diametr = this._getRandomDiamert();
	round.diametr = diametr;
	round.$elem.width(diametr);
	round.$elem.height(diametr);
	return this;
};

Round.prototype._changePosition = function() {
	var posX =  this._getRandomPositionX(),
		posY =  this._getRandomPositionY(),
		$round = this.data.round.$elem;
	$round.css('top', posY );
	$round.css('left', posX );
	return this;
};

Round.prototype.event = function() {
	var self = this;
	var $round = this.data.round.$elem;
	$round.click(function() {
		var $round = self.data.round.$elem;
		if($round.hasClass('missed') || $round.hasClass('active')){
			return false;
		}
		clearTimeout(self.data.timers.hide);
		$round.addClass('active');
		self._clickCounterIncrice();
		self.hide()
		self.startShowTimer();
	});
	$(window).resize(function(){
		var wrapper = self.data.wrapper;
        wrapper.width = wrapper.$elem.width();
        wrapper.height = wrapper.$elem.height();
	});
	this.data.wrapper.$elem.on('game.stop', function() {
		self._clearTimers();
	});
};

Round.prototype.start = function() {
	this.stoped = false;
	this.startShowTimer();
};

Round.prototype._getRandomPositionX = function() {
	var diametr = this.data.round.diametr,
		parentWidht = this.data.wrapper.width;
	return Math.round(Math.random()*(parentWidht - diametr));
};

Round.prototype._getRandomPositionY = function() {
	var diametr = this.data.round.diametr,
		parentHeight = this.data.wrapper.height;
	return Math.round(Math.random()*(parentHeight - diametr)/1.5);
};

Round.prototype._changeRandomTime = function() {
	var max = this.data.time.maxDelay,
	    min = this.data.time.minDelay,
	    randomTime = Math.round( Math.random() * ( max -  min )) + min ;
	this.data.time.hide = randomTime;
	return this;
};

Round.prototype._clearTimers = function() {
	clearTimeout(this.data.timers.hide);
	clearTimeout(this.data.timers.show);
	this.stoped = true;
};

Round.prototype._counterIncrice = function() {
	this.data.round.$elem.trigger('round.showNew');
	return this;
};

Round.prototype._clickCounterIncrice = function() {
	this.data.round.$elem.trigger('round.click');
	return this;
};
