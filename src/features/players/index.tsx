import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
import { ConfirmDialog, Tabs } from "../../components/ui";
import { PlayerList } from "./PlayerList";
import { PlayerDetail } from "./PlayerDetail";
import { PlayerForm } from "./PlayerForm";
import { TeamList } from "./TeamList";
import { TeamForm } from "./TeamForm";
import type { Player } from "../../domain/models/Player";
import type { Team } from "../../domain/models/Team";

type Tab = "players" | "teams";
type View = "list" | "detail" | "form" | "team-form";

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: "players", label: "Spieler", icon: "\u{1F464}" },
  { value: "teams", label: "Teams", icon: "\u{1F91D}" },
];

export default function PlayersMode() {
  const navigate = useNavigate();
  const players = useAppStore((s) => s.players);
  const addPlayer = useAppStore((s) => s.addPlayer);
  const updatePlayer = useAppStore((s) => s.updatePlayer);
  const deletePlayer = useAppStore((s) => s.deletePlayer);
  const addTeam = useAppStore((s) => s.addTeam);
  const updateTeam = useAppStore((s) => s.updateTeam);

  const [tab, setTab] = useState<Tab>("players");
  const [view, setView] = useState<View>("list");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>();
  const [editingTeam, setEditingTeam] = useState<Team | undefined>();
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

  const handleSaveTeam = useCallback(
    (team: Team) => {
      if (editingTeam) {
        updateTeam(team.id, team);
      } else {
        addTeam(team);
      }
      setEditingTeam(undefined);
      setView("list");
    },
    [editingTeam, addTeam, updateTeam],
  );

  const handleStartTraining = useCallback(
    (playerId: string) => {
      // Navigate to train mode with player pre-selected via query param
      navigate("/train", { state: { initialPlayerId: playerId } });
    },
    [navigate],
  );

  const handleTabChange = useCallback((t: Tab) => {
    setTab(t);
    setView("list");
    setSelectedPlayer(null);
    setEditingPlayer(undefined);
    setEditingTeam(undefined);
  }, []);

  // Team form view
  if (view === "team-form") {
    return (
      <TeamForm
        team={editingTeam}
        onSave={handleSaveTeam}
        onCancel={() => {
          setEditingTeam(undefined);
          setView("list");
        }}
      />
    );
  }

  // Player form view
  if (view === "form") {
    return (
      <PlayerForm
        player={editingPlayer}
        onSave={handleSave}
        onCancel={() => setView(selectedPlayer ? "detail" : "list")}
      />
    );
  }

  // Player detail view
  if (view === "detail" && selectedPlayer) {
    return (
      <>
        <PlayerDetail
          player={
            players.find((p) => p.id === selectedPlayer.id) ?? selectedPlayer
          }
          onEdit={handleEdit}
          onBack={() => setView("list")}
          onDelete={handleDelete}
          onStartTraining={handleStartTraining}
        />
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

  // List view with tabs
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <Tabs tabs={TABS} active={tab} onChange={handleTabChange} />

      {tab === "players" && (
        <PlayerList players={players} onSelect={handleSelect} onAdd={handleAdd} />
      )}

      {tab === "teams" && (
        <TeamList
          onAdd={() => {
            setEditingTeam(undefined);
            setView("team-form");
          }}
          onEdit={(team) => {
            setEditingTeam(team);
            setView("team-form");
          }}
        />
      )}

      {tab === "players" && (
        <ConfirmDialog
          open={deleteTarget !== null}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title="Spieler l&ouml;schen"
          message="M&ouml;chtest du diesen Spieler wirklich l&ouml;schen? Diese Aktion kann nicht r&uuml;ckg&auml;ngig gemacht werden."
        />
      )}
    </div>
  );
}
