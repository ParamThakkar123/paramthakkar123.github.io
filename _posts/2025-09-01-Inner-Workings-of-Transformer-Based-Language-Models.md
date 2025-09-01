# The Inner Workings of Transformer Based Language Models

## Introduction

We can categorize the Language Model interpretability approaches along two dimensions: 

1. Localizing the inputs or model components responsible for a particular prediction
2. Decoding information stored in learned representations to understand its usage across network components

## Components of a Transformer Language Model

- Auto-regressive language models assign probabilities to sequences of tokens. Using the probability chain rule, we can decompose the probability distribution over a sequence \[ \mathbf{t} = \langle t_{1}, t_{2}, \ldots, t_{n} \rangle\] into a product of conditional distributions:

\[
P(t_{1}, \ldots, t_{n}) = P(t_{1}) \prod_{i=1}^{n-1} P(t_{i+1} \mid t_{1}, \ldots, t_{i})
\]

Such distributions can be parametrize using a neural network optimized to maximize the likelihood of a corpus used for training