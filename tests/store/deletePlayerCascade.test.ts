import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../src/store";

describe("deletePlayer cascade", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
  });

  const player = {
    id: "p1",
    name: "Max",
    preferredPosition: "offense" as const,
    level: "beginner" as const,
    notes: "",
    skillRatings: {
      Torschuss: 3,
      Passspiel: 2,
      Ballkontrolle: 2,
      Defensive: 1,
      Taktik: 2,
      Offensive: 3,
      Mental: 2,
    },
    createdAt: "2026-01-01",
  };

  const otherPlayer = {
    ...player,
    id: "p2",
    name: "Other",
  };

  function seedData() {
    const s = useAppStore.getState();
    s.addPlayer(player);
    s.addPlayer(otherPlayer);

    // Sessions referencing the player
    s.addSession({
      id: "s1",
      name: "Session with p1",
      date: "2026-01-10",
      drillIds: [],
      notes: "",
      totalDuration: 60,
      playerIds: ["p1", "p2"],
      focusAreas: [],
    });
    s.addSession({
      id: "s2",
      name: "Session without p1",
      date: "2026-01-11",
      drillIds: [],
      notes: "",
      totalDuration: 60,
      playerIds: ["p2"],
      focusAreas: [],
    });

    // Evaluations
    s.addEvaluation({
      id: "e1",
      playerId: "p1",
      date: "2026-01-12",
      skillRatings: [{ category: "Torschuss", rating: 4 }],
      notes: "",
    });
    s.addEvaluation({
      id: "e2",
      playerId: "p2",
      date: "2026-01-12",
      skillRatings: [{ category: "Passspiel", rating: 3 }],
      notes: "",
    });

    // Coaching notes
    s.addCoachingNote({
      id: "n1",
      playerId: "p1",
      date: "2026-01-13",
      category: "tactical",
      text: "Needs to work on positioning",
    });
    s.addCoachingNote({
      id: "n2",
      playerId: "p2",
      date: "2026-01-13",
      category: "technical",
      text: "Good ball control",
    });

    // Goals
    s.addGoal({
      id: "g1",
      playerId: "p1",
      title: "Improve shooting",
      category: "Torschuss",
      status: "active",
      createdAt: "2026-01-01",
    });
    s.addGoal({
      id: "g2",
      playerId: "p2",
      title: "Improve passing",
      category: "Passspiel",
      status: "active",
      createdAt: "2026-01-01",
    });

    // PlayerTechniques
    s.addPlayerTechnique({
      id: "pt1",
      playerId: "p1",
      techniqueId: "t1",
      status: "learning",
    });
    s.addPlayerTechnique({
      id: "pt2",
      playerId: "p2",
      techniqueId: "t1",
      status: "proficient",
    });

    // Matches referencing the player
    s.addMatch({
      id: "m1",
      opponent: "Team X",
      date: "2026-01-14",
      sets: [],
      playerIds: ["p1", "p2"],
      createdAt: "2026-01-14",
    });
  }

  it("removes the player from players array", () => {
    seedData();
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.players).toHaveLength(1);
    expect(state.players[0].id).toBe("p2");
  });

  it("removes goals belonging to the deleted player", () => {
    seedData();
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.goals).toHaveLength(1);
    expect(state.goals[0].id).toBe("g2");
  });

  it("removes evaluations belonging to the deleted player", () => {
    seedData();
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.evaluations).toHaveLength(1);
    expect(state.evaluations[0].id).toBe("e2");
  });

  it("removes coaching notes belonging to the deleted player", () => {
    seedData();
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.coachingNotes).toHaveLength(1);
    expect(state.coachingNotes[0].id).toBe("n2");
  });

  it("removes playerTechniques belonging to the deleted player", () => {
    seedData();
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.playerTechniques).toHaveLength(1);
    expect(state.playerTechniques[0].id).toBe("pt2");
  });

  it("cleans playerIds from sessions but keeps sessions", () => {
    seedData();
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.sessions).toHaveLength(2);
    // s1 had ["p1", "p2"], now should only have ["p2"]
    expect(state.sessions.find((s) => s.id === "s1")!.playerIds).toEqual([
      "p2",
    ]);
    // s2 had ["p2"], unchanged
    expect(state.sessions.find((s) => s.id === "s2")!.playerIds).toEqual([
      "p2",
    ]);
  });

  it("cleans playerIds from matches but keeps matches", () => {
    seedData();
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.matches).toHaveLength(1);
    expect(state.matches[0].playerIds).toEqual(["p2"]);
  });

  it("removes teams that include the deleted player", () => {
    seedData();
    // Add a team with p1
    useAppStore.getState().addTeam({
      id: "team1",
      name: "Dream Team",
      playerIds: ["p1", "p2"],
      createdAt: "2026-01-01",
    });
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.teams).toHaveLength(0);
  });

  it("does not affect other players' data", () => {
    seedData();
    useAppStore.getState().deletePlayer("p1");
    const state = useAppStore.getState();
    expect(state.players.find((p) => p.id === "p2")).toBeDefined();
    expect(state.evaluations.find((e) => e.playerId === "p2")).toBeDefined();
    expect(
      state.coachingNotes.find((n) => n.playerId === "p2"),
    ).toBeDefined();
    expect(state.goals.find((g) => g.playerId === "p2")).toBeDefined();
    expect(
      state.playerTechniques.find((pt) => pt.playerId === "p2"),
    ).toBeDefined();
  });
});
