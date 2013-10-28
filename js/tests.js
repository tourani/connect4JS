var boards = {

    moves: {
        
        one: [ 
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 1, 0, 0, 0, 0, 0, 0 ], 
        ],
    
        two: [ 
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 2, 0, 0, 0, 0, 0, 0 ],
            [ 1, 0, 0, 0, 0, 0, 0 ], 
        ],
    
        fullColumn: [ 
            [ 2, 0, 0, 0, 0, 0, 0 ],
            [ 1, 0, 0, 0, 0, 0, 0 ],
            [ 2, 0, 0, 0, 0, 0, 0 ],
            [ 1, 0, 0, 0, 0, 0, 0 ],
            [ 2, 0, 0, 0, 0, 0, 0 ],
            [ 1, 0, 0, 0, 0, 0, 0 ],
        ],
    
        fullRow: [ 
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 1, 2, 1, 2, 1, 2, 1 ],
            [ 2, 1, 2, 1, 2, 1, 2 ],
            [ 1, 2, 1, 2, 1, 2, 1 ],
        ],
        
    },
    
    winning: {
        
        noWin: [ 
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 2, 2, 2, 0, 0, 0, 0 ],
            [ 1, 1, 1, 0, 0, 0, 0 ], 
        ],
        
        row: [ 
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 2, 2, 2, 0, 0, 0, 0 ],
            [ 1, 1, 1, 1, 0, 0, 0 ], 
        ],
        
        col: [ 
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 2, 0, 0, 0, 0, 0 ],
            [ 1, 2, 0, 0, 0, 0, 0 ],
            [ 1, 2, 0, 0, 0, 0, 0 ],
            [ 1, 2, 1, 0, 0, 0, 0 ], 
        ],
        
        diagonal: [ 
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 2, 1, 0, 0, 0, 0, 0 ],
            [ 1, 2, 1, 2, 0, 0, 0 ],
            [ 2, 1, 2, 1, 0, 0, 0 ],
            [ 1, 2, 1, 2, 0, 0, 0 ], 
        ],
        
        multi: [ 
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0 ],
            [ 1, 1, 1, 1, 0, 0, 0 ],
            [ 2, 2, 1, 1, 0, 0, 0 ],
            [ 2, 1, 1, 1, 2, 2, 0 ],
            [ 1, 2, 2, 1, 2, 2, 2 ], 
        ],
        
    }
};

options.animation.enabled = false;
game.init( $("#none") );


/**********/
/* Move tests */

test( "All tests", function() {
    
    game.move(0);
    
    ok( game.compareBoard(boards.moves.one)  , "Passed one move test" );


    game.reset();
    game.move(0);
    game.move(0);
    
    ok( game.compareBoard(boards.moves.two)  , "Passed two moves test" );
    
    
    game.reset();
    game.move(0);
    game.move(0);
    game.move(0);
    game.move(0);
    game.move(0);
    game.move(0);
    
    ok( game.compareBoard(boards.moves.fullColumn)  , "Passed full column board test" );
    ok( game.fullCol(0)  , "Passed full column test - Column 0 is full" );
    ok( !game.fullCol(1)  , "Passed full column test - Column 1 is not full" );
    
    game.reset();
    game.setBoard(boards.winning.noWin);
    
    ok( game.compareBoard(boards.winning.noWin)  , "Passed no win test" );


    game.reset();
    game.setBoard(boards.winning.row);
    game.checkWinAndProceed(0, 3);
    
    ok( game.win && game.winner == 1 , "Passed winning by 4 in a row test" );


    game.reset();
    game.setBoard(boards.winning.col);
    game.checkWinAndProceed(3, 1);
    
    ok( game.win && game.winner == 2  , "Passed winning by 4 in a column test" );


    game.reset();
    game.setBoard(boards.winning.diagonal);
    game.checkWinAndProceed(3, 0);
    
    ok( game.win && game.winner == 2  , "Passed winning by 4 in a diagonal test" );


    game.reset();
    game.setBoard(boards.winning.multi);
    game.checkWinAndProceed(3, 3);
    
    ok( game.win && game.winner == 1 && game.isMultiWin()  , "Passed winning by col/row/diagonal test" );
});

