---
title: "How I Turned Competitive Pokemon Into an RL Environment for LLMs"
date: 2026-04-09
categories: [Research, RL, LLM]
type: research
summary: "WolfeClick wraps Pokemon Showdown as an OpenEnv-compatible environment so LLMs can learn legal action selection and long-horizon strategy from live battles."
image: "/images/default.jpg"
external_url:
---

# How I turned competitive Pokemon into an RL environment for LLMs

## Why I picked Pokemon

Most LLM environments are either too toy-like or too clean. The model gets a neatly packaged state, the reward is obvious, and there is no real adversary trying to exploit mistakes. I wanted something harder: hidden information, delayed rewards, legal action constraints, and another agent actively pushing back.

Competitive Pokemon turned out to be a much better fit than I expected.

On the surface, Pokemon does not sound like a serious benchmark for language-model reasoning. But competitive Pokemon is really about uncertainty, tempo, resource preservation, and long-term consequences. Rock-paper-scissors gives a tiny example of cyclic matchups where the right action depends on what the other side is likely to do. Pokemon scales that idea up dramatically: type matchups, switching, partial information, setup turns, status effects, and positions where the move that looks best right now is exactly the move that loses the game later.

That makes it a rich environment for long-horizon planning and situational awareness.

## Turning Showdown into an environment

WolfeClick wraps Pokemon Showdown as an OpenEnv-compatible environment. Instead of treating the simulator like an external tool that an LLM pokes through brittle prompting, I wanted a proper RL loop:

1. The environment emits an observation.
2. The model chooses one action.
3. The simulator advances one step.
4. The environment returns the next observation and reward.

Under the hood:

- **Showdown** is the battle engine.
- **poke-env** manages interaction with Showdown.
- **WolfeClick environment wrapper** transforms battle state into model-usable observations, enforces legality, tracks revealed opponent information, and computes per-step rewards.

This makes the system feel less like a one-off demo and more like a reusable training environment.

## What the model sees

One of the key design choices was deciding what information the model should receive. I did not want to leak hidden state, but I also did not want observations so sparse they became unusable.

The final state representation is a structured text view containing:

- Active field state
- Full information for the model's own team
- Opponent information revealed so far
- Exact legal actions on the current turn

In practice, this includes active Pokemon, HP, status, item/ability if known, available moves, switch options, and an evolving memory of opponent reveals. That memory matters because Pokemon is partially observable: good play depends on updating beliefs from revealed evidence, not only reacting to the current frame.

The legal-action list also makes the task crisp. The model is not asked to write an essay. It is asked to choose one valid decision.

## Action format

To constrain the action space, the model outputs exactly one JSON object.

Early on, I learned this could not be left to prompting alone, so I did a short SFT warmup to make schema adherence reliable. Once format stability improved, RL could focus on strategy rather than malformed outputs.

```json
{"action": "move" | "switch", "choice": "Exact Name of Move or Pokemon"}
```

This matters for two reasons:

1. It forces concrete decisions instead of vague reasoning.
2. It makes validation immediate for malformed, hallucinated, or illegal actions.

That turns the setup into a verifiable reward problem.

## Reward design

This is where the environment becomes genuinely strategic instead of a formatting task.

A pure win/loss reward is too sparse for short runs. If useful signal only arrives at battle end, training is slow and unstable while the model is still learning legality and basic action quality. I shaped reward around intermediate battle events while keeping it tied to winning actual games.

Reward structure:

- Team HP changes by 10%: `-1.0` per 10% HP lost, `+1.0` per 10% HP removed from opponent
- Pokemon faints: `-3.0` if your Pokemon faints, `+3.0` if opponent faints
- Super-effective move: `+0.5`
- Move has no effect (immunity/no effect): `-1.0`
- Move misses: `-0.25`
- Healing: `+1.0` per 10% healed, capped at `+3.0` per battle
- Team status cured: `+1.0`
- Setup boosts for your active Pokemon: `+0.5` per stage, capped at `+2.0` per Pokemon, only if above 50% HP
- Opponent setup boosts: `-0.5` per stage gained by opponent
- Passive damage on opponent: `0.01 x cumulative passive hits`
- Your team gets burned/poisoned/badly poisoned: `-0.5`
- Your team gets paralyzed/frozen/asleep/confused: `-1.0`
- Illegal action output: `-10.0`

Some details are important:

- Damage and knockouts are symmetric and interpretable, so they anchor the signal.
- Healing/setup are capped to prevent reward farming loops.
- Setup is rewarded only above half HP to discourage reckless greed.
- Passive damage is incremental, acknowledging strategic pressure without overwhelming the objective.

The result is denser but still strategy-aligned: deal meaningful damage, preserve resources, pressure the opponent, and avoid illegal or low-value actions.

## Training loop

Once the environment was stable, the training loop was straightforward:

1. The model plays live Showdown battles.
2. I record trajectories from those battles.
3. I train a LoRA adapter on those trajectories with GRPO.

I used `Qwen3-4B-Instruct` as the base model and trained LoRA adapters (not full checkpoints) for faster iteration.

What mattered most to me was grounding. The model does not learn from static preference pairs about Pokemon. It learns from consequences inside the environment. Bad switch decisions are punished by state transitions and reward. Useful aggressive lines and resource-preserving play show up in trajectories as positive signal.

## What was harder than expected

The hardest part was observability, not raw modeling.

If you only inspect aggregate reward, it is hard to know what is actually happening:

- Did the model improve, or just get lucky?
- Is it respecting legal action space, or being silently corrected?
- Is reward rising from strategy, or from artifacts?

So I invested heavily in logging and replay tooling:

- Recorded battle logs with detailed per-turn information
- Converted logs into replay-friendly JSON
- Built a viewer to inspect turn-by-turn observations, legal actions, chosen actions, and reward changes

This made behavior legible rather than opaque.

## What worked (and what still does not)

What works:

- The full end-to-end loop runs.
- A relatively small LLM can operate in a live multi-agent environment.
- Strict action constraints and real rollouts are practical.

What still does not:

- Rollout collection is slower than training.
- Reward is still noisy.
- Random legal-action opponents are only a weak baseline.

The next real step is not claiming "the model is good at Pokemon." It is benchmarking against stronger heuristic/non-random opponents and tightening reward to better reflect true strategic quality.

## Why this matters

For me, this project is bigger than Pokemon.

Pokemon is the concrete world I used to package an agent problem that appears everywhere: act under uncertainty, respect hard constraints, update beliefs from partial information, and trade short-term gain for long-term outcomes.

Competitive Pokemon bundles all of that into a compact, testable, and unforgiving environment. That is exactly why it works so well as a benchmark and training ground for LLM agents.

## Links

- Replay viewer: [WolfeClick Space](https://huggingface.co/spaces/Atharva2099/WolfeClick)
- Code: [OpenEnv-WolfeClick](https://github.com/Atharva2099/OpenEnv-WolfeClick)
- Model weights: [openenv-smogon-rl](https://huggingface.co/Atharva2099/openenv-smogon-rl)
