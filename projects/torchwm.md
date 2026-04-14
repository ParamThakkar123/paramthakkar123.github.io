---
layout: page.academic
title: TorchWM
permalink: /projects/torchwm.html
---

## TorchWM

TorchWM is a modular PyTorch library for world models and latent dynamics learning. It includes practical implementations of Dreamer-style agents, PlaNet/RSSM utilities, JEPA-style representation learning, and diffusion/transformer building blocks.

### Highlights

- Modular components for encoders, decoders, RSSMs, reward/value heads, and policies
- **Modular RSSM** with swappable encoder/decoder/backbone for research experiments
- Multiple environment backends: DMC, Gym/Gymnasium, Atari, MuJoCo, Unity ML-Agents
- Replay/memory utilities for both Dreamer and PlaNet-style training loops
- ViT + masking utilities for JEPA workflows
- Diffusion utilities (DDPM schedule + DiT model)

### Quick Start Examples

#### Train Dreamer on Gym

```python
from world_models.models import DreamerAgent
from world_models.configs import DreamerConfig

cfg = DreamerConfig()
cfg.env_backend = "gym"  # dmc | gym | unity_mlagents
cfg.env = "Pendulum-v1"
cfg.total_steps = 10_000

agent = DreamerAgent(cfg)
agent.train()
```

#### Train JEPA

```python
from world_models.models import JEPAAgent
from world_models.configs import JEPAConfig

cfg = JEPAConfig()
cfg.dataset = "imagefolder"
cfg.root_path = "./data"
cfg.image_folder = "train"
cfg.epochs = 10

agent = JEPAAgent(cfg)
agent.train()
```

### Package Layout

- `world_models/models`: Agents and model architectures (`Dreamer`, `JEPAAgent`, `Planet`, ViT, diffusion)
- `world_models/models/modular_rssm`: Modular RSSM with swappable encoder/decoder/backbone
- `world_models/configs`: Config classes (`DreamerConfig`, `JEPAConfig`, `DiTConfig`)
- `world_models/envs`: Environment adapters and wrappers
- `world_models/training`: Script-style training entrypoints
- `world_models/datasets`: CIFAR10/ImageNet/ImageFolder data loaders
- `world_models/memory`: Replay and episodic memory implementations
- `world_models/utils`: Training/logging/distributed helper utilities

### Links

- <a href="https://github.com/ParamThakkar123/torchwm">GitHub Repository</a>
- <a href="https://pypi.org/project/torchwm/">PyPI Package</a>

Skills: PyTorch, World Models, Reinforcement Learning, Deep Learning