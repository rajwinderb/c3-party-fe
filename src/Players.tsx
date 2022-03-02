import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface IPlayer {
  id: number;
  name: string;
  lives: number;
}

export default function Players(): JSX.Element {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [newPlayer, setNewPlayer] = useState<string>("");
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();

  const handleAddPlayer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post(`https://c3-party-be.rajwinderbhatoe.repl.co/players`, {
      name: newPlayer,
    });
    setNewPlayer("");
  };

  async function fetchAndStorePlayers() {
    try {
      const res = await axios.get(
        `https://c3-party-be.rajwinderbhatoe.repl.co/players`
      );
      console.log("it's worked");
      console.log(res.data);
      setPlayers(res.data);
    } catch (err) {
      console.error("error fetching players", err);
    }
  }
  useEffect(() => {
    fetchAndStorePlayers();
  }, []);

  useEffect(() => {
    console.log("Trying to set up socket.io");

    socket.current = io("https://c3-party-be.rajwinderbhatoe.repl.co");

    socket.current.on("players", (receivedPlayers: IPlayer[]) => {
      console.log("socketio got: Players");
      setPlayers(receivedPlayers);
    });

    console.log("socket registered listeners");

    function desubscribe() {
      if (socket.current) {
        console.log("closing socket.io socket");
        socket.current.disconnect();
      }
    }
    return desubscribe;
  }, []);

  const joinRoomMessage = () => {
    console.log("room 1 joined");
  };

  const handleJoinRoom = () => {
    if (socket.current) {
      socket.current.emit("create", 1, joinRoomMessage);
    }
  };

  return (
    <>
      {players.map((player: IPlayer) => (
        <p key={player.id}>
          {player.name}, {player.lives}
        </p>
      ))}
      <form onSubmit={handleAddPlayer}>
        <input
          placeholder="Enter player name..."
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <button type="button" onClick={handleJoinRoom}>
        Join Room 1
      </button>
    </>
  );
}
