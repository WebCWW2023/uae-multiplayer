const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  pingTimeout: 2500,
  pingInterval: 5000,
});
var mysql = require("mysql2");
var moment = require("moment");
const webrtc = require("wrtc");
const tokenGenerator = require("./tokenGeneration").generateToken;

/*-----------------database connection-------------------*/
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "user_saas2023",
//   password: "hj0n4J39^",
//   database: "admin_saas2023",
// });

app.use(express.static("."));

/*-----------------admin-------------------*/
app.get("/a", (req, res) => {
  res.redirect(`/game/admin.html`);
});

/*-----------------public-------------------*/
app.get("", (req, res) => {
  res.redirect(
    `game/game.html?id=1&name=ashish&isadmin=true&room=test-hall2`
  );
});
app.get("/2", (req, res) => {
  res.redirect(
    `game/game.html?id=2&name=mohit&isadmin=true&room=test-hall2`
  );
});

var playerList = {};
var playerVoiceList = {};
let senderStream;
let peers = {};

app.get("/r", (req, res) => {
  playerList = {};
  res.redirect(`/game/game.html?id=1&name=bhagvat&isadmin=true&room=room_1`);
});

const deleteAvtarObject2 = (allPlayers, socketId) => {
  Object.keys(allPlayers).map((room) => {
    if (Object.keys(playerList[room]).includes(socketId)) {
      delete playerList[room][socketId];
      playerVoiceList[room] && delete playerVoiceList[room][socketId];
    }
    if (Object.keys(playerList[room]).length === 0) {
      delete playerList[room];
      delete playerVoiceList[room];
    }
  });
};
/*-----------------connection-------------------*/
io.on("connection", (socket) => {
  //Check DB for agora Token
  socket.on("checkAgoraToken", (roomName) => {
    let agoraToken;
    var CurrentDate = moment();
    con.connect(function (err) {
      if (err) throw err;
      con.query(
        `SELECT token, time_stamp FROM agora_token where room_name= "${roomName}"`,
        function (err, result, fields) {
          if (err) throw err;

          if (result && result.length > 0) {
            const period = CurrentDate.diff(result[0].time_stamp, "seconds");
            if (period > 86400) {
              const newToken = tokenGenerator(roomName);
              const updateRow = `update agora_token set token="${newToken}", time_stamp="${CurrentDate.format()}" where room_name="${roomName}"`;
              con.connect(function (err) {
                if (err) throw err;
                con.query(updateRow, function (err, result, fields) {
                  if (err) throw err;
                });
              });
              socket.emit("getTokenFromDB", newToken);
            } else {
              socket.emit("getTokenFromDB", result[0].token);
            }
          } else {
            const randomID = Math.random().toString().slice(2, 11);
            const newToken = tokenGenerator(roomName);
            const insertRow = `insert into agora_token values (${randomID},"${newToken}","${roomName}","${CurrentDate.format()}" )`;
            con.connect(function (err) {
              if (err) throw err;
              con.query(insertRow, function (err, result, fields) {
                if (err) throw err;
              });
            });
            socket.emit("getTokenFromDB", newToken);
          }
        }
      );
    });
  });
  /*-----------------addPlayer-------------------*/
  socket.on("addPlayer", (data) => {
    if (data.socket_id) {
      socket.join(data.roomName);

      Object.values(playerList).map((room) => {
        Object.values(room).map((playerItem) => {
          if (playerItem.avtarName === data.avtarName) {
            delete playerList[playerItem.roomName][playerItem.socket_id];
            playerVoiceList[room] && delete playerVoiceList[room][socketId];

            io.to(data.roomName).emit("removePlayer", {
              socket_id: playerItem.socket_id,
            });
          }
        });
      });

      playerList[data.roomName] = {
        ...playerList[data.roomName],
        [String(data.socket_id)]: data,
      };
      io.to(data.roomName).emit("addPlayer", playerList[data.roomName]);
    }
  });

  /*-----------------updatePlayer-------------------*/
  socket.on("updatePlayer", (data) => {
    playerList[data.roomName][String(data.socket_id)].position = data.position;
    playerList[data.roomName][String(data.socket_id)].rotation = data.rotation;
    data.voiceId = playerList[data.roomName][String(data.socket_id)].voiceId;
    socket.to(data.roomName).emit("updatePlayer", data);
  });

  /*-----------------addVoiceId-------------------*/
  socket.on("addVoiceId", (data) => {
    Object.values(playerList[data.roomName]).map((playerItem) => {
      if (playerItem.avtarName === data.avtarName) {
        playerList[data.roomName][playerItem.socket_id] = {
          ...playerItem,
          voiceId: data.voiceId,
        };
        playerVoiceList[data.roomName] = {
          ...playerVoiceList[data.roomName],
          [String(playerItem.socket_id)]: data,
        };
        io.to(data.roomName).emit(
          "addAvtarToSidebar",
          playerVoiceList[data.roomName]
        );
      }
    });
    // console.log('---------------------:',)
    // console.log('playerList:', playerList)
    // console.log('playerVoiceList:', playerVoiceList)
  });
 
  /*-----------------createEmoji-------------------*/
  socket.on("createEmoji", (data) => {
    socket.to(data.roomName).emit("createEmoji", data);
  });
  /*-----------------disconnect-------------------*/
  socket.on("disconnect", () => {
    deleteAvtarObject2(playerList, socket.id);
    socket.broadcast.emit("removePlayer", {
      socket_id: socket.id,
    });
  });

  socket.on("receiveData", () => {
    io.emit("receiveData", playerList);
  });

  socket.on("deletePlayerAdmin", (data) => {
    delete playerList[data.roomName][data.socket_id];
    (playerVoiceList.length > 0) && delete playerVoiceList[data.roomName][socket.id];
    io.to(data.roomName).emit("removePlayer", {
      socket_id: data.socket_id,
    });
  });
 

});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { });
