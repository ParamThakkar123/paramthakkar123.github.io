# The Inner Workings of Transformer Based Language Models

## Introduction

We can categorize the Language Model interpretability approaches along two dimensions: 

1. Localizing the inputs or model components responsible for a particular prediction
2. Decoding information stored in learned representations to understand its usage across network components

## Components of a Transformer Language Model

- Auto-regressive language models assign probabilities to sequences of tokens. Using the probability chain rule, we can decompose the probability distribution over a sequence $\mathbf{t} = \langle t_{1}, t_{2}, \ldots, t_{n} \rangle$ into a product of conditional distributions:

$P(t_{1}, \ldots, t_{n}) = P(t_{1}) \prod_{i=1}^{n-1} P(t_{i+1} \mid t_{1}, \ldots, t_{i})$

Such distributions can be parametrize using a neural network optimized to maximize the likelihood of a corpus used for training

A decoder-only model `f` has `L` layers, and operates on a sequence of embeddings $\mathbf{x} = \langle x_{1}, x_{2}, \ldots, x_{n} \rangle$ representing the tokens $\mathbf{t} = \langle t_{1}, t_{2}, \ldots, t_{n} \rangle$. Each embedding $x \in \mathbb{R}^d$ is a row vector corresponding to a row of the embedding matrix $\mathbf{W}_E \in \mathbb{R}^{\abs{\mathcal{V}} \times d}$, where $\mathcal{V}$ is the model vocabulary. Intermediate layer representations, for instance at position $i$ and layer $l$, are referred to as $x_i^l$. By $\textbf{X} \in \mathbb{R}^(n \times d)$ we represent the sequence $x$ as a matrix with embeddings stacked as rows. For intermediate representations, $\textbf{X}_{\leq i}^l$ is the layer $l$ representation matrix up to position $i$. From the residual stream perspective, each input embedding gets updated via vector additions from the attention and feed-forward blocks, producing residual stream states (or intermediate representations). The final layer residual stream state is then projected into the vocabulary space via the unembedding matrix $\mathbf{W}_U \in \mathbb{R}^{|\mathcal{V}| \times d}$ and normalized via the softmax function to obtain the probability distribution over the vocabulary from which a new token is sampled.

## Transformer Layer

### Layer Normalization

- Layer normalization (LayerNorm) is a common operation used to stabilize the training process in deep neural networks.
- Early transformer models implemented LayerNorm at the output of each block, modern models consistently normalize preceding each block.
- Given a representation $z$, the LayerNorm computes : 
$\left( \frac{z - \mu(z)}{\sigma(z)} \right) \odot \gamma + \beta$, where $\mu$ and $\sigma$ calculate the mean and standard deviation, and $\gamma \in \mathbb{R}^d$ and $\beta \in \mathbb{R}^d$ refer to the learned element-wise transformation and bias respectively.
- Layer normalization can be interpreted geometrically by visualizing the mean subtraction operation as a projection of input representations onto a hyperplane defined by the normal vector $[1, 1, \ldots, 1] \in \mathbb{R}^d$, and the following scaling to $\sqrt{d}$ norm as a mapping of the resulting representations to a hypersphere.
- LayerNorm can be treated as an affine transformation $z\textbf{L} + \beta$, as long as $\sigma(z)$ is considered as constant.
- In this view, the matrix $\textbf{L}$ computes the centering and scaling operations.
- The weights of the affine transformations can be folded into the linear layer, simplifying the analysis.
- In language models such as Llama 2, an alternative normalization procedure is adopted which is known as RMSNorm, where the centering operation is removed, and scaling is performed using the root mean square (RMS) statistic.

### Attention Block

- Attention is a key mechanism that allows Transformers to contextualize token representations at each layer.
- The attention block is composed of multiple attention heads.
- At each decoding step $i$, each attention head reads from residual streams across previous positions ($\leq i$), decides which positions to attend to, gathers information from those, and finally writes it to the current residual stream.
- Every attention head computes:
$\text{Attn}^{l,h}\!\left(X^{l-1}_{\leq i}\right) = \sum_{j \leq i} a^{l,h}_{i,j} \, x^{l-1}_j W^{l,h}_V W^{l,h}_O$
$= \sum_{j \leq i} a^{l,h}_{i,j} \, x^{l-1}_j W^{l,h}_{OV}.$

The learnable weight matrices $\textbf{W}^{l, h}_V \in \mathbb{R}^{d \times d_h}$ and $\textbf{W}_O^{l, h} \in \mathbb{R}^{d_h \times d}$ where $d_h$ represents the dimension of each head, are combined into the $OV$ matrix $\textbf{W}_V^{l, h} \textbf{W}^{l, h}_O = \textbf{W}^{l, h}_{OV} \in \mathbb{R}^{d \times d}$, also referred to as $OV (output-value)$ circuit. The attention weights for every key ($\leq i$) given the current query ($\leq i$) are obtained as: 

$a^{l,h}_i = \text{softmax} \left( \frac{ \left( x^{l-1}_i W^{l,h}_Q \right) \left( X^{l-1}_{\leq i} W^{l,h}_K \right)^\top }{ \sqrt{d_h} } \right)$

$= \text{softmax} \left( \frac{ x^{l-1}_i W^{h}_{QK} \, {X^{l-1}_{\leq i}}^\top }{ \sqrt{d_h} } \right)$

with $\textbf{W}^{l, h}_Q \in \mathbb{R}^{d \times d_h}$ and $\textbf{W}^{l, h}_K \in \mathbb{R}^{d \times d_h}$ combining as the $QK (query-key)$ circuit $\textbf{W}^{h}_Q \textbf{W}^{h}_K = \textbf{W}^{h}_QK \in \mathbb{R}^{d \times d}$

The decomposition enables a view of $QK$ and $OV$ circuits as units responsible for reading from and writing (in case of the $OV$ circuit) to the residual stream. The attention block output is the sum of individual attention heads, which is subsequently added back into the residual stream:

$\text{Attn}^l \!\left( X^{l-1}_{\leq i} \right) 
= \sum_{h=1}^{H} \text{Attn}^{l,h} \!\left( X^{l-1}_{\leq i} \right),$

$x_i^{\text{mid}, l} = x_i^{l-1} + \text{Attn}^l \!\left( X^{l-1}_{\leq i} \right).$

### Feedforward Network Block
- The feedforward network (FFN) in the transformer block is composed of two learnable weight matrices: $\textbf{W}^{l}_{in} \in \mathbb{R}^{d \time d_{ffn}}$ and $\textbf{W}^{l}_{out} \in \mathbb{R}^{d \time d_{ffn}}$
- $\textbf{W}^{l}_{in} reads from the residual stream state x^{mid, l}_i and result is passed through an element-wise non-linear activation function g, producing neuron activations. These get transformed by \textbf{W}^l_out$ to produce the output FFN($x^{mid}_i$), which is then added back to the residual stream:

$FFN^l(x^{mid, l}_i) = g(x^{mid, i}_i W^l_in)W^l_{out}$
$x^l_i = x^{mid, l}_i + FFN^l{x^{mid, l}_i}$

The computation described was equated to key-value memory retrieval, with keys ($w^l_{in}$) stored in columns of $\textbf{W}^l_in$ acting as pattern detectors over the input sequence and values $w^l_out$ rows of $W^l_out$ being upweighted by each neuron activation.