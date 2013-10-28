var texts = {
    no_moves: 'No more moves in this column',
    game_over: 'game over'
};

var options = {
    animation: {
        enabled: true
    },
    board: {
        cols: 7,
        rows: 6
    },
    button: {
        restart: $('#restart'),
        set: function (btn, state) {
            state = state ? false : true;
            this[btn].prop('disabled', state);
        }
    },
    bind_buttons: function () {
        var that = this;
        $('#options > button').prop('disabled', false);
        this.button.restart.bind("click", $.proxy(that, 'restart'));
    },
    restart: function () {
        if (confirm('Do you really want to restart game?')) {
            game.reset();
        }
    },
};

var Utility = {
    make2Darray: function (col, row) {
        var a = [],
            len = 0;
        while (len < col) {
            var c = [];
            while (c.push(0) < row);
            a.push(c);
            len++;
        }
        return a;
    },
    
    compareBoards: function (b1, b2) {
        // if the other array is a falsy value, return
        if (!b2)
            return false;
    
        // compare lengths - can save a lot of time
        if (b1.length != b2.length)
            return false;
    
        for (var i = 0; i < b1.length; i++) {
            // Check if we have nested arrays
            if (b1[i] instanceof Array && b2[i] instanceof Array) {
                // recurse into the nested arrays
                if (!Utility.compareBoards(b1[i], b2[i]))
                    return false;
            }
            else if (b1[i] != b2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    },
    
    transpose: function(mat) {
    
      // Calculate the width and height of the Array
      var a = mat,
        w = a.length ? a.length : 0,
        h = a[0] instanceof Array ? a[0].length : 0;
    
      // In case it is a zero matrix, no transpose routine needed.
      if(h === 0 || w === 0) { return []; }
    
      /**
       * @var {Number} i Counter
       * @var {Number} j Counter
       * @var {Array} t Transposed data is stored in this array.
       */
      var i, j, t = [];
    
      // Loop through every item in the outer array (height)
      for(i=0; i<h; i++) {
    
        // Insert a new row (array)
        t[i] = [];
    
        // Loop through every item per item in outer array (width)
        for(j=0; j<w; j++) {
    
          // Save transposed data.
          t[i][j] = a[j][i];
        }
      }
    
      return t;
    },
};

var game = {
    turn: 'blue',
    col: 0,
    currentCol: null,
    currentRow: null,
    win: false,
    winner: null,
    animating: false,
    quatro: [],
    arr: Utility.make2Darray(options.board.cols, options.board.rows),
    handle: $('<div>').attr('id', 'handle').append('<b><b></b></b>'),
    init: function (container) {
        this.table = this.makegame();
        this.handle.addClass(game.turn).appendTo(this.table);
        this.userEvents();
        container.append(this.table);
        options.bind_buttons();
    },
    makegame: function () {
        var cols, rows, col, game = $('<div>').addClass('board');
        for (cols = options.board.cols; cols--;) {
            col = $('<aside>').appendTo(game);
            for (rows = options.board.rows; rows--;) {
                $('<div>').appendTo(col).data('index', (options.board.cols - 1) - cols + '' + rows);
            }
        }
        return game;
    },
    setBoard: function(arr) {
        var newBoard = new Array(),
            copy = Utility.transpose(arr); 
        for (i = 0; i < options.board.cols; i++) {
            newBoard.push(copy[i].reverse());
        }
        this.arr = newBoard;
    },
    getBoard: function() {
        return this.arr;
    },
    
    compareBoard: function(board) {
        var reverse = new Array(),
            copy = this.arr.concat(); 
        for (i = 0; i < options.board.cols; i++) {
            reverse.push(copy[i].reverse());
        }
        return Utility.compareBoards(reverse, Utility.transpose(board));
    },
    
    userEvents: function () {
        var that = this,
            asides = $(this.table).find('aside');
        $(this.table).delegate('div', 'click', userInput_mouseclick).delegate('aside', 'mouseover', moveHandle);

        function userInput_mouseclick(e) {
            if (options.animation.enabled && that.animating) return;
            e.stopPropagation();
            if (that.win)
                return;
            var col, row, move;
            col = $(e.currentTarget).data('index')[0] | 0;
            that.move(col);
        }

        function moveHandle(e) {
            if (!that.win) {
                var col = that.col = asides.index($(this));
                if (!that.animating || !options.animation.enabled) {
                    game.handle.css('left', col * 51);
                }
            }
        }
    },
    
    fullCol: function(col) {
        var col = this.arr[col]; 
        if (col.indexOf(0) == -1) {
            //console.log(texts.no_moves);
            return true;
        }
        return false;
    },
    
    fallingRow: function(col) {
        return this.arr[col].filter(function(value) { return value != 0; }).length;
    },
    
    playerToNumber: function(player) {
        if (player == 'blue') {
            return 1;
        }
        else if (player == 'red') {
            return 2;
        }
    },
    
    move: function (col) {
        var that = this,
            cell, position, duration;
            
        if (this.fullCol(col)) {
            return false;
        }
        
        this.currentCol = col;
        this.currentRow = row = this.fallingRow(col);
        this.arr[col][row] = this.playerToNumber(this.turn);
        
        fall(col);

        function fall(col) {
            var effectiveRow = (options.board.rows - 1 - row);
            position = effectiveRow * 51;
                
            if (options.animation.enabled) {
                that.animating = true;
                duration = effectiveRow * 80 + 150;
                that.handle.animate({
                    top: position
                }, duration, "easeOutBounce", function () {
                    that.animating = false;
                    that.handle.hide();
                    cell = that.table.find('aside').eq(col).find('div').eq(effectiveRow);
                    cell.addClass(that.turn).append('<b><b></b></b>');
                    that.handle.show().css({
                        top: '-55px',
                        left: that.col * 51
                    }).find('> b > b').animate({
                        padding: '22px'
                    }, 400, "easeOutExpo");
                    
                    that.completeMove(col);
                });
            }
            else {
                that.handle.css('top', position);
                cell = that.table.find('aside').eq(col).find('div').eq(effectiveRow);
                cell.addClass(that.turn).append('<b><b></b></b>');
                that.completeMove(col);
            }
        }
    },
    
    completeMove: function(col) {
        if (this.checkWin(this.currentRow, col)) {
            this.gameOver();
        }
        else {
            if (this.isTied()) {
                this.gameOverTied();
            }
            else {
                this.changeTurn();
            }
        }
    },
    
    isTied: function() {
        return JSON.stringify(this.arr).indexOf('0') == -1;
    },
    
    changeTurn: function () {
        this.turn = this.turn == 'red' ? 'blue' : 'red';
        this.handle[0].className = this.turn;
    },
    
    checkWinAndProceed: function(r, c) {
        this.currentRow = r;
        this.currentCol = c;
        if (this.checkWin(r, c)) {
            this.gameOver();
        }
    },
    
    checkWin: function (r, c) {
        var arr = this.arr,
            quatro = [],
            i, j, victory = false;

        function checkRow() {
            quatro.length = 0;
            for (i = 0; i < (options.board.cols - 1); i++) {
                if (arr[i][r] == 0)
                    continue;
                if (arr[i][r] == arr[i + 1][r]) {
                    quatro.push(i + "" + r);
                    if (quatro.length == 3)
                        quatro.push(i + 1 + "" + r);
                } 
                else {
                    quatro.length = 0;
                }
                
                if (quatro.length == 4) {
                    multiWin(quatro);
                    return true;
                }
            }
            return false;
        };

        function checkCol() {
            quatro.length = 0;
            var size = arr[c].filter(function(value) { return value != 0; }).length;
            for (i = 0; i < size; i++) {
                if (arr[c][i] == arr[c][i + 1]) {
                    quatro.push(c + "" + i);
                    if (quatro.length == 3)
                        quatro.push(c + "" + (i + 1));
                } 
                else {
                    quatro.length = 0;
                } 
                
                if (quatro.length == 4) {
                    multiWin(quatro);
                    return true;
                }
            }
            return false;
        };

        function checkDiagonal() {
            var i, j, cr;
            quatro.length = 0;

            function checkPair(c, r, delta) {
                if (arr[c][r] && arr[c][r] == arr[c + delta][r + 1]) {
                    quatro.push(c + '' + r);
                    if (quatro.length == 3)
                        quatro.push(c + delta + "" + (r + 1));
                }
                if (c + delta > 0 && c + delta < (options.board.cols - 1) && 
                    r + 1 >= 0 && r + 1 < (options.board.rows - 1) && quatro.length < 4)
                    checkPair(c + delta, r + 1, delta);
                if (quatro.length == 4) {
                    multiWin(quatro);
                    return true;
                }
                quatro.length = 0;
            }
            if (r == 0) {
                i = c;
                j = r;
            } else if (r > c) {
                i = 0;
                j = r - c;
            } else if (r < c) {
                i = c - r;
                j = 0;
            } else
                i = j = 0; if (i < 5 && checkPair(i, j, 1))
                return true;
            cr = (options.board.cols - 1) - c;
            if (r > cr) {
                i = options.board.cols - 1;
                j = r - cr;
            } else if (r < cr) {
                j = 0;
                i = c + r;
            } else {
                i = options.board.cols - 1;
                j = 0;
            }
            if (i > 2 && checkPair(i, j, -1))
                return true;
            return false;
        };

        function multiWin(quatro) {
            game.quatro = game.quatro.concat(quatro);
        };
        if (checkRow())
            victory = true;
        if (checkCol())
            victory = true;
        if (checkDiagonal())
            victory = true;
        return victory;
    },
    
    isMultiWin: function() {
        return game.quatro.length == 20;
    },
    
    
    gameOver: function () {
        
        if (this.arr[this.currentCol][this.currentRow] == 1) {
            this.turn = 'blue';
        }
        else {
            this.turn = 'red';
        }
        
        var text = (this.turn == 'blue' ? 'Blue' : 'Red') + ' wins!';
        console.warn(text);
        
        this.win = true;
        this.winner = (this.turn == 'blue' ? 1 : 2);
        var i, o = 1,
            cells = $();
            
        for (var i = game.quatro.length; i--;) {
            var col = game.quatro[i][0] | 0,
                row = game.quatro[i][1] | 0;
            cells = cells.add(this.table.find('aside').eq(col).find('div').eq((options.board.rows - 1) - row));
        }
        
        $('.winner').html(text);
        $('.winner').css('visibility', 'visible');
        $('.winner').addClass(this.turn == 'blue' ? 'blue' : 'red');
        
        this.table.addClass('gameover');
        this.handle.hide();
        (function initAnimation() {
            if (game.quatro.length) {
                for (i = 4; i--;) {
                    o = o == 1 ? 0.3 : 1;
                    cells.animate({
                        opacity: o
                    }, 400, "easeInQuad");
                }
                setTimeout(initAnimation, 1500);
            }
        })();
        console.warn(texts.game_over);
    },
    
    
    gameOverTied: function () {
        var text = (this.turn == 'blue' ? 'Blue' : 'Red') + ' wins!';
        console.warn(text);
        
        $('.winner').html('Game tied!');
        $('.winner').css('visibility', 'visible');
        $('.winner').addClass('tied');
        this.table.addClass('gameover');
        this.handle.hide();
    },
    
    reset: function() {
        with(this) {
            arr = Utility.make2Darray(options.board.cols, options.board.rows);
            turn = 'blue';
            quatro.length = 0;
            win = false;
            winner = null;
            table.find('div[class]').not('#handle').removeAttr('class').empty();
            animating = false;
            handle.show();
            table.removeClass('gameover');
        }
        $('.winner').css('visibility', 'hidden');
        if ($('#handle').length) {
            $('#handle').stop().css('top', '-55px')[0].className = this.turn;
        }
    }
    
};

// Used http://matthewlein.com/experiments/easing.html as a reference For jQuery Animations

jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeInQuint: function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    }
});
