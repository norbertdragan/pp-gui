import React, { useReducer, createContext, useEffect } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import theme from "../../styles/theme";
import Backgrounds from "./Backgrounds";
import { PlayerGrid9Max } from "../PlayerGrid";
import Player from "../Player";
import Board from "../Board";
import Dealer from "../Dealer";
import TotalPot from "./TotalPot";
import { ChipGrid, Bet } from "../Chips";
import Controls from "../Controls";
import MainPot from "./MainPot";
import initialState from "../store/initialState";
import reducer from "../store/reducer";
import Game from "../Game/";
import Connections from "./Connections";
import { StateContext, DispatchContext } from "../store/context";
import GameAPI from "../Game/GameAPI";

const Table = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    activePlayer,
    boardCards,
    chipsCollected,
    controls,
    dealer,
    gameType,
    gameTurn,
    holeCards,
    players,
    pot,
    options,
    showMainPot,
    showDealer
  } = state;

  // For debugging purposes log the state when it changes
  // useEffect(() => {
  //   console.log("The state has changed");
  //   console.log(state);
  // }, [state]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <Game />
        <div
          css={css`
            background-color: ${theme.moon.colors.dark};
            height: 37.5rem;
            width: 50rem;
            position: relative;
          `}
        >
          <Connections />
          <div
            css={css`
              color: white;
              position: absolute;
              top: 0.25rem;
              left: 0.25rem;
              z-index: 4;
              font-size: 0.75rem;
            `}
          >
            {gameType}
          </div>
          <div
            css={css`
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: 1;
            `}
          >
            <div
              css={css`
                position: absolute;
              `}
            />
            {options.showPotCounter && (
              <TotalPot
                pot={pot}
                players={players}
                chipsCollected={chipsCollected}
                updateMainPot={GameAPI.updateMainPot}
                dispatch={dispatch}
              />
            )}
            <Board boardCards={boardCards} gameTurn={gameTurn} />
            <PlayerGrid9Max>
              {Object.values(players).map(
                player =>
                  player.isPlaying && (
                    <Player
                      chips={player.chips}
                      connected={player.connected}
                      hasCards={player.hasCards}
                      isActive={activePlayer && activePlayer == player.seat}
                      playerCards={player.playerCards}
                      players={players}
                      seat={player.seat}
                      showCards={player.showCards}
                      key={player.seat}
                    />
                  )
              )}
            </PlayerGrid9Max>
            <ChipGrid chipsCollected={chipsCollected}>
              {Object.values(players).map(
                player =>
                  player.isBetting && (
                    <Bet
                      betAmount={player.betAmount}
                      forPlayer={player.seat}
                      chipsCollected={chipsCollected}
                      playerBet
                      key={player.seat}
                    />
                  )
              )}
            </ChipGrid>
            {showMainPot && pot[0] !== 0 && <MainPot mainPot={pot[0]} />}
            {showDealer && <Dealer dealer={`player${dealer + 1}`} />}
            {controls.showControls && (
              <div>
                <Controls />
              </div>
            )}
          </div>
          <Backgrounds />
        </div>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
export default Table;
export { DispatchContext, StateContext };
