// Object of all players at the table
const initialState: IState = {
  players: {
    player1: {
      isPlaying: true,
      seat: "player1",
      chips: 20000000,
      hasCards: true,
      showCards: true,
      isBetting: false,
      betAmount: 0,
      playerCards: [],
      connected: true
    },
    player2: {
      isPlaying: true,
      seat: "player2",
      chips: 20000000,
      hasCards: true,
      showCards: true,
      isBetting: false,
      betAmount: 0,
      playerCards: [],
      connected: true
    }
  },
  // Which seat is the active player
  activePlayer: null,
  // Current blinds - small and big one
  blinds: [0, 0],
  // Board Cards
  boardCards: [],
  // Connection status dispalyed at the top
  connection: {
    dcv: "Not connected",
    bvv: "Not connected",
    player1: "Not connected",
    player2: "Not connected",
    echo: "Not connected"
  },
  controls: {
    showControls: false,
    showFirstRow: true
  },
  // Wether the cards have been dealt
  cardsDealt: false,
  // Wether the chips have been collected to the middle
  chipsCollected: false,
  // Which player is the dealer
  dealer: 0,
  // Wether the game has started
  gameStarted: false,
  // Where are we at the game. 0: preflop, 1: flop, 2: turn, 3: river
  gameTurn: 0,
  // Game type at the top left corner
  gameType: "",
  // Total number of hands played in this session
  handsPlayed: 0,
  // Cards of the user
  holeCards: [],
  // Wether the app should run in developer mode
  isDeveloperMode: false,
  // Wether the Startup Modal shows at the beginning of the game
  isStartupModal: true,
  // Object that stores the last action so we can dispaly it on the UI
  lastAction: { player: 0, action: null },
  // Messages to send to the nodes - when updated, the message will be sent
  lastMessage: {
    method: "replay",
    action: "round_betting",
    playerid: 1,
    round: 1,
    pot: 4000000,
    actions: [5, 3, 3],
    possibilities: [0, 1, 2, 3, 4, 5, 6, 7],
    min_amount: 0,
    gui_playerID: 1
  },
  nodeType: "player",
  nodes: {
    dcv: "0.0.0.0",
    bvv: "0.0.0.0",
    player1: "0.0.0.0",
    player2: "0.0.0.0",
    echo: "0.0.0.0"
  },
  message: {
    dcv: null,
    bvv: null,
    player1: null,
    player2: null,
    echo: null
  },
  // Amount of the minimum raise
  minRaise: 4000000,
  // Options for the pot
  options: {
    showPotCounter: false
  },
  // Pot and side pots - dynamicly updated by the TotalPot component
  pot: [0],
  // Number of seats at the table
  seats: 2,
  // Wether to show the dealer button
  showDealer: false,
  // Wether to show the main pot at the center of the table
  showMainPot: true,
  // The calculated value of the pot and all the bets
  totalPot: 0,
  // Amount to call
  toCall: 2000000,
  // Where does the user sit
  userSeat: "player1",
  // The player that won the game
  winner: null
};

export interface IPlayer {
  isPlaying: boolean;
  seat: string;
  chips: number;
  hasCards: boolean;
  showCards: boolean;
  isBetting: boolean;
  betAmount: number;
  playerCards: string[];
  connected: boolean;
}

export interface IState {
  players: { player1: IPlayer; player2: IPlayer };
  activePlayer: string;
  blinds: [number, number];
  boardCards: string[];
  connection: {
    dcv: string;
    bvv: string;
    player1: string;
    player2: string;
    echo: string;
  };
  controls: { showControls: boolean; showFirstRow: boolean };
  cardsDealt: boolean;
  chipsCollected: boolean;
  dealer: number;
  gameStarted: boolean;
  gameTurn: 0 | 1 | 2 | 3 | 4;
  gameType: string;
  handsPlayed: number;
  holeCards: string[];
  isDeveloperMode: boolean;
  isStartupModal: boolean;
  lastAction: { player: number; action: string | null };
  lastMessage: object;
  nodes: {
    dcv: string | null;
    bvv: string | null;
    player1: string | null;
    player2: string | null;
    echo: string | null;
  };
  nodeType: string;
  message: {
    dcv: string | null;
    bvv: string | null;
    player1: string | null;
    player2: string | null;
    echo: string | null;
  };
  minRaise: number;
  options: {
    showPotCounter: boolean;
  };
  pot: number[];
  seats: number;
  showDealer: boolean;
  showMainPot: boolean;
  totalPot: number;
  toCall: number;
  userSeat: string;
  winner: string | null;
}

// export default initialState;
export default initialState;
