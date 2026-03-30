import { useState, useCallback } from "react";
import { useAppStore } from "../../store";
import { ConfirmDialog } from "../../components/ui";
import { PlayerList } from "./PlayerList";
import { PlayerDetail } from "./PlayerDetail";
import { PlayerForm } from "./PlayerForm";
import type { Player } from "../../domain/models/Player";

type View = "list" | "detail" | "form";

export default function PlayersMode() {
  const players = useAppStore((s) => s.players);
  const addPlayer = useAppStore((s) => s.addPlayer);
  const updatePlayer = useAppStore((s) => s.updatePlayer);
  const deletePlayer = useAppStore((s) => s.deletePlayer);

  const [view, setView] = useState<View>("list");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleSelect = useCallback((player: Player) => {
    setSelectedPlayer(player);
    setView("detail");
  }, []);

  const handleAdd = useCallback(() => {
    setEditingPlayer(undefined);
    setView("form");
  }, []);

  const handleEdit = useCallback(() => {
    setEditingPlayer(selectedPlayer ?? undefined);
    setView("form");
  }, [selectedPlayer]);

  const handleSave = useCallback(
    (player: Player) => {
      if (editingPlayer) {
        updatePlayer(player.id, player);
      } else {
        addPlayer(player);
      }
      setSelectedPlayer(player);
      setView("detail");
    },
    [editingPlayer, addPlayer, updatePlayer],
  );

  const handleDelete = useCallback(() => {
    if (!selectedPlayer) return;
    setDeleteTarget(selectedPlayer.id);
  }, [selectedPlayer]);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deletePlayer(deleteTarget);
      setDeleteTarget(null);
      setSelectedPlayer(null);
      setView("list");
    }
  }, [deleteTarget, deletePlayer]);

  return (
    <>
      {view === "list" && (
        <PlayerList players={players} onSelect={handleSelect} onAdd={handleAdd} />
      )}
      {view === "detail" && selectedPlayer && (
        <PlayerDetail
          player={
            players.find((p) => p.id === selectedPlayer.id) ?? selectedPlayer
          }
          onEdit={handleEdit}
          onBack={() => setView("list")}
          onDelete={handleDelete}
        />
      )}
      {view === "form" && (
        <PlayerForm
          player={editingPlayer}
          onSave={handleSave}
          onCancel={() =>
            setView(selectedPlayer ? "detail" : "list")
          }
        />
      )}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Spieler l&ouml;schen"
        message="M&ouml;chtest du diesen Spieler wirklich l&ouml;schen? Diese Aktion kann nicht r&uuml;ckg&auml;ngig gemacht werden."
      />
    </>
  );
}
