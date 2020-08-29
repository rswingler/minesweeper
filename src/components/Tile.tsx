import * as React from 'react';
import styles from './Tile.module.css';
import {TileModel} from "./Board";
import cx from 'classnames';

interface Props {
    model: TileModel,
    updateTile: Function,
    board: TileModel[][],
    gameOver: boolean,
    setGameOver: Function,
    flagMode: boolean,
    setFlagMode: Function
}
export function Tile(props: Props){

    const {model, updateTile, board, gameOver, setGameOver, flagMode, setFlagMode} = props;

    React.useEffect(() => {calcTileNum()}, []);

    const clickTile = () => {
        if(flagMode){
            setFlagMode(false);
            model.hasFlag = true;
            model.isClicked = true;
            updateTile(model);
        }
        else {
            if(!gameOver){
                model.isClicked = true;
                updateTile(model);
                if(hasWonGame()){
                    showYouWin();
                }
                else {
                    if(model.hasMine){
                        showGameOver();
                    }
                    else if(model.face === 0){
                        expandEmptyArea(model);
                        showNeighborClues();
                    }
                }
            }
        }
    };

    const showYouWin = () => {
        setTimeout(() => alert('You Win!'), 200);
        setGameOver(true);
    }

    const showGameOver = () => {
        setTimeout(() => alert('Game Over!'), 200);
        setGameOver(true);
        board.flat().forEach(t => {if(t.hasMine) t.isClicked = true});
    };

    const getNeighbors = (x, y) => {
        let nw = board[x-1] ? board[x-1][y-1] : null;
        let n = board[x][y-1];
        let ne = board[x+1] ? board[x+1][y-1] : null;
        let w = board[x-1] ? board[x-1][y] : null;
        let e = board[x+1] ? board[x+1][y] : null;
        let sw = board[x-1] ? board[x-1][y+1] : null;
        let s = board[x][y+1];
        let se = board[x+1] ? board[x+1][y+1] : null;
        return [nw, n, ne, w, e, sw, s, se];
    }

    const calcTileNum = () => {
        let tileNum = 0;
        getNeighbors(model.x, model.y).forEach(n => {
            if(n && n.hasMine) tileNum++;
        })
        model.face = tileNum;
        return tileNum;
    }

    const expandEmptyArea = (t: TileModel) => {
        getNeighbors(t.x, t.y).forEach(n => {
            if(n && n.face === 0 && !n.isClicked) {
                n.isClicked = true;
                expandEmptyArea(n);
            } else return;
        });
    }

    const showNeighborClues = () => {
        board.flat()
            .filter(t => t.isClicked && t.face === 0)
            .forEach(t => {
                getNeighbors(t.x, t.y).forEach(n => {
                    if(n && !n.isClicked && !n.hasMine && n.face > 0) n.isClicked = true;
                })
            })
    }

    const hasWonGame = () => {
        let flatBoard = board.flat();
        let totalTileCount = flatBoard.length;
        let totalMineCount = board.flat().filter(t => t.hasMine).length;
        let clickedTileCount = board.flat().filter(t => !t.hasMine && t.isClicked).length;
        return clickedTileCount === (totalTileCount - totalMineCount);
    }

    const buildFace = (t: TileModel) => {
        let face;
        if(t.hasMine && !t.hasFlag) {
            face = (<img className={styles.tileicon} src={'/mine.png'}/>);
        }
        else if (t.hasMine && t.hasFlag){
            face = (<img className={styles.tileicon} src={'/flag.png'}/>);
        }
        else {
            let num = calcTileNum();
            if(num > 0) face = `${num}`;
        }
        return face;
    };

    const getColor = (face) => {
        if(face >= 3) return styles.red;
        if(face >= 1) return styles.blue;
    }

    return(<>
            {!model.isClicked && <div className={cx(styles.tile, styles.unclicked, flagMode ? styles.targetCursor : styles.handCursor)} onClick={clickTile}/>}
            {model.isClicked &&
                <div className={styles.tile} onClick={clickTile}>
                  <div className={cx(styles.face, getColor(model.face))}>
                      {buildFace(model)}
                  </div>
                </div>
            }
    </>
   );
}