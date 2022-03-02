import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface IPlayer {
  id: number;
  name: string;
  lives: number;
}

export default function Players(): JSX.Element {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [newPlayer, setNewPlayer] = useState<string>("");

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

    const socket = io("https://c3-party-be.rajwinderbhatoe.repl.co");

    socket.on("players", (receivedPlayers: IPlayer[]) => {
      console.log("socketio got: Players");
      setPlayers(receivedPlayers);
    });

    console.log("socket registered listeners");

    function desubscribe() {
      console.log("closing socket.io socket");
      socket.disconnect();
    }
    return desubscribe;
  }, []);

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
    </>
  );
}
