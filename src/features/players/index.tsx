import { useState, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation, Outlet } from "react-router-dom";
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

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: "players", label: "Spieler", icon: "\u{1F464}" },
  { value: "teams", label: "Teams", icon: "\u{1F91D}" },
];

export default function PlayersMode() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const players = useAppStore((s) => s.players);
  const addPlayer = useAppStore((s) => s.addPlayer);
  const updatePlayer = useAppStore((s) => s.updatePlayer);
  const deletePlayer = useAppStore((s) => s.deletePlayer);
  const addTeam = useAppStore((s) => s.addTeam);
  const updateTeam = useAppStore((s) => s.updateTeam);

  // Derive current view from URL
  const pathname = location.pathname;
  const playerId = params.playerId;

  const view = useMemo(() => {
    if (pathname === "/players/new") return "form" as const;
    if (pathname === "/players/teams/new") return "team-form" as const;
    if (pathname === "/players/teams") return "team-list" as const;
    if (playerId && pathname.endsWith("/edit")) return "edit" as const;
    if (playerId) return "detail" as const;
    return "list" as const;
  }, [pathname, playerId]);

  // Derive tab from URL
  const tab: Tab = pathname.startsWith("/players/teams") ? "teams" : "players";

  // Find selected player from URL param
  const selectedPlayer = useMemo(() => {
    if (!playerId) return null;
    return players.find((p) => p.id === playerId) ?? null;
  }, [playerId, players]);

  // Editing player for edit view
  const editingPlayer = view === "edit" ? selectedPlayer ?? undefined : undefined;

  const [editingTeam, setEditingTeam] = useState<Team | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleSelect = useCallback((player: Player) => {
    navigate(`/players/${player.id}`);
  }, [navigate]);

  const handleAdd = useCallback(() => {
    navigate("/players/new");
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (selectedPlayer) {
      navigate(`/players/${selectedPlayer.id}/edit`);
    }
  }, [selectedPlayer, navigate]);

  const handleSave = useCallback(
    (player: Player) => {
      if (editingPlayer) {
        updatePlayer(player.id, player);
      } else {
        addPlayer(player);
      }
      navigate(`/players/${player.id}`);
    },
    [editingPlayer, addPlayer, updatePlayer, navigate],
  );

  const handleDelete = useCallback(() => {
    if (!selectedPlayer) return;
    setDeleteTarget(selectedPlayer.id);
  }, [selectedPlayer]);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deletePlayer(deleteTarget);
      setDeleteTarget(null);
      navigate("/players");
    }
  }, [deleteTarget, deletePlayer, navigate]);

  const handleSaveTeam = useCallback(
    (team: Team) => {
      if (editingTeam) {
        updateTeam(team.id, team);
      } else {
        addTeam(team);
      }
      setEditingTeam(undefined);
      navigate("/players/teams");
    },
    [editingTeam, addTeam, updateTeam, navigate],
  );

  const handleStartTraining = useCallback(
    (playerId: string) => {
      navigate("/train", { state: { initialPlayerId: playerId } });
    },
    [navigate],
  );

  const handleTabChange = useCallback((t: Tab) => {
    if (t === "teams") {
      navigate("/players/teams");
    } else {
      navigate("/players");
    }
    setEditingTeam(undefined);
  }, [navigate]);

  // Team form view
  if (view === "team-form") {
    return (
      <>
        <TeamForm
          team={editingTeam}
          onSave={handleSaveTeam}
          onCancel={() => {
            setEditingTeam(undefined);
            navigate("/players/teams");
          }}
        />
        <Outlet />
      </>
    );
  }

  // Player form view (new)
  if (view === "form") {
    return (
      <>
        <PlayerForm
          player={undefined}
          onSave={handleSave}
          onCancel={() => navigate("/players")}
        />
        <Outlet />
      </>
    );
  }

  // Player form view (edit)
  if (view === "edit" && editingPlayer) {
    return (
      <>
        <PlayerForm
          player={editingPlayer}
          onSave={handleSave}
          onCancel={() => navigate(`/players/${editingPlayer.id}`)}
        />
        <Outlet />
      </>
    );
  }

  // Player detail view
  if (view === "detail" && selectedPlayer) {
    return (
      <>
        <PlayerDetail
          player={selectedPlayer}
          onEdit={handleEdit}
          onBack={() => navigate("/players")}
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
        <Outlet />
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
            navigate("/players/teams/new");
          }}
          onEdit={(team) => {
            setEditingTeam(team);
            navigate("/players/teams/new");
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
      <Outlet />
    </div>
  );
}
