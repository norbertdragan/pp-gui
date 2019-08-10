import {
  bet,
  deal,
  dealCards,
  game,
  log,
  nextHand,
  playerJoin,
  seats,
  sendMessage,
  setActivePlayer,
  setBalance,
  setLastAction,
  setLastMessage,
  setUserSeat,
  setWinner,
  updateMainPot,
  updateTotalPot,
  showControls
} from "../store/actions";

// The communication structure of this code has been ported from pangea-poker-frontend

export const onMessage = (message, state, dispatch) => {
  message = JSON.parse(message);

  log("Received from DCV", "received", message);
  setLastMessage(message, dispatch);

  switch (message["method"]) {
    case "game":
      game(message["game"], state, dispatch);
      sendMessage({ method: "seats" }, "dcv", state, dispatch);
      break;

    case "seats":
      seats(message["seats"], dispatch);
      //sendMessage({ method: "dcv" }, "dcv", state, dispatch);
      break;

    case "dcv":
      //sendMessage({ method: "bvv" }, "bvv", state, dispatch);
      break;

    case "bvv_join":
      log("BVV has Joined", "info");
      break;

    case "join_res":
      message["gui_playerID"] = 0;
      //sendMessage(message, "player1", state, dispatch);
      message["gui_playerID"] = 1;
      //sendMessage(message, "player2", state, dispatch);
      break;

    case "check_bvv_ready":
      sendMessage(message, "bvv", state, dispatch);
      break;

    case "init":
      message["gui_playerID"] = 0;
      //sendMessage(message, "player1", state, dispatch);
      message["gui_playerID"] = 1;
      //sendMessage(message, "player2", state, dispatch);
      break;

    case "init_d":
      message["method"] = "init_d_bvv";
      sendMessage(message, "bvv", state, dispatch);

      message["method"] = "init_d_player";
      message["gui_playerID"] = 0;
      sendMessage(message, "player1", state, dispatch);

      message["gui_playerID"] = 1;
      sendMessage(message, "player2", state, dispatch);
      break;

    case "dealer":
      console.log("We got the dealer");
	  /*
      message["method"] = "dealer_bvv";
      sendMessage(message, "bvv", state, dispatch);

      message["method"] = "dealer_player";
      message["gui_playerID"] = 0;
      sendMessage(message, "player1", state, dispatch);
      message["gui_playerID"] = 1;
      sendMessage(message, "player2", state, dispatch);
	  */	
      break;

    case "turn":
      console.log("Received the turn info");

      if (message["playerid"] == 0) {
        message["gui_playerID"] = 0;
        sendMessage(message, "player1", state, dispatch);
      } else {
        message["gui_playerID"] = 1;
        sendMessage(message, "player2", state, dispatch);
      }
      break;

    case "betting":
      switch (message["action"]) {
        case "check":
        case "call":
        case "raise":
        case "fold":
        case "allin":
          message["action"] = message["action"] + "_player";
          if (message["gui_playerID"] == 0) {
            message["gui_playerID"] = 1;
            sendMessage(message, "player2", state, dispatch);
          } else if (message["gui_playerID"] == 1) {
            message["gui_playerID"] = 0;
            sendMessage(message, "player1", state, dispatch);
          }
          break;
      }
      break;

    case "invoice":
      switch (message["playerID"]) {
        case 0:
          message["gui_playerID"] = 0;
          sendMessage(message, "player1", state, dispatch);
          break;
        case 1:
          message["gui_playerID"] = 1;
          sendMessage(message, "player2", state, dispatch);
          break;
      }
      break;

    case "winningInvoiceRequest":
      switch (message["playerID"]) {
        case 0:
          message["gui_playerID"] = 0;
          sendMessage(message, "player1", state, dispatch);
          break;
        case 1:
          message["gui_playerID"] = 1;
          sendMessage(message, "player2", state, dispatch);
          break;
      }
      setWinner(message, state, dispatch);
      break;

    case "reset":
      message["method"] = "player_reset";
      message["gui_playerID"] = 0;
      sendMessage(message, "player1", state, dispatch);

      message["gui_playerID"] = 1;
      sendMessage(message, "player2", state, dispatch);

      message["method"] = "bvv_reset";
      sendMessage(message, "bvv", state, dispatch);

      setTimeout(() => {
        setUserSeat(null, dispatch);
        nextHand(state, dispatch);
        playerJoin("player1", state, dispatch);
        playerJoin("player2", state, dispatch);
      }, 5000);
      break;
    case "blindsInfo":
    /*update small_blind and big_blind values received from backend to the gui here*/
  }
};

export const onMessage_bvv = (message, state, dispatch) => {
  message = JSON.parse(message);
  setLastMessage(message, dispatch);
  log("Received from BVV: ", "received", message);
  log(message["method"], "info");

  switch (message["method"]) {
    case "init_b":
      message["method"] = "init_b_player";
      message["gui_playerID"] = 0;
      sendMessage(message, "player1", state, dispatch);

      message["gui_playerID"] = 1;
      sendMessage(message, "player2", state, dispatch);
      break;

    default:
      sendMessage(message, "dcv", state, dispatch);
  }
};

export const onMessage_player1 = (message, state, dispatch) => {
  message = JSON.parse(message);
  setLastMessage(message, dispatch);
  log("Received from player1: ", "received", message);

  switch (message["method"]) {
    case "deal":
      dealCards(dispatch);
      setUserSeat("player1", dispatch);
      deal(message, state, dispatch);
      break;

    case "requestShare":
      if (message["toPlayer"] == 1) {
        message["gui_playerID"] = 1;
        sendMessage(message, "player2", state, dispatch);
      }
      break;

    case "share_info":
      if (message["toPlayer"] == 1) {
        message["gui_playerID"] = 1;
        sendMessage(message, "player2", state, dispatch);
      }
      break;

    case "playerCardInfo":
      console.log("playerCardInfo");
      sendMessage(message, "dcv", state, dispatch);
      break;

    case "replay":
      message["method"] = "betting";
      message["gui_playerID"] = 0;
      setActivePlayer("player1", dispatch);
      showControls(true, dispatch);
      break;

    case "betting":
      switch (message["action"]) {
        case "small_blind_bet":
          bet(message["playerid"], message["amount"], state, dispatch);
          setLastAction(message["playerid"], "Small Blind", dispatch);
		  /*	
          message["action"] = "small_blind_bet_player";
          message["gui_playerID"] = 0;
          sendMessage(message, "player1", state, dispatch);

          message["gui_playerID"] = 1;
          sendMessage(message, "player2", state, dispatch);
          */
          log("Small Blind has been posted.", "info");
          break;

        case "big_blind_bet":
          bet(message["playerid"], message["amount"], state, dispatch);
          setLastAction(message["playerid"], "Big Blind", dispatch);
		  /*
          message["action"] = "big_blind_bet_player";

          message["gui_playerID"] = 0;
          sendMessage(message, "player1", state, dispatch);

          message["gui_playerID"] = 1;
          sendMessage(message, "player2", state, dispatch);
		  */	
          log("Big Blind has been posted.", "info");
          break;

        case "round_betting":
          /*
          message["method"] = "replay";
          message["playerid"] === 0 &&
            sendMessage(message, "player1", state, dispatch);
          message["playerid"] === 1 &&
            sendMessage(message, "player2", state, dispatch);
		  */  	
          setActivePlayer("player1", dispatch);
		  updateTotalPot(message["pot"], dispatch);
  		  showControls(true, dispatch);
          break;

        default:
          if (message["playerid"] === 0) {
            message["gui_playerID"] = 0;
            sendMessage(message, "player1", state, dispatch);
          } else if (message["playerid"] === 1) {
            message["gui_playerID"] = 1;
            sendMessage(message, "player2", state, dispatch);
          }

          break;
      }
      break;

    case "seats":
      seats(message["seats"], dispatch);
      break;

    case "join_req":
      setBalance("player1", message.balance, dispatch);
      sendMessage(message, "dcv", state, dispatch);
      break;

    case "blindsInfo":
      /*update small_blind and big_blind values received from backend to the gui here*/
      console.log(message);
      break;

    default:
      switch (message["action"]) {
	  	/* Here we receive the other players action information*/
        case "check":
        case "call":
        case "raise":
        case "fold":
        case "allin":
          //message["gui_playerID"] = 0;
          //sendMessage(message, "dcv", state, dispatch);
         break;

        default:
          sendMessage(message, "dcv", state, dispatch);
      }
  }
};

export const onMessage_player2 = (message, state, dispatch) => {
  message = JSON.parse(message);
  setLastMessage(message, dispatch);
  log("Received from player2: ", "received", message);

  switch (message["method"]) {
    case "deal":
      dealCards(dispatch);
      setUserSeat("player2", dispatch);
      deal(message, state, dispatch);
      break;

    case "requestShare":
      if (message["toPlayer"] == 0) {
        message["gui_playerID"] = 0;
        sendMessage(message, "player1", state, dispatch);
      }
      break;

    case "share_info":
      if (message["toPlayer"] == 0) {
        message["gui_playerID"] = 0;
        sendMessage(message, "player1", state, dispatch);
      }
      break;

    case "playerCardInfo":
      console.log("playerCardInfo");
      sendMessage(message, "dcv", state, dispatch);
      break;

    case "replay":
      message["method"] = "betting";
      message["gui_playerID"] = 1;
      setActivePlayer("player2", dispatch);
      showControls(true, dispatch);
      break;

    case "betting":
      switch (message["action"]) {
        case "small_blind_bet":
          bet(message["playerid"], message["amount"], state, dispatch);
          setLastAction(message["playerid"], "Small Blind", dispatch);
		  /*	
          message["action"] = "small_blind_bet_player";
          message["gui_playerID"] = 0;
          sendMessage(message, "player1", state, dispatch);

          message["gui_playerID"] = 1;
          sendMessage(message, "player2", state, dispatch);
		  */	
          log("Small Blind has been posted.", "info");
          break;

        case "big_blind_bet":
          bet(message["playerid"], message["amount"], state, dispatch);
          setLastAction(message["playerid"], "Big Blind", dispatch);
		 /*	
          message["action"] = "big_blind_bet_player";

          message["gui_playerID"] = 0;
          sendMessage(message, "player1", state, dispatch);

          message["gui_playerID"] = 1;
          sendMessage(message, "player2", state, dispatch);
          */
          log("Big Blind has been posted.", "info");
          break;

        case "round_betting":
          /*
          message["method"] = "replay";
          message["playerid"] === 0 &&
            sendMessage(message, "player1", state, dispatch);
          message["playerid"] === 1 &&
            sendMessage(message, "player2", state, dispatch);
          */
          setActivePlayer("player2", dispatch);
          updateTotalPot(message["pot"], dispatch);
          showControls(true, dispatch);
          break;

        default:
          if (message["playerid"] === 0) {
            message["gui_playerID"] = 0;
            sendMessage(message, "player1", state, dispatch);
          } else if (message["playerid"] === 1) {
            message["gui_playerID"] = 1;
            sendMessage(message, "player2", state, dispatch);
          }

          break;
      }

      break;

    case "seats":
      seats(message["seats"], dispatch);
      break;

    case "join_req":
      setBalance("player2", message.balance, dispatch);
      sendMessage(message, "dcv", state, dispatch);
      break;

    case "blindsInfo":
      /*update small_blind and big_blind values received from backend to the gui here*/
      console.log(message);
      break;

    default:
      switch (message["action"]) {
	  	/* Here we receive the other players action information*/
        case "check":
        case "call":
        case "raise":
        case "fold":
        case "allin":
          //message["gui_playerID"] = 1;
          //sendMessage(message, "dcv", state, dispatch);
          break;

        default:
          sendMessage(message, "dcv", state, dispatch);
      }
  }
};
