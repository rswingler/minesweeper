import * as React from 'react';
import styles from './Board.module.css';
import {Tile} from "./Tile";
import cx from 'classnames';

export interface TileModel {
    face: number,
    isClicked: boolean,
    hasMine: boolean,
    hasFlag: boolean,
    mineCount: number,
    x: number,
    y: number
}

export function Board(){

    const [board, setBoard] = React.useState([]);
    const [gameCount, setGameCount] = React.useState(0);
    const [gameOver, setGameOver] = React.useState(false);
    const [totalMineCount, setTotalMineCount] = React.useState(0);
    const [flagMode, setFlagMode] = React.useState(false);

    React.useEffect(() => initBoard(), []);

    const placeMine = (difficulty: number) => Math.floor(Math.random() * (difficulty)) === 1;

    const initBoard = () => {
        let dim = 10;
        let difficulty = 10; // lower is more difficult, d >= 2
        let myBoard: TileModel[][] = [];
        for(let i = 0; i < dim; i++){
            let row = [];
            for(let j = 0; j < dim; j++){
                let hasMine = placeMine(difficulty);
                if(hasMine) setTotalMineCount(totalMineCount + 1);
                row.push({
                    face: 0,
                    isClicked: false,
                    hasMine: hasMine,
                    hasFlag: false,
                    x: i,
                    y: j
                });
            }
            myBoard.push(row);
        }
        setBoard(myBoard);
        setGameCount(gameCount + 1);
        setGameOver(false);
    };

    const updateTile = (t: TileModel) => {
        let b = [...board];
        b[t.x][t.y] = t;
        setBoard(b);
    }

    return(
        <div className={cx(styles.boardContainer, flagMode ? styles.flagcursor : '')}>
            <div className={styles.buttonRow}>
                <div className={styles.button} onClick={initBoard}>Reset</div>
                {/*<div className={cx(styles.button, styles.flagButton)} onClick={() => setFlagMode(true)}>Set Flag</div>*/}
            </div>
            <div className={styles.board}>
                {board.flat().map(t =>
                    <Tile key={`${gameCount}-${t.x}-${t.y}`}
                          model={t}
                          updateTile={updateTile}
                          board={board}
                          gameOver={gameOver}
                          setGameOver={setGameOver}
                          flagMode={flagMode}
                          setFlagMode={setFlagMode}/>)
                }
            </div>
        </div>

    );
}