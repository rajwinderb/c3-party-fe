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

  useEffect(() => {
    console.log("Trying to set up socket.io");

    const socket = io("https://localhost:3001");

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
    </>
  );
}
